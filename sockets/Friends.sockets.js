const {getReceiverFriendsRequests} = require("../db_methods/Friend")

const FriendsRequest = (io)=>{
    io.on("connection", socket=>{
        
        socket.on("Notifications", (data)=>{
            setTimeout(()=>{
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