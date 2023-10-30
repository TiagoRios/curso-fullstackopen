import { Router } from 'express';

// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from 'bcrypt'

import User from "../models/user.js";

const usersRouter = Router();

usersRouter.get('/', async (request, response) => {

    const blogs = await User.find({})
    response.json(blogs)
})

usersRouter.post('/', async (request, response, next) => {

    const { username, name, password } = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        password : passwordHash,
    })

    try {
        const savedUser = await user.save()
        response.status(201).json(savedUser)

    } catch (error) {
        next(error)
    }

})

export default usersRouter;