const jwt = require('jsonwebtoken');
const globalCons = require('../resources/global-cons');

// middleware function
module.exports = (req,  res, next) => {
    // syntax for token commonly starts with keyword followed by whitespace:
    // 'Baerer' + " " + token
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, globalCons.AUTH_SECRET);
        next();
    } catch (error) {
        res.status(401).json({message: 'Auth failed!'});
    }
};