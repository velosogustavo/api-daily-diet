import { config } from 'dotenv'
import { z } from 'zod'

config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
})

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_CLIENT: z.enum(['better-sqlite3', 'pg']).default('better-sqlite3'),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables!', _env.error.flatten())

  throw new Error('Invalid environment variables')
}

export const env = _env.data
