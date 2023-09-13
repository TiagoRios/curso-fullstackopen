import dotenv from 'dotenv'
dotenv.config();

import mongoose, { Schema } from 'mongoose';

const URL = process.env.MONGODB_URI;

/* TODO - isso mostra a senha do banco, arquivo .env*/
// console.log('URL connection: ', URL);

mongoose.connect(URL)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB: ', error.message)
    })

const maxThreeNumbers = (number) => {
    return number.length > 3 ? false : true;
}

let personSchema = new Schema(
    {
        name: {
            type: String,
            minLength: [3, 'Name: must be at least 3 letters.'],
            required: true,
        },

        /* TODO - criar outra collection no mongoDB ?? */
        numbers: {
            type: [{
                type: String,
                minlength: 8,
                required: [true, "Phone number is required."],
                validate: {
                    validator: (v) => /^(\d{2,3}-|)\d{8,12}$/.test(v),
                    message: props => `${props.value} is not a valid phone number!`
                },
            }],
            required: true,
            validate: [maxThreeNumbers, "Maximum 3 numbers per contact."]
        }
    },
    { versionKey: false }
)

// TRANSFORMA O OBJETOID EM STRING E REMOVE O (__V)ERSION.
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

export default mongoose.model('Person', personSchema)
