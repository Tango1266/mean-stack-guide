const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

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
                        error: err
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
                    message: 'Auth failed!'
                });
            }
            fetchedUser = user;

            return bcrypt.compare(req.body.password, user.password);
        })

        // create token and respond it back
        .then(result => {
            if (!result){
                return res.status(401).json({
                    message: 'Auth failed!'
                });
            }

            // create web token
            const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
                'secret_string_this_should_be_longer', //todo:
                {expiresIn: '1h'});

            res.status(200).json({
                token: token
            });
        })

        // respond error if occur
        .catch(err => {
            res.status(401).json({
                message: 'Auth failed!'
            });
        })
});

module.exports = router;