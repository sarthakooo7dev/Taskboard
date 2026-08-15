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
  console.log('🟡 POST: started')

  try {
    console.log('🟡 POST: adding job...')

    const job = await Promise.race([
      notificationQueue.add('test', {
        msg: 'hello queue from route',
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('QUEUE_ADD_TIMEOUT')), 5000),
      ),
    ])

    console.log('🟢 POST: job added', job.id)

    return NextResponse.json({
      message: 'test ok',
      jobId: job.id,
    })
  } catch (error) {
    console.error('🔴 POST: queue failed', error)

    return NextResponse.json(
      {
        message: 'queue failed',
        error: String(error),
      },
      { status: 500 },
    )
  }
}
