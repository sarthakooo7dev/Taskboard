import { prisma } from '@repo/db'
import { NextResponse } from 'next/server'
import { checkAuthorization } from '../../../lib/validators/user.validator'

export async function GET() {
  try {
    const session = await checkAuthorization()
    const user = await prisma.user.findUnique({
      //@ts-ignore
      where: { id: session?.user?.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        {
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User does not exist',
          },
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        data: user,
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
