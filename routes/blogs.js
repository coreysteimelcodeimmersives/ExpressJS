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

router.get('/display-blogs', function (req, res) {
    res.render('displayBlogs');
});

router.get('/display-single-blog', (req, res) =>{
    res.render('displaySingleBlog');
});

// ROUTE PARAM
router.get('/single-blog/:blogId', (req, res) => {
    console.log(req.params);
    const blogId = req.params.blogId;
    //JSON: Javascript Object Notation
    res.json(findBlogId(blogId));
});

router.delete('/delete-blog/:blogId', (req, res) => {
    const blogId = req.params.blogId;
    deleteBlogById(blogId)
    res.json('Successfully Deleted');
    console.log(blogPosts);
});

router.get('/post-blog', (req, res, next) => {
    res.render('postBlog');
});

router.post('/submit', (req, res) => {
    console.log(req.body);
    blogPosts.push(addBlogPost(req.body));
    console.log(blogPosts);
});

/* HELPER FUNCTION */
let deleteBlogById = (id) => {
    const deletedBlog = blogPosts.filter(blog => blog.id != id);
    return deletedBlog;
}

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