const socket = io()

socket.on("connect",()=>{
    let id = document.getElementById("socket_id");
    if(id) {
        id = id.value
        console.log("connected to front + ",id);
    }
    socket.emit("notificationRoom", id)
})