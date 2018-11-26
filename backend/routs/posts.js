const express = require('express');
const Post = require('../models/post');

const router = express.Router();

router.post("", (req, res, next) => {
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

router.get('', (req, res, next) => {
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

router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post)
        } else {
            res.status(404).json({message: 'Post not found!'})
        }
    });
});

router.delete('/:id', (req, res, next) => {
    // in DB id is underscored
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result)
        res.status(200).json({message:' Post deleted!'})
    });
});

// put would overwrite
router.put("/:id", (req, res, next) => {
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

module.exports = router;
