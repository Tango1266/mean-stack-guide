const express = require('express');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const PostsController = require('../controllers/posts');

const router = express.Router();

// get all posts
router.get('', PostsController.getPosts);

// get one post
router.get('/:id', PostsController.getPost);

// update post - put will overwrite
router.put(
    "/:id",
    checkAuth,
    extractFile,
    PostsController.updatePost);

// create post
router.post(
    "",
    checkAuth,
    extractFile,
    PostsController.createPost);

// delete one post
router.delete(
    '/:id',
    checkAuth,
    PostsController.deletePost);

module.exports = router;
