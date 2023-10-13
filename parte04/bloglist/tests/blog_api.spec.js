/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
import mongoose from 'mongoose';
import supertest from 'supertest';
import Blog from '../models/blog.js';
import blogs from './blogsMock.js';

import app from '../app.js';

const api = supertest(app);

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

    for (const blog of blogs) {
        const blogObject = new Blog(blog)
        await blogObject.save()
    }
})

test('Blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are six(6) blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(blogs.length)
})

test('the first blog is about HTTP methods', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].author).toBe('Michael Chan')
})

test('Has the id property', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined();
})

test.only('there are seven(7) blogs, after adding one(1) blog ', async () => {

    const newBlog = {
        title: "title 1",
        author: "author 1",
        url: "https://testando.com/",
        likes: 5,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titles = response.body.map(res => res.title)

    expect(response.body).toHaveLength(blogs.length + 1)

    expect(titles).toContain('title 1')
})

afterAll(async () => {
    await mongoose.connection.close()
})