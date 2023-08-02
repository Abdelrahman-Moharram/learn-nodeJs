const Notifications = require("../models/notifications.models")
const mongoose = require("mongoose")
const DB_URL = 'mongodb://localhost:27017/ChatApp'

const addNotification = (data) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL).then(()=>{
            const notification = new Notifications(data)
            // {
            //     receiver_id:data.id,
            //     receiver_username:data.username, 
            //     type:data.type, 
            //     sender_username :data.sender,
            //     data:data.fr
            // }
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
            return Notifications.updateMany({receiver_id:user_id}, {seen:true})
        }).then(notifications=>{
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