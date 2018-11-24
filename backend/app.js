const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const Post = require('./models/post')

// create express app
// (middleware - intersect client server communication)
const app = express();

mongoose.connect("mongodb://localhost:27017/mean-stack").then(() => {
    console.log('Connected to database!');
}).catch(() => {
    console.log('Connection failed!');
});

app.use(bodyParser.json());
// unused in app
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) =>{
    // CROSS: Allow access from all domains
    res.setHeader('Access-Control-Allow-Origin', '*');
    // CROSS: Allow only request containing defined attributes
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept');
    // CROSS: Only allow certain rest-methods
    res.setHeader('Access-Control-Allow-Methods',"GET, POST, PUT, PATCH, DELETE, OPTIONS")
    next();
});

app.post("/api/posts", (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post successfully added!',
            // id is stored in DB as _id
            postId: createdPost._id
    }).catch(err => {
        console.log(err)
    });

    });
    // don't use next here, because responde is already out
});

app.get('/api/posts', (req, res, next) => {
    // find returns error and results when finished
    Post.find().then(documents => {
        console.log(documents);

        res.status(200).json({
            message: 'Posts fetched successfully!',
            posts: documents
        })
    }).catch(err => {
        console.log(err)
    });
});

app.delete('/api/posts/:id', (req, res, next) => {
    // in DB id is underscored
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result)
        res.status(200).json({message:' Post deleted!'})
    });
});

// put would overwrite
app.put("/api/posts/:id", (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({_id: req.params.id}, post).then(result => {
        console.log(result);
        res.status(200).json({message: "Update successful!"})
    })
});

// export the app instance
module.exports = app;