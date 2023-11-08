/**
 * Conta a quantidade de blogs.
 *
 * @param {*} blogs
 * @returns {number} a quantidade de blogs.
 */
const dummy = (blogs) => {
    if (blogs.length === 0) return 1;

    return blogs.length;
}

/**
 * Soma a quantidade de likes e retorna o resultado da soma.
 *
 * @param {Blogs[]} blogs
 * @returns {number} quantidade total de likes.
 */
function totalLikes(blogs) {
    return blogs.reduce((acc, current) =>
        acc + current.likes
        , 0)
}

/**
 * Busca o blogs favorito. Em caso de empate retorna todos eles.
 *
 * @param {Blog[]} blogs
 * @returns {Blog[]} um ou mais blogs favoritos.
 */
function favoriteBlog(blogs) {
    const arraySorted = blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)

    return arraySorted.filter(x => x.likes === arraySorted[0].likes)
        .map(x => ({
            title: x.title,
            author: x.author,
            likes: x.likes,
        }))

}

/**
 * Busca o author com mais blogs.
 *
 * @param {Blog[]} blogs
 * @returns {Blog} o primeiro author com mais blogs.
 */
function mostBlogs(blogs) {

    let totalAuthorsBlogs = [];

    blogs.forEach(blog => {

        const authorFound = totalAuthorsBlogs.find(x => x.author === blog.author);

        if (!authorFound) {
            totalAuthorsBlogs.push({ author: blog.author, blogs: 1 })

        } else {
            totalAuthorsBlogs = totalAuthorsBlogs.filter(x => x.author !== blog.author); // remove from array.
            totalAuthorsBlogs.push({ author: blog.author, blogs: authorFound.blogs + 1 })
        }
    })

    totalAuthorsBlogs.sort((a, b) => b.blogs - a.blogs)

    return totalAuthorsBlogs[0];
}

/**
 * Busca o author com mais likes.
 *
 * @param {Blog[]} blogs
 * @returns {Blog} o primeiro author com mais likes.
 */
function mostLikes(blogs) {

    let totalAuthorsLikes = [];

    blogs.forEach(blog => {

        const authorFound = totalAuthorsLikes.find(x => x.author === blog.author);

        if (!authorFound) {
            totalAuthorsLikes.push({ author: blog.author, likes: blog.likes })

        } else {
            totalAuthorsLikes = totalAuthorsLikes.filter(x => x.author !== blog.author); // remove from array.
            totalAuthorsLikes.push({ author: blog.author, likes: blog.likes + authorFound.likes })
        }
    })

    totalAuthorsLikes.sort((a, b) => b.likes - a.likes)

    return totalAuthorsLikes[0];
}

export default {
    dummy,
    mostBlogs,
    mostLikes,
    totalLikes,
    favoriteBlog,
}
