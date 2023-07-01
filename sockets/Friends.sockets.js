const {getReceiverFriendsRequests} = require("../db_methods/Friend")

const FriendsRequest = (io)=>{
    io.on("connection", socket=>{
        
        socket.on("Notifications", (data)=>{
            setTimeout(()=>{
                //  واحيانا سيرفر الداتا بيز بيقع "null" عشان اللينك اللي بيبعت اد جواه الفنكشن ديه وهي بتجيب الاد ف مش  بتلافي الاد وبترجع "setTimeout" احنا هنا استخدمنا 
                getReceiverFriendsRequests(data['sender'], data['username']).then(fr=>{
                    data['fr'] = fr._id
                    io.emit(data['id'], data)
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