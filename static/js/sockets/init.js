const socket = io()

socket.on("connect",()=>{
    
    // console.log("front + ",id);
    
    let id = document.getElementById("socket_id").value;
    if(id) {
        console.log(id)
    }
    socket.on(id, (notifications)=>{
        console.log("==>", notifications);
        if (notifications.length)
        {
            for (var i = 0; i<notifications.length; i++){
                pushNotification(notifications[i])
                notifications.splice(i, 1)
            }
    
        }
                
        
    })
    
    
})
function AddFriendNotifications(u){
    console.log("u>>",u);
    socket.emit("Notifications", u)
}

const pushNotification = (notification)=>{
    console.log("pushNotification function");
    var notificationsDropdown =  document.getElementById("notifications-dropdown");
    const li = document.createElement("li")
    const a = document.createElement("a")
    a.className = "dropdown-item white-space-unset py-3"
    a.innerText = notification.message;
    li.appendChild(a);
    notificationsDropdown.appendChild(li);
}