const {
    getReceiverFriendsRequests
} = require("../db_methods/Friend")

const { 
    addMessage, 
    getChatById,
    user_data
} = require("../db_methods/home")

const{
    addNotification,
    getUserNotifications
} = require("../db_methods/notifications")


const {
    getUserByUsername,
} = require("../db_methods/accounts")



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
            // console.log(data);
            addMessage({
                message: data.message,
                sender_username: data.sender_username,
                chat_id: data.chat_id,
            }).then(message=>{
                getChatById(data.chat_id).then(chat=>{
                    console.log("users--> "+chat.users);
                    // console.log(chat.users[i]);
                    getUserByUsername(chat.users).then(returned_users=>{
                        for (var i=0; i < returned_users.length; i++){
                            console.log("returned_users= ","m_"+returned_users[i]._id);
                            if(returned_users[i] &&  returned_users[i].username !== data.sender_username){
                                io.emit ("m_"+returned_users[i]._id, {
                                    message: message.message,
                                    username: returned_users[i].username,
                                    active: returned_users[i].active,
                                    image: returned_users[i].image
                                })
                            }
                        }
                    })
                })
            }).catch(err=>{
                console.log(err);
            })
        })
    })
}


module.exports = {
    FriendsRequest
}