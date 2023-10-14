import { Router } from 'express';

import Blog from "../models/blog.js"

const blogsRouter = Router();

blogsRouter.get('/', async (request, response) => {

    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {

    let { body } = request;

    if (!body.likes) {
        body = { ...body, likes: 0 }
    }

    const blog = new Blog(body)

    try {
        const savedBlog = await blog.save()
        response.status(201).json(savedBlog)

    } catch (error) {
        next(error) // or with: response.status(400).send(error)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {

    try {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()

    } catch (exception) {
        next(exception)
    }
})

export default blogsRouter;