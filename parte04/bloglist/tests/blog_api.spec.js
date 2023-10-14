/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
import mongoose from 'mongoose';
import supertest from 'supertest';

import Blog from '../models/blog.js';
import blogsMock from './blogsMock.js';

import app from '../app.js';

const api = supertest(app);

const URL_BASE = "/api/blogs";
const APLICATION_JSON = /application\/json/;

const BLOG_URL = "https://testando.com/";
const BLOG_TITLE = "Booooommm";
const BLOG_AUTHOR_NAME = "Edsger W. Dijkstra";

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(blogsMock)
})

describe('when there is initially some notes saved', () => {
    test('Blogs are returned as json', async () => {
        await api
            .get(URL_BASE)
            .expect(200)
            .expect('Content-Type', APLICATION_JSON)
    })

    test('all blogs are returned', async () => {
        const response = await api.get(URL_BASE)

        expect(response.body).toHaveLength(blogsMock.length)
    })

    test(`the first blog of author: ${BLOG_AUTHOR_NAME}`, async () => {
        const response = await api.get(URL_BASE)

        const returnedBlog = response.body.find(blog => blog.author === BLOG_AUTHOR_NAME);

        expect(returnedBlog.author).toBe(BLOG_AUTHOR_NAME)
    })

    test('Has the id property', async () => {
        const response = await api.get(URL_BASE)

        expect(response.body[0].id).toBeDefined();
    })
})

describe('addition of a new blog', () => {

    describe('valid data', () => {
        test('new blog has been added', async () => {

            const newBlog = {
                title: BLOG_TITLE,
                author: BLOG_AUTHOR_NAME,
                url: BLOG_URL,
                likes: 5,
            }

            await api
                .post(URL_BASE)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', APLICATION_JSON)

            const response = await api.get(URL_BASE)

            const titles = response.body.map(res => res.title)

            expect(response.body).toHaveLength(blogsMock.length + 1)

            expect(titles).toContain(BLOG_TITLE)
        })
    })

    describe('missing properties', () => {

        describe('likes property is missing', () => {
            test('set the default value to 0', async () => {

                const newBlog = {
                    title: BLOG_TITLE,
                    author: BLOG_AUTHOR_NAME,
                    url: BLOG_URL,
                }

                await api
                    .post(URL_BASE)
                    .send(newBlog)
                    .expect(201)
                    .expect('Content-Type', APLICATION_JSON)

                const response = await api.get(URL_BASE)

                const returnedBlog = response.body.find(blog => blog.title === BLOG_TITLE);

                expect(returnedBlog.likes).toBe(0);
                expect(returnedBlog.likes).toBeDefined();
            })
        })

        describe('Return status code 400 - Bad Request', () => {

            test('when missing title', async () => {

                const newBlog = {
                    author: BLOG_AUTHOR_NAME,
                    url: BLOG_URL,
                    likes: 123,
                }

                await api
                    .post(URL_BASE)
                    .send(newBlog)
                    .expect(400)
                    .expect('Content-Type', APLICATION_JSON)

                const response = await api.get(URL_BASE);

                expect(response.body).toHaveLength(blogsMock.length)
            })

            test('when missing URL', async () => {

                const newBlog = {
                    title: BLOG_TITLE,
                    author: BLOG_AUTHOR_NAME,
                    likes: 123,
                }

                await api
                    .post(URL_BASE)
                    .send(newBlog)
                    .expect(400)
                    .expect('Content-Type', APLICATION_JSON)

                const response = await api.get(URL_BASE);

                expect(response.body).toHaveLength(blogsMock.length)
            })

            test('when title and url missing', async () => {

                const newBlog = {
                    author: BLOG_AUTHOR_NAME,
                    likes: 123,
                }

                await api
                    .post(URL_BASE)
                    .send(newBlog)
                    .expect(400)
                    .expect('Content-Type', APLICATION_JSON)

                const response = await api.get(URL_BASE);

                expect(response.body).toHaveLength(blogsMock.length)
            })
        })
    })
})

describe('deleting a blog', () => {

    test('delete by valid id', async () => {

        let response = await api.get(URL_BASE);

        const { id, title } = response.body[0];

        await api
            .delete(URL_BASE.concat(`/${id}`))
            .expect(204)

        // Returns updated data.
        response = await api.get(URL_BASE);

        const mappedBlog = response.body.map(blog => ({ title: blog.title, id: blog.id }))

        expect(mappedBlog).not.toContain(id);
        expect(mappedBlog).not.toContain(title);
    })

    test('delete by invalid id, Return 404 - Not Found', async () => {
        const invalidId = "123123123123asdasdasdasd"

        await api
            .get(URL_BASE.concat(`/${invalidId}`))
            .expect(404)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})