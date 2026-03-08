import { z, ZodError } from 'zod'
import { NextResponse } from 'next/server'

export function validateSchema<T>(schema: z.ZodType<T>, input: unknown) {
  return schema.parse(input)
}
