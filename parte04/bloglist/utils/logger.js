/**
 * Imprimi uma mensagem de log no terminal.
 *
 * @param  {...any} params
 * @returns void
 */
function info(...params) {
    if (process.env.NODE_ENV !== 'test') {
        console.log(...params)
    }
}

/**
 * Imprimi uma mensagem de error no terminal.
 *
 * @param  {...any} params
 * @returns void
 */
function error(...params) {
    if (process.env.NODE_ENV !== 'test') {
        console.error(...params)
    }
}

export default {
    info, error
}