import { checkAuthorization } from '@/app/lib/validators/user.validator'
import { prisma } from '@repo/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await checkAuthorization()
    //@ts-ignore
    const currentUserId = session.user.id
    const notifications = await prisma.notification.findMany({
      where: {
        userId: currentUserId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    })

    return NextResponse.json({
      data: notifications,
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
