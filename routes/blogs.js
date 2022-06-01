var express = require('express');
var router = express.Router();

var blogs = require("../public/javascripts/sampleBlogs")
let blogPosts = blogs.blogPosts

const {
    blogsDB
} = require('../mongo');

/* GET blogs listing. */
router.get('/', async function (req, res, next) {
    try {
        const collection = await blogsDB().collection('posts50');
        const posts = await collection.find({}).toArray();
        res.json(posts);
    } catch (e) {
        res.status(500).send("Error fetching posts." + e)
    }

});

// QUERY PARAM
router.get('/all', async function (req, res) {
    try {
        let field = req.query.field;
        let order = req.query.order;
        if (order === "asc") {
            order = 1;
        }
        if (order === "desc") {
            order = -1
        }
        const collection = await blogsDB().collection('posts50');
        const posts = await collection.find({}).sort({
            [field]: order
        }).toArray();
        res.json(posts);
    } catch (e) {
        res.status(500).send("Error fetching posts." + e)
    }
});

router.get('/display-blogs', function (req, res) {
    res.render('displayBlogs');
});

router.get('/display-single-blog', (req, res) => {
    res.render('displaySingleBlog');
});

// ROUTE PARAM
router.get('/single-blog/:blogId', (req, res) => {
    console.log(req.params);
    const blogId = req.params.blogId;
    const foundBlog = findBlogId(blogId)
    res.json(foundBlog);
});

router.delete('/delete-blog/:blogId', (req, res) => {
    const blogId = req.params.blogId;
    const filteredBlogList = generateBlogs(blogPosts, blogId, "filter");
    saveBlogPosts(filteredBlogList);
    res.json('Successfully Deleted');
});

router.get('/post-blog', (req, res, next) => {
    res.render('postBlog');
});

router.post('/submit', (req, res) => {
    blogPosts.push(addBlogPost(req.body));
    res.json('OK')
});

router.put('/update-blog/:blogId', (req, res) => {
    console.log('hit route')
    const blogId = req.params.blogId;
    const title = req.body.title;
    const text = req.body.text;
    const author = req.body.author;
    const updatedBlogData = {
        title,
        text,
        author
    }
    const updatedBlogList = generateBlogs(blogPosts, blogId, "update", updatedBlogData);
    saveBlogPosts(updatedBlogList);
    res.json('OK');
})

/* HELPER FUNCTION */
let saveBlogPosts = (blogList) => {
    return blogPosts = blogList;
}

let generateBlogs = (blogList, blogId, filterOrUpdate, updatedBlogData) => {

    if (!blogId) {
        return blogList;
    }

    if (filterOrUpdate === "filter") {
        return blogList.filter((blog) => blog.id != blogId);
    }

    if (filterOrUpdate === "update") {
        return blogList.map((blog) => {
            if (blog.id === blogId) {
                return {
                    ...blog,
                    title: updatedBlogData.title ? updatedBlogData.title : blog.title,
                    text: updatedBlogData.text ? updatedBlogData.text : blog.text,
                    author: updatedBlogData.author ? updatedBlogData.author : blog.author
                }
            }
            return blog;
        })
    }
}

let filterBlogListById = (bloglist, id) => {
    return bloglist.filter(blog => blog.id != id);;
}

let findBlogId = (id) => {
    // ANONYMOUS FUNCTION
    const foundBlog = blogPosts.find(blog => blog.id === id);
    return foundBlog;
};

// let sortBlogs = (order, posts) => {
//     if (order === 'asc') {
//         return posts.sort(function (a, b) {
//             return new Date(a.createdAt) - new Date(b.createdAt)
//         })
//     } else if (order === 'desc') {
//         return posts.sort(function (a, b) {
//             return new Date(b.createdAt) - new Date(a.createdAt)
//         });
//     } else {
//         return blogPosts;
//     }
// };

let addBlogPost = (body) => {
    let blog = {
        createdAt: new Date().toISOString("en-US"),
        title: body.title,
        text: body.text,
        author: body.author,
        id: String(blogPosts.length + 1)
    }
    return blog;
}

module.exports = router;