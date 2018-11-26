const express = require('express');
const multer = require('multer');


const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
};

// configure multer regarding storage
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }
        // storage is relative to server.js
        callback(error, "backend/images")
    },
    filename: (req, file, callback) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const extension = MIME_TYPE_MAP[file.mimetype];
        callback(null, name + '-' + Date.now() + '.' + extension)

    }
});


router.post("", multer({storage: storage}).single('image'), (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: buildImagePathUrl(req)
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post successfully added!',
            // id is stored in DB as _id
            post: {
                ...createdPost,
                id: createdPost._id,
            }
        }).catch(err => {
            console.log(err)
        });
    });
    // don't use next here, because responde is already out
});

router.get('', (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();

    if(pageSize && currentPage){
        // constraint on query
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    // find returns error and results when finished
    postQuery.then(documents => {
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
router.put("/:id", multer({storage: storage}).single('image'), (req, res, next) => {
    console.log(req.file);
    let imagePath = req.body.imagePath;
    if (req.file){
        imagePath = buildImagePathUrl(req)
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });

    console.log(post);
    Post.updateOne({_id: req.params.id}, post).then(result => {
        console.log(result);
        res.status(200).json({message: "Update successful!"})
    })
});

let buildImagePathUrl = function (req) {
    const url = req.protocol + '://' + req.get('host');
    return url + "/images/" + req.file.filename;
};

module.exports = router;
