import { Router } from 'express';

import jwt from 'jsonwebtoken';

import Blog from "../models/blog.js";
import User from "../models/user.js";

const blogsRouter = Router();

const userObject = {
    name: 1,
    username: 1,
}

blogsRouter.get('/', async (request, response) => {

    const blogs = await Blog.find({}).populate('user', userObject)
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {

    try {
        const blog = await Blog.findById(request.params.id).populate('user', userObject)
        response.json(blog);

    } catch (error) {
        next(error)
    }
})

// eslint-disable-next-line consistent-return
blogsRouter.post('/', async (request, response, next) => {

    let { body } = request;

    // verifica a validade do token.
    // decodifica o token, ou retorna o objeto no qual o token foi baseado.
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    // Token id indefinido? então error.
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

    if (!body.likes) {
        body = { ...body, likes: 0 }
    }

    try {
        const user = await User.findById(decodedToken.id) // agora busco depois de decodificado.
        // const user = await User.findById(body.userId)

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: user.id
        })

        const savedBlog = await blog.save()

        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        response.status(201).json(savedBlog)

    } catch (error) {
        next(error) // or with: response.status(400).send(error)
    }
})

// eslint-disable-next-line consistent-return
blogsRouter.delete('/:id', async (request, response, next) => {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id)

    if (blog === null) {
        response.status(404).send({ error: `Blog not found` })

    } else if (blog.user._id.toString() === user._id.toString()) {

        try {
            await Blog.findByIdAndRemove(request.params.id)
            response.status(204).end()

        } catch (exception) {
            next(exception)
        }

    } else {
        response.status(401).json({ error: `Unauthorized` })
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