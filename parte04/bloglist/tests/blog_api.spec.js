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

// não executa na ordem.. erro no segundo teste:
// the first blog is about HTTP methods
// beforeEach(async () => {
//     await Blog.deleteMany({})

//     const blogObjects = blogs.map(blog => new Blog(blog))

//     const promiseArray = blogObjects.map(note => note.save())

//     await Promise.all(promiseArray)
// })

// for...of para executar numa ordem especifica:
beforeEach(async () => {
    await Blog.deleteMany({})

    for (const blog of blogsMock) {
        const blogObject = new Blog(blog)
        await blogObject.save()
    }
})

test('Blogs are returned as json', async () => {
    await api
        .get(URL_BASE)
        .expect(200)
        .expect('Content-Type', APLICATION_JSON)
})

test('there are six(6) blogs', async () => {
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

test('there are seven(7) blogs, after adding one(1) blog', async () => {

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

test('likes property is missing, set the default value to 0', async () => {

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

afterAll(async () => {
    await mongoose.connection.close()
})