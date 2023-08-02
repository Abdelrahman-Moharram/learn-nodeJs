const socket = io()
var Notifications = {}
var length = {}
socket.on("connect",()=>{
    
    // console.log("front + ",id);
    
    let receiver_id = document.getElementById("socket_id").value;
    
    socket.on(receiver_id, (notifications)=>{
        for (n of notifications){
            if (n.seen === false && n.receiver_id === receiver_id){
                if (Notifications[receiver_id]){
                    Notifications[receiver_id].push(n)
                    length[n.receiver_id] = 1;
                }else{
                    Notifications[n.receiver_id] = [n]
                    length[n.receiver_id] ++;
                }
            }
        }
        showNotificationLength(length[receiver_id])
        for (var i = 0; i<Notifications[receiver_id].length; i++){
            pushNotification(Notifications[receiver_id][i])
            Notifications[receiver_id].splice(i, 1)
        }
        // for (let notification of notifications){

        //     if (Notifications[receiver_id]){
        //         Notifications[receiver_id].push(notification)
        //     }else{
        //         Notifications[notification.receiver_id] = [notification]
        //     }
        //     showNotificationLength(Notifications[receiver_id].length)
        //     for (var i = 0; i<Notifications[receiver_id].length; i++){
        //         pushNotification(Notifications[receiver_id][i])
        //         Notifications[receiver_id].splice(i, 1)
        //     }
        // }
                
        
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
    const text = '<span class="fw-bolder">'+notification['sender_username'] + '</span> send you A Friend Request <div class="d-flex justify-content-evenly"><a href="/accept-request/'+notification['fr']+'" class="btn btn-primary btn-rounded btn-lg mx-1">accept</a>  <a href="remove-request/'+notification['fr']+'" class="btn btn-dark text-white btn-rounded btn-lg mx-1">remove</a></div>'
    if (notification['type'] === "AddFriend"){
        return [text , "/"+notification['sender_username']]
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

const makeReadDisplayNone = (div_id, user_id) =>{
    console.log("here");
    DisplayNone(div_id)
    markRead(user_id)
}

const DisplayNone = (id) =>{
    const notifications = document.getElementById(id);
    notifications.innerText = 0
    notifications.classList.add("d-none")
}

const markRead = (id)=>{
    $.post('/mark-notification-read', 
    {id: id},
    function(data, status, xhr){
        console.log("status=>", status, "\n data=>", data);
    }
    )
}