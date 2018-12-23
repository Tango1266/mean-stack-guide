const express = require('express');
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');
const PostsController = require('../controllers/posts');

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


// get all posts
router.get('', PostsController.getPosts);

// get one post
router.get('/:id', PostsController.getPost);

// update post - put will overwrite
router.put(
    "/:id",
    checkAuth,
    multer({storage: storage}).single('image'),
    PostsController.updatePost);

// create post
router.post(
    "",
    checkAuth,
    multer({storage: storage}).single('image'),
    PostsController.createPost);

// delete one post
router.delete(
    '/:id',
    checkAuth,
    PostsController.deletePost);

module.exports = router;
