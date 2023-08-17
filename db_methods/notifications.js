const Notifications = require("../models/notifications.models")
const mongoose = require("mongoose")
process.env.DB_URL = 'mongodb://127.0.0.1:27017/ChatApp'

const addNotification = (data) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.DB_URL).then(()=>{
            const notification = new Notifications({
                receiver_id:data.receiver_id,
                receiver_username:data.receiver_username, 
                type:data.type, 
                sender_username :data.sender_username,
                data:data.data
            })

            return notification.save()
        }).then((notification)=>{
            mongoose.disconnect()
            resolve(notification)
        }).catch(err=>{
            mongoose.disconnect()
            reject(err);
        })
    })
}

const getUserNotifications = (user_id) =>{
    return new Promise((resolve, reject) =>{
        mongoose.connect(process.env.DB_URL).then(()=>{
            return Notifications.find({receiver_id:user_id, })
        }).then(notifications=>{

            mongoose.disconnect()
            resolve(notifications)
        }).catch(err=>{
            mongoose.disconnect()
            reject(err)
        })
    })
}

const readUserNotifications = (user_id) =>{
    return new Promise((resolve, reject)=>{
        mongoose.connect(process.env.DB_URL).then(()=>{
            return Notifications.updateMany({receiver_id:user_id}, {seen: true})  
        }).then((notifications)=>{
            mongoose.disconnect()
            resolve(notifications)
        }).catch(err=>{
            mongoose.disconnect()
            reject(err)
        })
    })
}


const getUnReadNotifications = (user_id) =>{
    return new Promise((resolve, reject)=>{
        mongoose.connect(process.env.DB_URL).then(()=>{
            return Notifications.find({receiver_id:user_id, seen:false})
        }).then((notifications)=>{
            mongoose.disconnect()
            resolve(notifications)
        }).catch(err=>{
            mongoose.disconnect()
            reject(err)
        })
    })
}



module.exports = {
    addNotification,
    getUserNotifications,
    readUserNotifications,
    getUnReadNotifications
}