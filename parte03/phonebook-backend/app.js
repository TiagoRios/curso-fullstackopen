import fs from "fs";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import express from "express";

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

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

let persons = [
    {
        "id": 1,
        "name": "Mary Poppendieck",
        "numbers": ["39-23-6423122"]
    },
    {
        "id": 32323,
        "name": "Noel",
        "numbers": ["25-12-3232323"]
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Home</h1>')
})

app.get('/info', (request, response) => {
    const currentDate = new Date();
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${currentDate}</p>`
    )
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id);

    if (person) {
        res.json(person)
    } else {
        res.status(404).end();
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * 100000)
}

// Applied only for post method and unknown endpoint.
app.use(morgan('     :body'))

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.numbers) {
        return response.status(400).json({
            error: 'name and/or number are required'
            // error: 'data missing'
        })
    }

    let foundPerson = persons.find(x => x.name.toLowerCase() === body.name.toLowerCase())

    if (foundPerson) {
        return response.status(400).json({
            error: `'${body.name}' already exists in the list`
            // error: `name must be unique`
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        numbers: [body.numbers],
    }

    persons = [...persons, person];

    response.json(person)
})

app.use((request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
})

// Ambos fly.io e render utilizam essa variável de ambiente
const PORT = 3001
app.listen(PORT, () => {
    console.log(`executando na porta: ${PORT}`);
});