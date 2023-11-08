import mongoose from 'mongoose';
import supertest from 'supertest';

import User from '../models/user.js';

import app from '../app.js';

const api = supertest(app);

const URL_BASE = "/api/users";
const APLICATION_JSON = /application\/json/;

const NEW_USER = {
    name: "myName",
    username: "UniqueUsername",
    password: "12345",
}

beforeEach(async () => {
    await User.deleteMany({})
})

afterAll(async () => {
    await mongoose.connection.close()
})

describe('when adding new user', () => {

    describe('error when not providing the', () => {
        test('username', async () => {

            const newUser = {
                name: "asdf",
                username: "",
                password: "12345",
            }

            const response = await api
                .post(URL_BASE)
                .send(newUser)
                .expect(400)
                .expect('Content-Type', APLICATION_JSON)

            expect(response.status).toBe(400)
            expect(response.body.error).toBe("User validation failed: username: Path `username` is required.")
        })

        test('password', async () => {

            const newUser = {
                name: "asdf",
                username: "root",
                password: "",
            }

            const response = await api
                .post(URL_BASE)
                .send(newUser)
                .expect(400)
                .expect('Content-Type', APLICATION_JSON)

            expect(response.status).toBe(400)
            expect(response.body.error).toBe("User validation failed: password: Path `password` is required.")
        })
    })

    describe('error when length less than 3', () => {
        test('username', async () => {

            const newUser = {
                name: "myName",
                username: "ro",
                password: "12345",
            }

            const response = await api
                .post(URL_BASE)
                .send(newUser)
                .expect(400)
                .expect('Content-Type', APLICATION_JSON)

            expect(response.status).toBe(400)
            expect(response.body.error).toBe("User validation failed: username: must be at least 3 characters")
        })

        test('password', async () => {

            const newUser = {
                name: "myName",
                username: "root",
                password: "12",
            }

            const response = await api
                .post(URL_BASE)
                .send(newUser)
                .expect(400)
                .expect('Content-Type', APLICATION_JSON)

            expect(response.status).toBe(400)
            expect(response.body.error).toBe("User validation failed: password: must be at least 3 characters")
        })
    })

    test('username is not unique.', async () => {

        await api
            .post(URL_BASE)
            .send(NEW_USER)
            .expect(201)
            .expect('Content-Type', APLICATION_JSON)

        const response = await api
            .post(URL_BASE)
            .send(NEW_USER)
            .expect(400)
            .expect('Content-Type', APLICATION_JSON)

        expect(response.status).toBe(400)
        expect(response.body.error).toBe(`User validation failed: username: Error, expected \`username\` to be unique. Value: \`${NEW_USER.username}\``)
    })
})
