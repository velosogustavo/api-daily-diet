import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { knex } from '../database'
import { app } from '../app'

describe('Users routes', () => {
  beforeAll(async () => {
    await app.ready()
    execSync('npm run migrate:latest')
  })

  afterAll(async () => {
    execSync('npm run knex -- migrate:rollback --all')
    await app.close()
    await knex.destroy()
  })

  beforeEach(async () => {
    await knex('meals').delete()
    await knex('users').delete()
  })

  it('should be able to create a new user', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe' })
      .expect(201)

    expect(userResponse.headers['set-cookie']).toBeDefined()
  })
})
