const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // --------------------
  // USERS (all real fields)
  // --------------------
  const owner = await prisma.user.create({
    data: {
      name: 'Sarthak Owner',
      email: 'owner@test.com',
      password: 'qwerty',
      avatar: 'https://example.com/avatar-owner.png',
      // createdAt is auto
    },
  })

  const Lead = await prisma.user.create({
    data: {
      name: 'Lead_@__1',
      email: 'lead@test.com',
      password: 'qwerty',
      avatar: null, // optional field
    },
  })

  const member1 = await prisma.user.create({
    data: {
      name: 'Team Member_1',
      email: 'member@test.com',
      password: 'qwerty',
      avatar: null, // optional field
    },
  })
  const member2 = await prisma.user.create({
    data: {
      name: 'Team Member_2',
      email: 'member2@test.com',
      password: 'qwerty',
      avatar: null, // optional field
    },
  })

  // --------------------
  // BOARD
  // --------------------
  const board = await prisma.board.create({
    data: {
      name: 'Taskboard___1',
      ownerId: owner.id,
    },
  })

  // --------------------
  // BOARD MEMBERS
  // --------------------
  await prisma.boardMember.createMany({
    data: [
      {
        boardId: board.id,
        userId: owner.id,
        role: 'MANAGER',
      },
      {
        boardId: board.id,
        userId: Lead.id,
        role: 'LEAD',
      },
      {
        boardId: board.id,
        userId: member1.id,
        role: 'MEMBER',
      },
      {
        boardId: board.id,
        userId: member2.id,
        role: 'MEMBER',
      },
    ],
  })

  // --------------------
  // BOARD COLUMNS
  // --------------------
  const notStarted = await prisma.boardColumn.create({
    data: {
      boardId: board.id,
      name: 'Not Started',
      order: 0,
    },
  })

  const inProgress = await prisma.boardColumn.create({
    data: {
      boardId: board.id,
      name: 'In Progress',
      order: 1,
    },
  })

  const done = await prisma.boardColumn.create({
    data: {
      boardId: board.id,
      name: 'Done',
      order: 2,
    },
  })

  // --------------------
  // TASK
  // --------------------
  const task = await prisma.task.create({
    data: {
      boardId: board.id,
      columnId: notStarted.id,
      title: 'task1 do x',
      description: 'task1 desc....',
      order: 0,
      createdById: owner.id,
      assignedToId: member1.id,
    },
  })

  // --------------------
  // COMMENT
  // --------------------
  await prisma.comment.create({
    data: {
      taskId: task.id,
      userId: Lead.id,
      message: 'looks good to me.',
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
