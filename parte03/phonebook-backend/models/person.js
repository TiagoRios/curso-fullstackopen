import dotenv from 'dotenv'
dotenv.config();

import mongoose, { Schema } from 'mongoose';

const URL = process.env.MONGODB_URI;

/* TODO - isso mostra a senha do banco, arquivo .env*/
console.log('URL connection: ', URL);

mongoose.connect(URL)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const EXAMPLE_ValidationPhoneSchema = new Schema({
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                // expressão regular aqui.
                12345678 +
                    12 - 12345678
                123 - 12345678
                return /\d{8, }/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
    }
});


let personSchema = new Schema(
    {
        name: {
            type: String,
            minLength: [3, 'Name: must be at least 3 letters.'],
            required: true,
        },
        /* TODO - verificar como validar isso exercicio 3.20*/
        /* TODO - criar outra collection no mongoDB ?? */
        numbers: {
            type: [],
            required: true,
            // default equal []
            // não funciona assim. precisa de uma validação personalizada.
            // array não possui minLength
            // minLength: [8, 'Name: must be at least 8 letters.'],
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
