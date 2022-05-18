var express = require('express');
var router = express.Router();

var blogs = require("../public/javascripts/sampleBlogs")
const blogPosts = blogs.blogPosts

/* GET blogs listing. */
router.get('/', function (req, res, next) {
    res.render('blogs', {
        title: 'Blogs'
    });
});

// QUERY PARAM
router.get('/all', function (req, res) {
    let sort = req.query.sort;
    res.json(sortBlogs(sort));
});

// ROUTE PARAM
router.get('/singleBlog/:blogId', (req, res) => {
    console.log(req.params);
    const blogId = req.params.blogId;
    //JSON: Javascript Object Notation
    res.json(findBlogId(blogId));
});

router.get('/postblog', (req, res, next) => {
    res.render('postBlog');
});

router.post('/submit', (req, res) => {
    res.status(201);
    console.log(req.body);
    blogPosts.push(addBlogPost(req.body));
    console.log(blogPosts);
});

/* HELPER FUNCTION */
let findBlogId = (id) => {

    // ANONYMOUS FUNCTION
    const foundBlog = blogPosts.find(blog => blog.id === id);
    return foundBlog;
};

let sortBlogs = (order) => {
    if (order === 'asc') {
        return blogPosts.sort(function (a, b) {
            return new Date(a.createdAt) - new Date(b.createdAt)
        })
    } else if (order === 'desc') {
        return blogPosts.sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt)
        });
    } else {
        return blogPosts;
    }
};

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