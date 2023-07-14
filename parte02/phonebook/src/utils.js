/**
 * Capitalize the string.
 * 
 * @param {String} str String to capitalize. 
 * @returns String capitalized.
 */
export function capitalize(str) {
    return str.split(" ")
        .map(word => word[0]?.toUpperCase().concat(word.slice(1)))
        .join(" ");
}

/**
 * Sets a timeout for the message.
 * 
 * @param {*} message the message that will be displayed.
 * @param {*} setMessage function that uses the message. 
 * @param {Number} timeout time in milliseconds.
 */
export function messageDiplayTimeout(message, setMessage, timeout) {
    setMessage(message);
    setTimeout(() => setMessage(null), timeout);
}