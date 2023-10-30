import { Router } from 'express';

import User from "../models/user.js";

const usersRouter = Router();

usersRouter.post('/', async (request, response, next) => {

    const { body } = request;

    const user = new User(body);

    try {
        const savedUser = await user.save()
        response.status(201).json(savedUser)

    } catch (error) {
        next(error)
    }

})

export default usersRouter;