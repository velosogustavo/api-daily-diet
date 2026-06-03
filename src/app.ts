import fastify from 'fastify'
import { usersRoutes } from './routes/users'
import { mealsRoutes } from './routes/meals'
import cookie from '@fastify/cookie'

export const app = fastify()


app.register(usersRoutes)
app.register(mealsRoutes)
app.register(cookie)


