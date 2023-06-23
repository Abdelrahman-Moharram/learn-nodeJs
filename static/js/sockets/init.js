const socket = io()

socket.on("connect",()=>{
    let id = document.getElementById("socket_id");
    if(id) {
        id = id.value
        console.log("connected to front + ",id);
    }
    socket.emit("notificationRoom", id)
    

    socket.on(user._id, (notifications)=>{
        if (notifications.length)
            for (var i = 0; i<notifications.length; i++)
                pushNotification(notifications[i])
        
    })

    
    function AddFriendNotifications(user){
        socket.emit("Notification", {user:user})
    }
    

})

const pushNotification = (notification)=>{
    var notificationsDropdown =  document.getElementById("notifications-dropdown");
    const li = document.createElement("li")
    const a = document.createElement("a")
    a.className = "dropdown-item white-space-unset py-3"
    a.innerText = notification.message;
    li.appendChild(a);
    notificationsDropdown.appendChild(li);
}