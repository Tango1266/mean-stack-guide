const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {type:String, required:true},
    content: {type:String,  required: true},
    imagePath: {type:String, required: true},

    // user ID
    creator: {
        // creator is identified by ID managed by mongoose.
        type: mongoose.Schema.Types.ObjectId,
        // the ID 'creator' relates to the User Entity
        ref: "User" ,
        require: true
    }
});

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;

