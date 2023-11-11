import logger from './logger.js'

/**
 * Imprimi informações da requisição antes de fazer a requisição.
 *
 * @param {http.clientRequest} request o objeto de requisição
 * @param {http.serverResponse} response o objeto de resposta
 * @param {*} next chama a próxima função de middleware
 */
const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    // logger.info('headers:  ', request.headers)
    logger.info('---')
    next()
}

/**
 * Middleware Ativado quando o Endpoint for desconhecido.
 * Retorna o erro no corpo da resposta
 *
 * @param {http.clientRequest} request o objeto de requisição
 * @param {http.serverResponse} response o objeto de resposta
 *
 * @returns void
 */
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

/**
 * Manipula os erros de ID com formato errado e erros de validação de campos
 * (campos obrigatórios, tamanho max e min, tipo de dados, etc)
 *
 * @param {Error} error o objeto de erro
 * @param {http.clientRequest} request o objeto de requisição
 * @param {http.serverResponse} response o objeto de resposta
 * @param {unknown} next chama a próxima função de middleware
 *
 * @returns {unknown}
 */
const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    if (error.name === 'JsonWebTokenError') {
        return response.status(400).json({ error: error.message })
    }

    return next(error)
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')

    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    }

    next()
}

export default {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
};