import { prisma } from '@repo/db'
import { NextResponse } from 'next/server'
import { checkAuthorization } from '../../../../../lib/validators/user.validator'
import { validateSchema } from '../../../../../lib/validators/schema.validator'
import { newStatusSchema } from '../../../../../lib/validators.schema/auth.schema'
import { checkBoardAccess } from '../../../../../lib/validators/membership.validator'
import { json, z, ZodError } from 'zod'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ boardId: string; columnId: string }> },
) {
  try {
    const session = await checkAuthorization()
    const { boardId, columnId } = await params
    const reqBody = await req.json()

    const validated = validateSchema(newStatusSchema, {
      body: reqBody,
    })

    const { status } = validated.body

    //@ts-ignore
    const currentUserID = session?.user?.id

    const checkmembership = await checkBoardAccess(boardId, currentUserID)
    if (!checkmembership) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    if (checkmembership.role === 'VIEWER') {
      return NextResponse.json(
        { message: 'Insufficient permission.' },
        { status: 403 },
      )
    }
    const result = await prisma.boardColumn.updateMany({
      where: {
        id: columnId,
        boardId: boardId,
      },
      data: { name: status },
    })
    console.log(JSON.stringify(result))
    if (result.count === 0) {
      return NextResponse.json(
        { message: 'Status not found in this board.' },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        message: 'Status renamed successfully',
      },
      { status: 200 },
    )
  } catch (err) {
    if (err instanceof Error && err.message == 'UNAUTHORIZED') {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'You must be logged in !',
          },
        },
        { status: 401 },
      )
    }

    if (err instanceof ZodError) {
      const errorTree = z.treeifyError(err)

      return NextResponse.json(
        {
          error: 'Invalid inputs',
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Something went wrong',
        },
      },
      { status: 500 },
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ boardId: string; columnId: string }> },
) {
  try {
    const session = await checkAuthorization()
    const { boardId, columnId } = await params

    //@ts-ignore
    const currentUserID = session?.user?.id

    const checkMembership = await checkBoardAccess(boardId, currentUserID)

    if (!checkMembership || checkMembership.role === 'VIEWER') {
      return NextResponse.json(
        { message: 'Insufficient permission.' },
        { status: 403 },
      )
    }

    await prisma.$transaction(async (tx) => {
      // Fetch default column
      const defaultColumn = await tx.boardColumn.findFirst({
        where: {
          boardId,
          isDefault: true,
        },
        select: { id: true },
      })

      if (!defaultColumn) {
        throw new Error('NO_DEFAULT')
      }

      // 2️⃣ Move tasks first (FK safety)
      await tx.task.updateMany({
        where: {
          boardId,
          columnId,
        },
        data: {
          columnId: defaultColumn.id,
        },
      })

      // Scoped delete
      const deleted = await tx.boardColumn.deleteMany({
        where: {
          id: columnId,
          boardId,
          isDefault: false,
        },
      })

      if (deleted.count === 0) {
        throw new Error('NOT_FOUND_OR_DEFAULT')
      }
    })

    return NextResponse.json(
      { message: 'Status deleted and tasks moved to Not Started' },
      { status: 200 },
    )
  } catch (err) {
    if (err instanceof Error && err?.message === 'NOT_FOUND_OR_DEFAULT') {
      return NextResponse.json(
        { message: 'Status not found or default cannot be deleted.' },
        { status: 404 },
      )
    }

    if (err instanceof Error && err?.message === 'NO_DEFAULT') {
      return NextResponse.json(
        { message: 'Default status missing. System inconsistent.' },
        { status: 500 },
      )
    }

    if (err instanceof Error && err.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'You must be logged in !',
          },
        },
        { status: 401 },
      )
    }

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Something went wrong',
        },
      },
      { status: 500 },
    )
  }
}
