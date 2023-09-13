import fs from "fs";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import express from "express";

import Person from "./models/person.js"

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())


/* ==================================================
                    morgan settings
   ==================================================*/


// Defining custom token.
morgan.token('body', (req, res) => JSON.stringify(req.body))
morgan.token('date', (req, res) => {
    return JSON.stringify(new Date().toLocaleString())
})

// 1ª way - Using a predefined format string
// tiny = :method :url :status :res[content-length] - :response-time ms
app.use(morgan('tiny')) // for all.

// 2ª way - Using format string of predefined tokens
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// 3ª way - Using a custom format function
// app.use(morgan((tokens, req, res) => {
//     return [
//         tokens.method(req, res),
//         tokens.url(req, res),
//         tokens.status(req, res),
//         tokens.res(req, res, 'content-length'), '-',
//         tokens['response-time'](req, res), 'ms',
//         tokens.body(req, res) //uso do token personalizado.
//     ].join(' ')
// }))


// 4ª maneira - write logs to a file
// create a write stream (in append mode)
// let accessLogStream = fs.createWriteStream(path.join(path.resolve(), 'requests/all-requests.log'), { flags: 'a' })
// Records all requests in the log file.
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body :date', { stream: accessLogStream }))


/* ==================================================
                        Endpoints
   ==================================================*/


app.get('/info', (request, response, next) => {
    const currentDate = new Date();

    Person.find({}).then(persons => {
        response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${currentDate}</p>`
        )
    })
        .catch(error => next(error));
})

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
        .catch(error => next(error));
})

app.get('/api/persons/:id', (request, response, next) => {
    // const id = Number(req.params.id) // why?
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end();
        }
    }).catch((error) => {
        return next(error)
        // console.log(`Error: ${error.message}`);
        // response.status(400).send({ error: 'malformatted id' });
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

// Applied only for post method and unknown endpoint.
app.use(morgan('     :body'))

app.post('/api/persons', (request, response, next) => {
    const { name, numbers } = request.body

    const person = new Person({
        name: name,
        numbers: numbers,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    }).catch((error) => {
        return next(error)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, numbers } = request.body

    Person.findByIdAndUpdate(
        request.params.id,
        { name, numbers },
        {
            new: true,
            runValidators: true,
            context: 'query'
        })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})


/* ==================================================
                    last middlewares
   ==================================================*/


app.use((request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
})

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error })
    }

    next(error)
}

// Este deve ser o último middleware a ser carregado.
app.use(errorHandler)

// const PORT = process.env.PORT
const PORT = 3001
app.listen(PORT, () => {
    console.log(`executando na porta: ${PORT}`);
});