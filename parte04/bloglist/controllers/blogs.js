import { Router } from 'express';

import Blog from "../models/blog.js";

const blogsRouter = Router();

blogsRouter.get('/', async (request, response) => {

    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {

    try {
        const blog = await Blog.findById(request.params.id)
        response.json(blog);

    } catch (error) {
        next(error)
    }
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
        const blog = await Blog.findById(request.params.id)

        if (blog) {
            await Blog.findByIdAndRemove(request.params.id)

            response.status(204).end()

        } else {
            response.status(404).end()
        }

    } catch (exception) {
        next(exception)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {

    try {

        const blog = await Blog.findById(request.params.id)

        if (blog) {

            const updatedBlog = await Blog.findByIdAndUpdate(
                request.params.id,
                { ...request.body },
                {
                    new: true,
                    runValidators: true,
                    context: "query",
                }
            )

            response.json(updatedBlog);

        } else {
            response.status(404).send("Not Found");
        }

    } catch (error) {
        next(error)
    }
})

export default blogsRouter;