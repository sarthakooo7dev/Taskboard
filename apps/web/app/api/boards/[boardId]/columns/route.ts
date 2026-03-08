import { NextResponse } from 'next/server'
import { checkBoardAccess } from '../../../../lib/validators/membership.validator'
import { checkAuthorization } from '../../../../lib/validators/user.validator'
import { prisma } from '@repo/db'
import { validateSchema } from '../../../../lib/validators/schema.validator'
import { newStatusSchema } from '../../../../lib/validators.schema/auth.schema'
import { z, ZodError } from 'zod'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ boardId: string }> },
) {
  try {
    const session = await checkAuthorization()
    const { boardId } = await params
    const reqBody = await req.json()
    const validated = validateSchema(newStatusSchema, { body: reqBody })
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

    const column = await prisma.boardColumn.create({
      data: {
        boardId,
        name: status,
        order: 0, // static for now
      },
    })

    return NextResponse.json(
      { message: 'Status created', data: column },
      { status: 201 },
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
