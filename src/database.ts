import { knex as setupKnex, Knex } from 'knex'
import { env } from './env'

export const config: Knex.Config = {
  client: 'better-sqlite3',
  connection: {
    filename: env.NODE_ENV === 'test' ? './db/test.db' : './db/app.db',
  },
  useNullAsDefault: true,
  migrations: {
    directory: './db/migrations',
  },
}

export const knex = setupKnex(config)
