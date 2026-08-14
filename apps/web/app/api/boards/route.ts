import { ColumnType, prisma, Prisma } from '@repo/db'
import { NextResponse } from 'next/server'
import { checkAuthorization } from '../../lib/validators/user.validator'
import { validateSchema } from '../../lib/validators/schema.validator'
import { createBoardSchema } from '../../lib/validators.schema/auth.schema'
import z, { ZodError } from 'zod'

// Get all boards for the user
export async function GET() {
  try {
    const session = await checkAuthorization()

    const userBoards = await prisma.boardMember.findMany({
      //@ts-ignore
      where: { userId: session.user.id },
      include: {
        board: true,
      },
      orderBy: {
        board: {
          updatedAt: 'desc',
        },
      },
    })

    const formattedBoardInfo = userBoards.map(({ board, ...members }) => {
      return { ...members, boardName: board.name }
    })

    return NextResponse.json({
      data: formattedBoardInfo,
    })
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

// create board with user as the owner

export async function POST(req: Request) {
  try {
    const session = await checkAuthorization()
    const reqBody = await req.json()

    const validated = validateSchema(createBoardSchema, { body: reqBody })
    const { name, description } = validated.body

    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const board = await tx.board.create({
          data: {
            name: name,
            Description: description,
            //@ts-ignore
            ownerId: session.user.id,
          },
        })

        await tx.boardMember.create({
          data: {
            boardId: board.id,
            //@ts-ignore
            userId: session.user.id,
            role: 'MANAGER',
          },
        })

        await tx.boardColumn.createMany({
          data: [
            {
              boardId: board.id,
              name: 'Blocked',
              type: ColumnType.BLOCKED,
              order: 0,
              isDefault: false,
            },
            {
              boardId: board.id,
              name: 'Not Started',
              type: ColumnType.NOT_STARTED,
              order: 1,
              isDefault: true,
            },
            {
              boardId: board.id,
              name: 'In Progress',
              type: ColumnType.IN_PROGRESS,
              order: 2,
              isDefault: false,
            },
            {
              boardId: board.id,
              name: 'Done',
              type: ColumnType.DONE,
              order: 3,
              isDefault: false,
            },
          ],
        })

        return board
      },
    )

    return NextResponse.json({ data: result }, { status: 201 })
  } catch (err) {
    console.log(err)
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

    if (err instanceof ZodError) {
      const errorTree = z.treeifyError(err)

      return NextResponse.json(
        {
          error: 'Invalid inputs',
        },
        { status: 400 },
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
