/* eslint-disable no-param-reassign */
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 4,
    },
    author: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
        minlength: 10,
    },
    likes: {
        type: Number
    },
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Blog = mongoose.model('Blog', blogSchema)

export default Blog;