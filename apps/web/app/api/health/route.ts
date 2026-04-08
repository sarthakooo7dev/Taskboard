import { prisma } from '../../../../../packages/db/src/index'
import { NextResponse } from 'next/server'
import { notificationQueue } from '@repo/queue'

export async function GET() {
  try {
    const res = await prisma.$queryRaw`SELECT 1`

    return NextResponse.json(
      {
        message: 'health ok',
      },
      { status: 200 },
    )
  } catch {
    return NextResponse.json(
      {
        message: 'services failed',
      },
      { status: 503 },
    )
  }
}

export async function POST() {
  await notificationQueue.add('test', {
    msg: 'hello queue from route',
  })

  return NextResponse.json(
    {
      message: 'test ok',
    },
    { status: 200 },
  )
}
