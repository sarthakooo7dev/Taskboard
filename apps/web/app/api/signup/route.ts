import { NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { userCredSchema } from '../../lib/validators.schema/auth.schema'
import { validateSchema } from '../../lib/validators/schema.validator'
import { prisma } from '@repo/db'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
  const reqBody: unknown = await req.json()

  try {
    const validated = validateSchema(userCredSchema, {
      body: reqBody,
    })
    const { email, password } = validated.body

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (existingUser) {
      return NextResponse.json({
        message: 'User already exists !',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const userName = email.split('@')[0] + ''

    const newUser = await prisma.user.create({
      data: {
        email,
        name: userName,
        password: hashedPassword,
      },
    })
    console.log(newUser)

    if (newUser) {
      return NextResponse.json(
        {
          message: 'User created successfully !',
        },
        { status: 201 },
      )
    }
  } catch (err) {
    if (err instanceof ZodError) {
      const errorTree = z.treeifyError(err)

      return NextResponse.json(
        {
          error: 'Invalid inputs',
        },
        { status: 400 },
      )
    }

    // fallback for errors
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 },
    )
  }
}
