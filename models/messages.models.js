const mongoose = require("mongoose")


const messagesSchema = mongoose.Schema({
    sender_username:{
        required:true,
        type:String
    },
    message:{
        type:String,
        required:false
    },
    files:{
        type:[],
        required:false
    },
    chat_id:{
        type:String,
        required:false
    },
    datetime:{
        type:Date,
        default: Date.now()
    }

})




const ChatSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true,
    },
    users:{
        type:[], // users_ids
        required:true
    },
    admins:{
        type:[], // users_ids
        required: true,
    },
    created_at:{
        type:Date,
        default: Date.now(),
    }
})





module.exports = mongoose.model("Message", messagesSchema)