import { prisma } from '@repo/db'

export async function checkBoardAccess(boardId: string, userId: string) {
  const membership = await prisma.boardMember.findUnique({
    where: {
      boardId_userId: {
        boardId,
        userId,
      },
    },
    include: {
      user: {
        select: { id: true, name: true, avatar: true },
      },
    },
  })

  return membership
}
