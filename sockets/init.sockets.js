module.exports = (socket)=>{
    socket.on("notificationRoom", (id)=>{
        socket.join(id);
    })
}