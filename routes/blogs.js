var express = require('express');
var router = express.Router();

var blogs = require("../public/javascripts/sampleBlogs")
let blogPosts = blogs.blogPosts

const {
    blogsDB
} = require('../mongo');
const {
    post
} = require('../app');

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
router.get('/single-blog/:blogId', async function (req, res) {
    try {
        const blogId = Number(req.params.blogId);
        const collection = await blogsDB().collection('posts50');
        const foundBlog = await collection.findOne({
            id: blogId
        });
        if (!foundBlog) {
            const noBlog = {
                title: "",
                text: "This Blog does not exist",
                author: '',
                id: ""
            }
            res.json(noBlog)
        } else {
            res.json(foundBlog);
        }

    } catch (error) {
        res.status(500).send("Error fetching posts." + error)
    }

});

router.delete('/delete-blog/:blogId', async (req, res) => {
    try {
        const blogId = Number(req.params.blogId);
        const collection = await blogsDB().collection('posts50');
        await collection.deleteOne({
            id: blogId
        })
        res.status(200).send('Successfully Deleted')
    } catch (error) {
        res.status(500).send("Error deleting blog." + error)
    }
});

router.get('/post-blog', (req, res, next) => {
    res.render('postBlog');
});

router.post('/submit', async function (req, res) {
    try {
        const collection = await blogsDB().collection('posts50');
        const sortedBlogArr = await collection.find({}).sort({
            id: 1
        }).toArray();
        const lastBlog = sortedBlogArr[sortedBlogArr.length - 1];

        let blog = req.body;

        if (!blog.title || !blog.text || !blog.author || !blog.category) {
            console.log("if block")
            let mssg = "To submit a blog please include:<br>"
            mssg = !blog.title ? mssg += "- a title<br>" : '';
            mssg = !blog.text ? mssg += "- blog text<br> " : '';
            mssg = !blog.author ? mssg += "- an author<br> " : '';
            mssg = !blog.category ? mssg += "- a category<br> " : '';
            res.send(mssg);
        } else {
            blog = {
                createdAt: new Date(),
                lastModified: new Date(),
                id: Number(lastBlog.id + 1),
            }
            await collection.insertOne(blog);
            res.status(200).send('Successfully Posted')
        }

    } catch (error) {
        res.status(500).send("Error posting blog." + error)
    }

});

router.put('/update-blog/:blogId', async function (req, res) {
    try {
        const collection = await blogsDB().collection('posts50');
        const blogId = Number(req.params.blogId);
        const ogBlog = await collection.findOne({
            id: blogId
        });
        if (!ogBlog) {
            res.send('Blog Id: ' + blogId + " does not exist.")
        } else {
            let updateBlog = req.body;
            const blogTitle = updateBlog.title ? updateBlog.title : ogBlog.title;
            const blogText = updateBlog.text ? updateBlog.text : ogBlog.text;
            const blogAuthor = updateBlog.author ? updateBlog.author : ogBlog.author;
            const blogCategory = updateBlog.category ? updateBlog.category : ogBlog.category;
            updateBlog = {
                lastModified: new Date(),
                title: blogTitle,
                text: blogText,
                author: blogAuthor,
                category: blogCategory,
            };
            await collection.updateOne({
                id: blogId
            }, {
                $set: updateBlog
            });
            res.status(200).send('Successfully Updated Blog Id: ' + blogId)
        }
    } catch (error) {
        res.status(500).send("Error updating blog." + error)
    }
})

/* HELPER FUNCTION */
// let saveBlogPosts = (blogList) => {
//     return blogPosts = blogList;
// }

// let generateBlogs = (blogList, blogId, filterOrUpdate, updatedBlogData) => {

//     if (!blogId) {
//         return blogList;
//     }

//     if (filterOrUpdate === "filter") {
//         return blogList.filter((blog) => blog.id != blogId);
//     }

//     if (filterOrUpdate === "update") {
//         return blogList.map((blog) => {
//             if (blog.id === blogId) {
//                 return {
//                     ...blog,
//                     title: updatedBlogData.title ? updatedBlogData.title : blog.title,
//                     text: updatedBlogData.text ? updatedBlogData.text : blog.text,
//                     author: updatedBlogData.author ? updatedBlogData.author : blog.author
//                 }
//             }
//             return blog;
//         })
//     }
// }

// let filterBlogListById = (bloglist, id) => {
//     return bloglist.filter(blog => blog.id != id);;
// }

// let findBlogId = (id) => {
//     // ANONYMOUS FUNCTION
//     const foundBlog = blogPosts.find(blog => blog.id === id);
//     return foundBlog;
// };

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

// let addBlogPost = (body) => {
//     let blog = {
//         createdAt: new Date().toISOString("en-US"),
//         title: body.title,
//         text: body.text,
//         author: body.author,
//         id: String(blogPosts.length + 1)
//     }
//     return blog;
// }

module.exports = router;