const dummy = (blogs) => {
    if (blogs.length === 0) return 1;

    return 1;
}

function totalLikes(blogs) {
    return blogs.reduce((acc, current) =>
        acc + current.likes
        , 0)
}

export default {
    dummy,
    totalLikes,
}