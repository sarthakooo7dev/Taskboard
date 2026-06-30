import { NextResponse } from 'next/server'
import { prisma } from '@repo/db'
import { checkAuthorization } from '@/app/lib/validators/user.validator'

export async function PATCH(
  req: Request,
  { params }: { params: { notificationId: string } },
) {
  try {
    const session = await checkAuthorization()
    //@ts-ignore
    const currentUserId = session.user.id
    const { notificationId } = await params

    const result = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId: currentUserId,
      },
      data: {
        read: true,
      },
    })

    if (result.count === 0) {
      return NextResponse.json(
        { message: 'Notification not found.' },
        { status: 404 },
      )
    }

    return NextResponse.json(
      { message: 'Notification marked as read successfully !' },
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
