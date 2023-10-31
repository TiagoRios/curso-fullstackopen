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

    if (password === "") { // custom validation
        response.status(400).json({ error: "User validation failed: password: Path `password` is required." })

    } else if (password.length < 3) {
        response.status(400).json({ error: "User validation failed: password: must be at least 3 characters" })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // other way - uses Mongoose validation (required)
    // let passwordHash = password;

    // if (password.length > 0 && password.length < 3) {
    //     response.status(400).json({ error: "User validation failed: password: must be at least 3 characters" })

    // } else if (password.length !== 0 || password !== "") { // does not encrypt empty string
    //     const saltRounds = 10
    //     passwordHash = await bcrypt.hash(password, saltRounds)
    // }
    // end other way

    const user = new User({
        username,
        name,
        password: passwordHash
    })

    try {
        const savedUser = await user.save()
        response.status(201).json(savedUser)

    } catch (error) {
        next(error)
    }

})

export default usersRouter;