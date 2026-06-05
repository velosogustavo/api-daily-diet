import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { usersRoutes } from './routes/users'
import { mealsRoutes } from './routes/meals'

export const app = fastify()

app.register(cookie)

app.get('/', async (request, reply) => {
  return reply.send({
    message: 'Daily Diet API',
    version: '1.0.0',
    docs: 'https://github.com/velosogustavo/api-daily-diet#-rotas-da-api',
  })
})

app.register(usersRoutes, {
  prefix: '/users',
})
app.register(mealsRoutes, {
  prefix: '/meals',
})
