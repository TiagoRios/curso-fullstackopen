import dotenv from 'dotenv'
dotenv.config();

import mongoose from 'mongoose';

const URL = process.env.MONGODB_URI;

console.log('URL connection: ', URL);

mongoose.connect(URL)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

let personSchema = new mongoose.Schema({ name: String, numbers: [] }, { versionKey: false })

// TRANSFORMA O OBJETOID EM STRING E REMOVE O (__V)ERSION.
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

export default mongoose.model('Person', personSchema)