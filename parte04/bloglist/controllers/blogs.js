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

blogsRouter.post('/', (request, response, next) => {

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
        .catch(error => {
            next(error) // or with: response.status(400).send(error)
        })
})

export default blogsRouter;