import { NextResponse } from 'next/server'
import { checkAuthorization } from '../../../../../lib/validators/user.validator'
import { checkBoardAccess } from '../../../../../lib/validators/membership.validator'
import { z, ZodError } from 'zod'
import { validateSchema } from '../../../../../lib/validators/schema.validator'
import { roleSchema } from '../../../../../lib/validators.schema/auth.schema'
import { prisma, Prisma } from '@repo/db'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ boardId: string; userId: string }> },
) {
  try {
    const session = await checkAuthorization()
    const { boardId, userId } = await params
    const reqBody = await req.json()
    //@ts-ignore
    const currentUserID = session?.user?.id
    const validated = validateSchema(roleSchema, { body: reqBody })
    const { newRole } = validated.body

    const checkmembership = await checkBoardAccess(boardId, currentUserID)
    if (!checkmembership) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const currentUserRole = checkmembership.role

    if (currentUserRole != 'MANAGER') {
      return NextResponse.json(
        { message: 'Only manager can change roles' },
        { status: 403 },
      )
    }

    // update user role

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const targetMembership = await tx.boardMember.findUnique({
        where: {
          boardId_userId: {
            boardId,
            userId,
          },
        },
        select: { role: true },
      })

      if (!targetMembership) {
        throw new Error('NOT_FOUND')
      }

      //owner check : Board must always have at least one MANAGER
      if (targetMembership.role === 'MANAGER' && newRole !== 'MANAGER') {
        const managerCount = await tx.boardMember.count({
          where: {
            boardId,
            role: 'MANAGER',
          },
        })

        if (managerCount <= 1) {
          throw new Error('LAST_MANAGER')
        }
      }

      await tx.boardMember.update({
        where: {
          boardId_userId: {
            boardId,
            userId,
          },
        },
        data: {
          role: newRole,
        },
      })
    })

    return NextResponse.json(
      { message: 'Member role updated successfully' },
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

    //@ts-ignore
    if (err?.message === 'NOT_FOUND') {
      return NextResponse.json(
        { message: 'Member not found on this board' },
        { status: 404 },
      )
    }

    //@ts-ignore
    if (err?.message === 'LAST_MANAGER') {
      return NextResponse.json(
        { message: 'Board must have at least one manager' },
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
  { params }: { params: Promise<{ boardId: string; userId: string }> },
) {
  try {
    const session = await checkAuthorization()
    const { boardId, userId } = await params
    //@ts-ignore
    const currentUserID = session?.user?.id

    const checkmembership = await checkBoardAccess(boardId, currentUserID)
    if (!checkmembership) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    if (checkmembership.role !== 'MANAGER') {
      return NextResponse.json(
        { message: 'Only manager can remove members.' },
        { status: 403 },
      )
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const targetMembership = await tx.boardMember.findUnique({
        where: {
          boardId_userId: {
            boardId,
            userId,
          },
        },
        select: { role: true },
      })

      if (!targetMembership) {
        throw new Error('NOT_FOUND')
      }

      // Enforce invariant: board must have ≥1 manager
      if (targetMembership.role === 'MANAGER') {
        const managerCount = await tx.boardMember.count({
          where: {
            boardId,
            role: 'MANAGER',
          },
        })

        if (managerCount <= 1) {
          throw new Error('LAST_MANAGER')
        }
      }

      // Unassign tasks from this user
      await tx.task.updateMany({
        where: {
          boardId,
          assignedToId: userId,
        },
        data: {
          assignedToId: null,
        },
      })

      // Remove membership
      await tx.boardMember.delete({
        where: {
          boardId_userId: {
            boardId,
            userId,
          },
        },
      })
    })

    return NextResponse.json(
      { message: 'Member removed successfully !' },
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

    //@ts-ignore
    if (err?.message === 'NOT_FOUND') {
      return NextResponse.json(
        { message: 'Member not found on this board' },
        { status: 404 },
      )
    }

    //@ts-ignore
    if (err?.message === 'LAST_MANAGER') {
      return NextResponse.json(
        { message: 'Board must have at least one manager' },
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
