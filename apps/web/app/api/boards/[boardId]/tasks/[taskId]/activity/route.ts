import { checkBoardAccess } from '@/app/lib/validators/membership.validator'
import { checkAuthorization } from '@/app/lib/validators/user.validator'
import { prisma } from '@repo/db'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: { boardId: string; taskId: string } },
) {
  try {
    const session = await checkAuthorization()
    const { boardId, taskId } = await params

    //@ts-ignore
    const currentUserID = session?.user?.id

    const checkMembership = await checkBoardAccess(boardId, currentUserID)

    if (!checkMembership) {
      return NextResponse.json(
        { message: 'Insufficient permission.' },
        { status: 403 },
      )
    }

    const comments = await prisma.activity.findMany({
      where: {
        entityId: taskId,
      },
      select: {
        id: true,
        type: true,
        metadata: true,
        createdAt: true,

        actor: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(comments, { status: 200 })
  } catch (err) {
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
