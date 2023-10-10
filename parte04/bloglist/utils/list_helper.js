const dummy = (blogs) => {
    if (blogs.length === 0) return 1;

    return blogs.length;
}

function totalLikes(blogs) {
    return blogs.reduce((acc, current) =>
        acc + current.likes
        , 0)
}

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

export default {
    dummy,
    totalLikes,
    favoriteBlog,
}