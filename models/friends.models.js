const mongoose = require('mongoose');

const friendSchema = mongoose.Schema({
    date:{
        type:Date,
        default: Date.now(),
    },
    sender:{
        type: String,
        required: true,
    },
    receiver:{
        type: String,
        required:true
    },
    friendRequest:{
        type: String,
        required: true,
    }
})

const friendRequestSchema = mongoose.Schema({
    sender :{
        type: String,
        required:true
    },
    receiver:{
        type: String,
        required:true
    },
    date:{
        type:Date,
        default: Date.now(),
    },
    status:{
        type: String,
        default:"pending"
    }
});

module.exports = {
    FriendRequest:mongoose.model('FriendRequest', friendRequestSchema),
    Friend:mongoose.model('Friend', friendSchema),
}