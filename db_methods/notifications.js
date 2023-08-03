const Notifications = require("../models/notifications.models")
const mongoose = require("mongoose")
const DB_URL = 'mongodb://localhost:27017/ChatApp'

const addNotification = (data) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL).then(()=>{
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
        mongoose.connect(DB_URL).then(()=>{
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
        mongoose.connect(DB_URL).then(()=>{
            return Notifications.find({receiver_id:user_id}).sort({seen:1})
        }).then((notifications)=>{
            return Notifications.updateMany({receiver_id:user_id}, {seen:true}), notifications  
        }).then((notifications, n)=>{
            console.log(notifications);
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
    readUserNotifications
}