import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '../auth'

export async function checkAuthorization() {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('UNAUTHORIZED')
  }

  return session
}
