import fastify from 'fastify'

export const app = fastify()

app.get('/', async function handler(request, reply) {
    return reply.send({message: 'hello world'})
    
})