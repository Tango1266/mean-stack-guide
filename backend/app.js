const express = require('express');

// create express app
// (middleware - intersect client server communication)
const app = express();


app.use('/api/posts', (req, res, next) => {
    const posts = [
        {id:1, title:"First post", content:"First post content"},
        {id:2, title:"Second post", content:"Second post content"},
        {id:3, title:"Third post", content:"Third post content"},
    ];

    // will be returned
    res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: posts
    })
});

// export the app instance
module.exports = app;