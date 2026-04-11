import { prisma } from '../index'
import { CreateNotificationInput } from '@repo/types'

export async function createNotification(input: CreateNotificationInput) {
  return prisma.notification.create({
    data: input,
  })
}

export async function getSubscriptionForUsers(userId: string) {
  return await prisma.pushSubscription.findMany({
    where: { userId },
  })
}
