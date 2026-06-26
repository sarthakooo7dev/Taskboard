import { prisma } from '@repo/db'
import { NextResponse } from 'next/server'
import { checkAuthorization } from '../../../lib/validators/user.validator'
import { validateSchema } from '@/app/lib/validators/schema.validator'
import { updateUserSchema } from '@/app/lib/validators.schema/auth.schema'

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
        role: true,
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

export async function PATCH(req: Request) {
  try {
    const session = await checkAuthorization()

    const reqBody = await req.json()

    const validated = validateSchema(updateUserSchema, {
      body: reqBody,
    })
    const { name, email, avatar, role } = validated.body

    const updatedUser = await prisma.user.update({
      where: {
        //@ts-ignore
        id: session?.user?.id,
      },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(avatar !== undefined && { avatar }),
        ...(role !== undefined && { role }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      {
        data: updatedUser,
      },
      { status: 200 },
    )
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'UNAUTHORIZED') {
        return NextResponse.json(
          {
            error: {
              code: 'UNAUTHORIZED',
              message: 'You must be logged in!',
            },
          },
          { status: 401 },
        )
      }

      if (err.message.includes('Record to update not found')) {
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
