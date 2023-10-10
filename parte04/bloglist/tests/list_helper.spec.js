import listHelper from '../utils/list_helper.js'
import blogsMock from './blogsMock.js';

let blogs;

beforeEach(() => {
    blogs = blogsMock
})

test('dummy returns one', () => {
    blogs = [];
    const result = listHelper.dummy(blogs);

    expect(result).toBe(1)
})

describe('total likes', () => {
    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(36)
    })
})