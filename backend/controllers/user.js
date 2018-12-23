const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.createUser = (req, res, err) => {
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
};

exports.loginUser = (req, res, next) => {
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
                process.env.JWT_KEY,
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
            console.log(error)
            ;
        })
};