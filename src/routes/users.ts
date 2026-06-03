import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
    
    app.post('/', async (request, reply) => {
        const createUser = z.object({
            name: z.string(),
        })

    const {name} = createUser.parse(request.body)
    
    const session_id = randomUUID()

    await knex('users').insert({
        id: randomUUID(),
        session_id,
        name,
    })


    reply.setCookie('sessionId', session_id, {path: '/'})
    

    return reply.status(201).send()
  })
}