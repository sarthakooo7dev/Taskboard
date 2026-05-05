import { string, z } from 'zod'

export const userCredSchema = z.object({
  body: z.object({
    email: z.email().max(50),
    password: z.string().min(8).max(30),
    avatar: z.string(),
  }),
})

export const createBoardSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(5, 'Board name is required')
      .max(50, 'Board name too long'),
    description: z.string().trim().max(200, 'Description too long'),
  }),
})

export const addUserSchema = z.object({
  body: z.object({
    newUserId: z.string(),
    role: z.enum(['MANAGER', 'LEAD', 'MEMBER', 'VIEWER']),
  }),
})

export const roleSchema = z.object({
  body: z.object({
    newRole: z.enum(['MANAGER', 'LEAD', 'MEMBER', 'VIEWER']),
  }),
})

export const newStatusSchema = z.object({
  body: z.object({
    status: z.string().trim().max(100, 'Board name too long'),
  }),
})

export const newTaskSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2).max(100),
    description: z.string().trim().optional(),
    assignedToId: z.string().optional(),
  }),
})

export const updateTaskSchema = z.object({
  body: z
    .object({
      title: z.string().min(2).max(100).optional(),
      description: z.string().trim().optional(),
      columnId: z.string().optional(),
      assignedToId: z.string().nullable().optional(),
    })
    .strict(),
})

export const newCommentSchema = z.object({
  body: z
    .object({
      message: z.string().trim().max(1500),
      mentionedUserIds: z.array(z.string()),
    })
    .strict(),
})
