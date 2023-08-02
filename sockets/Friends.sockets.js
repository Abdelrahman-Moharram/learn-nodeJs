const {getReceiverFriendsRequests} = require("../db_methods/Friend")
const{addNotification,
    getUserNotifications} = require("../db_methods/notifications")
const FriendsRequest = (io)=>{
    io.on("connection", socket=>{
        
        socket.on("Notifications", (data)=>{
            setTimeout(()=>{
                //  واحيانا سيرفر الداتا بيز بيقع "null" عشان اللينك اللي بيبعت اد جواه الفنكشن ديه وهي بتجيب الاد ف مش  بتلافي الاد وبترجع "setTimeout" احنا هنا استخدمنا 
                getReceiverFriendsRequests(data['sender_username'], data['receiver_username']).then(fr=>{
                    if (fr) 
                        data['fr'] = fr._id
                    addNotification(data).then(()=>{
                    getUserNotifications(data['receiver_id']).then(data=>{
                            io.emit(data[0]['receiver_id'], data)
                        }).catch(err=>{console.log(err);})
                    }).catch(err=>{console.log(err);})
                    
                    // console.log("===>",data);
                }).catch(err=>{
                    console.log("err", err);
                })
            }, 200)
        })
    })
}


module.exports = {
    FriendsRequest
}