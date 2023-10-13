import { Router } from 'express';

import Blog from "../models/blog.js"

const blogsRouter = Router();

blogsRouter.get('/', (request, response) => {

    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

blogsRouter.post('/', (request, response) => {

    let { body } = request;

    if (!body.likes) {
        body = { ...body, likes: 0 }
    }

    const blog = new Blog(body)

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})

export default blogsRouter;