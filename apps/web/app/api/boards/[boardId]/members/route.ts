import { NextResponse } from 'next/server'
import { checkAuthorization } from '../../../../lib/validators/user.validator'
import { checkBoardAccess } from '../../../../lib/validators/membership.validator'
import { prisma } from '@repo/db'
import { addUserSchema } from '../../../../lib/validators.schema/auth.schema'
import { validateSchema } from '../../../../lib/validators/schema.validator'
import { z, ZodError } from 'zod'

//get all members
export async function GET(
  req: Request,
  { params }: { params: Promise<{ boardId: string }> },
) {
  try {
    const session = await checkAuthorization()
    const { boardId } = await params
    //@ts-ignore
    const userID = session?.user?.id

    const checkmembership = await checkBoardAccess(boardId, userID)
    if (!checkmembership) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    // Fetch members
    const members = await prisma.boardMember.findMany({
      where: { boardId },
      orderBy: { joinedAt: 'asc' },
      select: {
        role: true,
        joinedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            createdAt: true,
          },
        },
      },
    })

    return NextResponse.json({
      data: members,
    })
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

// add new member
export async function POST(
  req: Request,
  { params }: { params: Promise<{ boardId: string }> },
) {
  try {
    const session = await checkAuthorization()
    const { boardId } = await params
    //@ts-ignore
    const userID = session?.user?.id

    const reqBody = await req.json()
    const validated = validateSchema(addUserSchema, { body: reqBody })
    const { newUserId, role } = validated.body

    const checkmembership = await checkBoardAccess(boardId, userID)

    if (!checkmembership || checkmembership.role !== 'MANAGER') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    // Add new member
    const newMember = await prisma.boardMember.create({
      data: {
        boardId,
        userId: newUserId,
        role,
      },
    })

    return NextResponse.json(
      { message: 'User added to board successfully !', data: newMember },
      { status: 201 },
    )
  } catch (err) {
    console.log(err)
    //@ts-ignore
    if (err !== null && err?.code === 'P2002') {
      return NextResponse.json(
        { message: 'User is already a member of this board' },
        { status: 400 },
      )
    }

    //@ts-ignore
    if (err !== null && err?.code === 'P2003') {
      return NextResponse.json(
        { message: 'User does not exist' },
        { status: 404 },
      )
    }

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
