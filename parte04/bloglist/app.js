import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import config from './utils/config.js';
import logger from './utils/logger.js'
import blogsRouter from './controllers/blogs.js';
import middleware from './utils/middleware.js';

const app = express();

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)

export default app;