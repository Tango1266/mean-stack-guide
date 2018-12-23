const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const globalCons = require("../resources/global-cons");

const router = express.Router();

// todo:
const secretForAuth = globalCons.AUTH_SECRET;

router.post('/signup', (req, res, err) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });

            user.save()
                .then(result => {
                    res.status(201).json({
                        message: 'User created',
                        result: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message: 'Invalid authentication credentials'
                    });
                });
        });

});

router.post('/login', (req, res, next) => {
    // user record from db
    let fetchedUser;

    // Find user by email
    User.findOne({email: req.body.email})

        // check weather password is valid
        .then(user => {
            if (!user){
                return res.status(401).json({
                    message: 'Unknown email address!'
                });
            }
            fetchedUser = user;

            return bcrypt.compare(req.body.password, user.password);
        })

        // create token and respond it back
        .then(result => {
            if (!result){
                return res.status(401).json({
                    message: 'Incorrect password!'
                });
            }

            // create web token
            const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
                secretForAuth,
                {expiresIn: '1h'});

            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id
            });
        })

        // respond error if occur
        .catch(error => {
            res.status(401).json({
                message: 'Authentication failed!'
            });
        })
});

module.exports = router;