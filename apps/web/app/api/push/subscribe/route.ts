import { prisma } from '@repo/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { userId, subscription } = await req.json()

  await prisma.pushSubscription.create({
    data: {
      userId,
      subscription,
    },
  })

  return NextResponse.json({ ok: true })
}
