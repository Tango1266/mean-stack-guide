const express = require('express');

// create express app
// (middleware - intersect client server communication)
const app = express();

app.use((req, res, next) => {
    console.log('First middleware');
    next();
});

app.use((req, res, next) => {
    res.send('Hello from express!');
};

// export the app instance
module.exports = app;