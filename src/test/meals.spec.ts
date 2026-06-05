import { describe, beforeAll, beforeEach, afterAll, it, expect } from "vitest";
import { execSync } from "node:child_process";
import request from 'supertest'
import { knex } from "../database";
import { app } from "../app";

describe('Meals routes', () => {
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

    

    it('should be able to create a new meal', async () => {
        const userResponse = await request(app.server)
        .post('/users')
        .send({
            name: 'John Doe'
        })

        const cookies = userResponse.get('Set-Cookie')

        await request(app.server)
        .post('/meals')
        .set('Cookie', cookies!)
        .send({
            name: 'Breakfast',
            description: 'Eggs and toast',
            is_on_diet: true
        })
        .expect(201)
    })

    it('should be able to list all meals', async () => {
        const userResponse = await request(app.server)
        .post('/users')
        .send({
            name: 'John Doe'
        })

        const cookies = userResponse.get('Set-Cookie')

        await request(app.server)
        .post('/meals')
        .set('Cookie', cookies!)
        .send({
            name: 'Breakfast',
            description: 'Eggs and toast',
            is_on_diet: true
        })
        .expect(201)

        const mealsResponse = await request(app.server)
        .get('/meals')
        .set('Cookie', cookies!)
        .expect(200)

        expect(mealsResponse.body.meals).toHaveLength(1)
    })

    it('should be able to get a specific meal', async () => {
        const userResponse =  await request(app.server)
        .post('/users')
        .send({
            name: 'John Doe'
        })

        const cookies = userResponse.get('Set-Cookie')

        await request(app.server)
        .post('/meals')
        .set('Cookie', cookies!)
        .send({
            name: 'Breakfast',
            description: 'Eggs and toast',
            is_on_diet: true
        })
        .expect(201)

        const mealsResponse = await request(app.server)
        .get('/meals')
        .set('Cookie', cookies!)

        
        const id = mealsResponse.body.meals[0].id

        await request(app.server)
        .get(`/meals/${id}`)
        .set('Cookie', cookies!)
        .expect(200)
    })

    it('should be able to update a meal', async () => {
        const userResponse = await request(app.server)
        .post('/users')
        .send({
            name: 'John Doe'
        })

        const cookies = userResponse.get('Set-Cookie')

        await request(app.server)
        .post('/meals')
        .set('Cookie', cookies!)
        .send({
            name: 'Breakfast',
            description: 'Eggs and toast',
            is_on_diet: true
        })
        .expect(201)

        const listMealsResponse = await request(app.server)
        .get('/meals')
        .set('Cookie', cookies!)
        .expect(200)

        const id = listMealsResponse.body.meals[0].id

        await request(app.server)
        .put(`/meals/${id}`)
        .set('Cookie', cookies!)
        .send({
            name: "Breakfast",
            description: "Eggs and coffee",
            is_on_diet: true
        })
        .expect(204)
    })

    it('should be able to delete a meal', async () => {
        const userResponse = await request(app.server)
        .post('/users')
        .send({
            name: "John Doe"
        })

        const cookies = userResponse.get('Set-Cookie')

        await request(app.server)
        .post('/meals')
        .set('Cookie', cookies!)
        .send({
            name: 'Breakfast',
            description: 'Eggs and toast',
            is_on_diet: true
        })
        .expect(201)

        const listMealsResponse = await request(app.server)
        .get('/meals')
        .set('Cookie', cookies!)
        .expect(200)

        const id = listMealsResponse.body.meals[0].id

        await request(app.server)
        .delete(`/meals/${id}`)
        .set('Cookie', cookies!)
        .expect(204)
    })

    it('should be able to get user metrics', async () => {
        const userResponse = await request(app.server)
        .post('/users')
        .send({
            name: "john Doe"
        })

        const cookies = userResponse.get('Set-Cookie')

        const meals = [
        {
            name: 'Breakfast',
            description: 'Eggs and toast',
            is_on_diet: true
        },
        {
            name: 'Lunch',
            description: 'Chicken and rice',
            is_on_diet: true
        },
        {
            name: 'Burger',
            description: 'Cheeseburger and fries',
            is_on_diet: false
        },
        {
            name: 'Pizza',
            description: 'Pepperoni pizza',
            is_on_diet: false
        },
    ]

    for (const meal of meals) {
        await request(app.server)
        .post('/meals')
        .set('Cookie',cookies!)
        .send(meal)
        .expect(201)
    }

    const metricsResponse = await request(app.server)
    .get('/meals/metrics')
    .set('Cookie', cookies!)
    .expect(200)

    expect(metricsResponse.body).toEqual({
        totalMeals: 4,
        totalOnDiet: 2,
        totalOffDiet: 2,
        bestSequence: 2,
    })

    })
})