import { NextResponse } from 'next/server'
import { checkBoardAccess } from '../../../../../../../lib/validators/membership.validator'
import { checkAuthorization } from '../../../../../../../lib/validators/user.validator'
import { prisma } from '@repo/db'

export async function DELETE(
  req: Request,
  {
    params,
  }: { params: { boardId: string; taskId: string; commentId: string } },
) {
  try {
    const session = await checkAuthorization()
    const { boardId, taskId, commentId } = await params

    //@ts-ignore
    const currentUserID = session?.user?.id

    const checkMembership = await checkBoardAccess(boardId, currentUserID)

    if (!checkMembership) {
      return NextResponse.json(
        { message: 'Insufficient permission.' },
        { status: 403 },
      )
    }

    const isManagerOrLead =
      checkMembership.role === 'MANAGER' || checkMembership.role === 'LEAD'

    const result = await prisma.comment.deleteMany({
      where: {
        id: commentId,
        taskId,
        task: {
          boardId,
        },
        ...(isManagerOrLead ? {} : { userId: currentUserID }),
      },
    })

    if (result.count === 0) {
      return NextResponse.json(
        { message: 'Comment not found or insufficient permission.' },
        { status: 404 },
      )
    }

    return NextResponse.json(
      { message: 'Comment deleted successfully.' },
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
