const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require("./routs/posts");

// create express app
// (middleware - intersect client server communication)
const app = express();

mongoose.connect("mongodb://localhost:27017/mean-stack").then(() => {
    console.log('Connected to database!');
}).catch(() => {
    console.log('Connection failed!');
});

app.use(bodyParser.json());
// unused in app
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) =>{
    // CROSS: Allow access from all domains
    res.setHeader('Access-Control-Allow-Origin', '*');
    // CROSS: Allow only request containing defined attributes
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept');
    // CROSS: Only allow certain rest-methods
    res.setHeader('Access-Control-Allow-Methods',"GET, POST, PUT, PATCH, DELETE, OPTIONS")
    next();
});

app.use("/api/posts", postsRoutes);


// export the app instance
module.exports = app;