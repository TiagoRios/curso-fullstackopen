import blogsMock from './blogsMock.js';
import listHelper from '../utils/list_helper.js'

let firstBlog;

const BLOGS = blogsMock;

const FIRST_FAVORITE_BLOG = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    likes: 12,
}

const SECOND_FAVORITE_BLOG = {
    title: "Dragon Ball",
    author: "Akira Toriyama",
    likes: 12,
}

const FAVORITE_BLOGS = [FIRST_FAVORITE_BLOG, SECOND_FAVORITE_BLOG]

const AUTHOR_MOST_BLOGS = {
    author: "Robert C. Martin",
    blogs: 3,
}

const AUTHOR_MOST_LIKES = {
    author: "Edsger W. Dijkstra",
    likes: 17
}

beforeAll(() => {
    firstBlog = BLOGS.filter((blog, index) => index === 0)
})

describe('Number of blogs', () => {

    test('dummy returns one', () => {

        expect(listHelper.dummy(firstBlog))
            .toBe(1)
    })

    test('dummy returns six blogs', () => {

        expect(listHelper.dummy(BLOGS))
            .toBe(6)
    })
})

describe('Total likes', () => {

    test('when list has only one blog, equals the likes of that', () => {

        expect(listHelper.totalLikes(firstBlog))
            .toBe(7)
    })

    test('when list has more one blog, equals the total likes', () => {

        expect(listHelper.totalLikes(BLOGS))
            .toBe(36)
    })
})

describe('Favorite blogs', () => {

    test('first blog with more likes', () => {

        const FAVORITE = listHelper.favoriteBlog(BLOGS)

        expect(FAVORITE[0]).toEqual(FIRST_FAVORITE_BLOG)
    })

    test('All favorite blogs with the same number of likes.', () => {

        expect(listHelper.favoriteBlog([...BLOGS, SECOND_FAVORITE_BLOG]))
            .toEqual(FAVORITE_BLOGS)
    })
})

describe('Author with Most blogs', () => {

    test('first author with more blogs', () => {

        expect(listHelper.mostBlogs(BLOGS))
            .toEqual(AUTHOR_MOST_BLOGS)
    })
})

describe('Author with Most Likes', () => {

    test('first author with more likes (total)', () => {

        expect(listHelper.mostLikes(BLOGS))
            .toEqual(AUTHOR_MOST_LIKES)
    })
})