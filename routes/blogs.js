var express = require('express');
var router = express.Router();

var blogs = require("../public/javascripts/sampleBlogs")
const blogPosts = blogs.blogPosts

/* GET blogs listing. */
router.get('/', function(req, res, next) {
    res.render('blogs', {title: 'Blogs'});
});

// QUERY PARAM
router.get('/all', function(req, res){
    let sort = req.query.sort;
    res.json(sortBlogs(sort));
});

// ROUTE PARAM
router.get('/get-by-id/:blogId', (req, res) => {
    console.log(req.params);
    const blogId = req.params.blogId;
    //JSON: Javascript Object Notation
    res.json(findBlogId(blogId));
  });

/* HELPER FUNCTION */
let findBlogId = (id) => {

    // ANONYMOUS FUNCTION
    const foundBlog = blogPosts.find(blog => blog.id === id);
    return foundBlog;
    // for (let i = 0; i < blogPosts.length; i++){
    //     let blog = blogPosts[i];
    //     if (blog.id === id){
    //         return blog;
    //     }
    // }
};

let sortBlogs = (order) => {
    if (order === 'asc'){
        return blogPosts.sort(function(a, b){return new Date(a.createdAt) - new Date(b.createdAt)})
    } else if (order === 'desc'){
        return blogPosts.sort(function(a,b) {return new Date(b.createdAt) - new Date(a.createdAt)});
    } else {
        return blogPosts;
    }
}

module.exports = router;