const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require("./routs/posts");
const usersRoutes = require('./routs/user');

// create express app
// (middleware - intersect client server communication)
const app = express();

mongoose.connect(getDbConnection())
    .then(() => {
        console.log('Connected to database!');
    })
    .catch(() => {
        console.log('Connection failed!');
});

app.use(bodyParser.json());
// unused in app
app.use(bodyParser.urlencoded({extended: false}));
// make images folder accessible
app.use("/images", express.static(path.join("images")));

app.use((req, res, next) =>{
    // CROSS: Allow access from all domains
    res.setHeader('Access-Control-Allow-Origin', '*');
    // CROSS: Allow only request containing defined attributes
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    // CROSS: Only allow certain rest-methods
    res.setHeader('Access-Control-Allow-Methods',"GET, POST, PUT, PATCH, DELETE, OPTIONS");
    next();
});

// default host address: http://localhost:3000
app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes);


// export the app instance
module.exports = app;

// helper
function getDbConnection() {
    if (process.env.DEV === true || process.argv.includes('dev')) {
        console.log("connect to local db: "
            + (process.env.DEV === true ? "env found!" : "run parameter found!")
        );
        return process.env.MONGO_DB_ADDRESS_DEV;
    }
    return process.env.MONGO_DB_ADDRESS_PROD;
}