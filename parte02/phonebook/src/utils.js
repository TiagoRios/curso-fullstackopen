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

export function messageDiplayTimeout(message, setMessage, timeout) {
    setMessage(message);
    setTimeout(() => setMessage(null), timeout);
}