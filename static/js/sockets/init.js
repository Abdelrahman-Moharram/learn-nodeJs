const socket = io()
var Notifications = {}
socket.on("connect",()=>{
    
    // console.log("front + ",id);
    
    let id = document.getElementById("socket_id").value;
    if(id) {
        console.log(id)
    }
    socket.on(id, (notification)=>{
        
        if (Notifications[id]){
            Notifications[id].push(notification)
        }else{
            Notifications[notification.id] = [notification]
        }
        showNotificationLength(Notifications[id].length)
        for (var i = 0; i<Notifications[id].length; i++){
            pushNotification(Notifications[id][i])
            Notifications[id].splice(i, 1)
        }
                
        
    })
    
    
})
function AddFriendNotifications(u){
    socket.emit("Notifications", u)
}

const pushNotification = (notification)=>{
    var notificationsDropdown =  document.getElementById("notifications-dropdown");
    const li = document.createElement("li")
    const a = document.createElement("a")
    const notificationData = makeNotificationData(notification)
    a.className = "dropdown-item white-space-unset py-3";
    
    a.innerHTML = notificationData[0]
    a.href = notificationData[1]
    li.appendChild(a);
    notificationsDropdown.appendChild(li);
}

const makeNotificationData = (notification)=>{
    const text = '<span class="fw-bolder">'+notification['sender'] + '</span> send you A Friend Request <div class="d-flex justify-content-evenly"><a href="/accept-request/'+notification['fr']+'" class="btn btn-primary btn-rounded btn-lg mx-1">accept</a>  <a href="remove-request/'+notification['fr']+'" class="btn btn-dark text-white btn-rounded btn-lg mx-1">remove</a></div>'
    if (notification['type'] === "AddFriend"){
        return [text , "/"+notification['sender']]
    }
    return null
}


const showNotificationLength = (length) =>{
    
    if (!length)
        return 
    const Notification = document.getElementById("notifications-count");
    if (Notification.innerText)
        Notification.innerText = parseInt(Notification.innerText) + length
    else
        Notification.innerText = length
        
    Notification.classList.replace("d-none", "d-block")

    
}

const toggleAppearance = (id) =>{
    const Notification = document.getElementById(id);
    if (Notification.classList.contains("d-none"))
        Notification.classList.replace("d-none", "d-block")
    else
        Notification.classList.replace("d-block", "d-none")

}

const DisplayNone = (id) =>{

    const notifications = document.getElementById(id);
    notifications.innerText = 0
    notifications.classList.add("d-none")
}
