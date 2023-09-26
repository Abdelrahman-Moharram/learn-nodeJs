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
                        data['data'] = fr._id
                    addNotification(data).then(()=>{
                        io.emit("n"+data['receiver_id'], data)
                    }).catch(err=>{console.log(err);})
                    
                    // console.log("===>",data);
                }).catch(err=>{
                    console.log("err", err);
                })
            }, 200)
        })

        socket.on("Messages", (data)=>{
            console.log(data);
            const Messages = {}
            io.emit(data['receiver_id'])
        })
    })
}


module.exports = {
    FriendsRequest
}