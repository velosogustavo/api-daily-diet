import { FastifyInstance } from 'fastify'
import { checkSessionIdExists } from '../middleware/check-session-id-exists'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const createMealsBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        is_on_diet: z.boolean(),
        date_time: z.coerce.date(),
      })

      const { name, description, is_on_diet, date_time } =
        createMealsBodySchema.parse(request.body)

      const { sessionId } = request.cookies

      const user = await knex('users').where('session_id', sessionId).first()

      if (!user) {
        return reply.status(401).send({ error: 'Unauthorized' })
      }

      await knex('meals').insert({
        id: randomUUID(),
        user_id: user.id,
        name,
        description,
        is_on_diet,
        date_time,
      })

      return reply.status(201).send()
    },
  )

  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const user = await knex('users').where('session_id', sessionId).first()

      if (!user) {
        return reply.status(401).send({ error: 'Unauthorized' })
      }

      const userMeals = await knex('meals').where('user_id', user.id)

      return reply.send({ meals: userMeals })
    },
  )

  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getMealsParamsSchema = z.object({
        id: z.uuid(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      const user = await knex('users').where('session_id', sessionId).first()

      if (!user) {
        return reply.status(401).send({ error: 'Unauthorized' })
      }

      const meal = await knex('meals').where({ id, user_id: user.id }).first()

      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' })
      }

      return reply.send({ meal })
    },
  )

  app.put(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const updateMealsBodySchema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        is_on_diet: z.boolean().optional(),
        date_time: z.coerce.date().optional(),
      })

      const { name, description, is_on_diet, date_time } =
        updateMealsBodySchema.parse(request.body)

      const updateMealsParamsSchema = z.object({
        id: z.uuid(),
      })

      const { id } = updateMealsParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      const user = await knex('users').where('session_id', sessionId).first()

      if (!user) {
        return reply.status(401).send({ error: 'Unauthorized' })
      }

      await knex('meals')
        .where({ user_id: user.id, id })
        .update({ name, description, is_on_diet, date_time })

      return reply.status(204).send()
    },
  )

  app.delete(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const deleteMealsParamsSchema = z.object({
        id: z.uuid(),
      })

      const { id } = deleteMealsParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      const user = await knex('users').where('session_id', sessionId).first()

      if (!user) {
        return reply.status(401).send({ error: 'Unauthorized' })
      }

      await knex('meals').where({ user_id: user.id, id }).delete()

      return reply.status(204).send()
    },
  )

  app.get(
    '/metrics',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const user = await knex('users').where({ session_id: sessionId }).first()

      if (!user) {
        return reply.status(401).send({ error: 'Unauthorized' })
      }

      const meals = await knex('meals')
        .where('user_id', user.id)
        .orderBy('date_time', 'asc')

      const totalMeals = meals.length
      const totalOnDiet = meals.filter((meal) => meal.is_on_diet).length
      const totalOffDiet = meals.filter((meal) => !meal.is_on_diet).length

      const { bestSequence } = meals.reduce(
        (acc, meal) => {
          if (meal.is_on_diet) {
            acc.currentSequence++
          } else {
            acc.currentSequence = 0
          }
          acc.bestSequence = Math.max(acc.bestSequence, acc.currentSequence)
          return acc
        },
        { bestSequence: 0, currentSequence: 0 },
      )

      return reply.send({ totalMeals, totalOnDiet, totalOffDiet, bestSequence })
    },
  )
}
