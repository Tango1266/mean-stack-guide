const Post = require('../models/post');

exports.createPost = (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: buildImagePathUrl(req),
        creator: req.userData.userId
    });

    post.save()
        .then(createdPost => {
            res.status(201).json({
                message: 'Post successfully added!',
                // id is stored in DB as _id
                post: {
                    ...createdPost,
                    id: createdPost._id,
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "Post could not be created."
            });
        });
    // don't use next here, because responde is already out
};

exports.getPosts = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;

    if (pageSize && currentPage) {
        // constraint on query
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    // find returns error and results when finished
    postQuery.then(documents => {
        fetchedPosts = documents;
        return Post.count();
    }).then(count => {
        res.status(200).json({
            message: "Posts fetched successfully!",
            posts: fetchedPosts,
            maxPosts: count
        })

    })
        .catch(error => {
            res.status(500).json({
                message: "Posts could not be fetched."
            })
        })
};

exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post)
        } else {
            res.status(404).json({message: 'Post not found!'})
        }
    })
        .catch(error => {
            res.status(500).json({
                message: "Post could not be fetched."
            })
        });
};

exports.deletePost = (req, res, next) => {
    // in DB id is underscored
    Post.deleteOne(
        {_id: req.params.id, creator: req.userData.userId}
    )
        .then(result => {
            console.log(result);
            if (result.n > 0) {
                res.status(200).json({message: ' Post deleted!'})
            } else {
                res.status(401).json({message: "Not authorized!"})
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Post could not be deleted."
            })
        });
};

exports.updatePost = (req, res, next) => {
    console.log(req.file);
    let imagePath = req.body.imagePath;
    if (req.file) {
        imagePath = buildImagePathUrl(req)
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    Post.updateOne(
        // updates only records where all json attributes are matching record attributes
        {_id: req.params.id, creator: req.userData.userId},
        // update data
        post
    )
        .then(result => {
            if (result.n > 0) {
                    res.status(200).json({message: "Update successful!"})
                } else {
                    res.status(401).json({message: "Not authorized!"})
                }
            }
        ).catch(error => {
        res.status(500).json({message: "Post could not be updated."})
    })
};

/*
* Helper
*/
let buildImagePathUrl = function (req) {
    const url = req.protocol + '://' + req.get('host');
    return url + "/images/" + req.file.filename;
};