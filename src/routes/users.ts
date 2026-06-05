import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
    
    app.post('/', async (request, reply) => {
        const createUserBodySchema = z.object({
            name: z.string(),
        })

    const {name} = createUserBodySchema.parse(request.body)
    
    const sessionId = randomUUID()

    await knex('users').insert({
      id: randomUUID(),
      session_id: sessionId,
      name,
  })


    reply.setCookie('sessionId', sessionId, {path: '/'})
    

    return reply.status(201).send()
  })
}