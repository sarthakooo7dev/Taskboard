import { prisma } from '../index'
import { CreateNotificationInput } from '@repo/types'

export async function createNotification(input: CreateNotificationInput) {
  return prisma.notification.create({
    data: input,
  })
}
