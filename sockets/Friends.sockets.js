const {sendFriendRequest} = require("../db_methods/Friend")

const FriendsRequest = (io)=>{
    io.on("connection", socket=>{
        socket.on("SendFriendRequest", (data)=>{
            sendFriendRequest(data.sender, data.receiver)
            .then(()=>{
                socket.emit("requestSent")
                io.to(data.fr_id).emit('newFriendRequest', {data:data})
            }).catch(err=>{
                socket.emit("requestFailed")
                console.log(err);
            })
        })
        socket.on("Notification", (user)=>{
            socket.emit(user._id, {
                message: user.username +" Send  you a friend request"
            })
        })
    })
}


module.exports = {
    FriendsRequest
}