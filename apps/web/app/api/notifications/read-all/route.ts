import { NextResponse } from 'next/server'
import { prisma } from '@repo/db'
import { checkAuthorization } from '@/app/lib/validators/user.validator'

export async function PATCH() {
  try {
    const session = await checkAuthorization()
    //@ts-ignore
    const currentUserId = session.user.id

    await prisma.notification.updateMany({
      where: {
        userId: currentUserId,
        read: false,
      },
      data: {
        read: true,
      },
    })

    return NextResponse.json(
      { message: 'All notifications marked as read.' },
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
