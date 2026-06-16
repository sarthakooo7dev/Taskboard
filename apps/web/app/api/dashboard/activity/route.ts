import { checkAuthorization } from '@/app/lib/validators/user.validator'
import { prisma } from '@repo/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await checkAuthorization()
    //@ts-ignore
    const currentUserId = session.user.id

    const activities = await prisma.activity.findMany({
      where: {
        board: {
          members: {
            some: {
              userId: currentUserId,
            },
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },

      take: 5,

      select: {
        id: true,
        type: true,
        entityId: true,
        metadata: true,
        createdAt: true,

        actor: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },

        board: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({
      data: activities,
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
