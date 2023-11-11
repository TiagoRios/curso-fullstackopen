import { Router } from 'express';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from "../models/user.js";

const loginRouter = Router()

// eslint-disable-next-line consistent-return
loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    const user = await User.findOne({ username })

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.password)

    if (!(user && passwordCorrect)) {

        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    // assina o token com o username e o id do usuário.
    const token = jwt.sign(userForToken, process.env.SECRET)

    response
        .status(200)
        .send({ token, username: user.username, name: user.name })

})

export default loginRouter;