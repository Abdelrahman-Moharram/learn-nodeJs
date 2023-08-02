const mongoose = require('mongoose');

// {id:"{{u._id}}", username:"{{u.username}}", type:"AddFriend", sender:"{{user.username}}"}
const notificationsSchema = mongoose.Schema({
    receiver_id:{
        type:String,
        required:true,
    },
    receiver_username:{
        type:String,
        required:true,
    },
    sender_username:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true    
    },
    data:{
        type:{},
        required:false
    },
    seen:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model("Notifications", notificationsSchema)