const mongoose = require("mongoose")


const messagesSchema = mongoose.Schema({
    receiver_username:{
        required:true,
        type:String
    },
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
        required:true
    },
    datetime:{
        type:Date,
        default: Date.now()
    }

})

module.exports = mongoose.model("Message", messagesSchema)