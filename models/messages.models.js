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

    },
    image:{
        type:String,
    },
    users:{
        type:[], // users_ids
        required:true
    },
    admins:{
        type:[], // users_ids
    },
    created_at:{
        type:Date,
        default: Date.now(),
    }
})





module.exports = {
    Message: mongoose.model("Message", messagesSchema),
    Chat:  mongoose.model("chat", ChatSchema),
}