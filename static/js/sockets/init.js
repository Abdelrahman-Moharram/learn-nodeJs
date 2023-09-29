
const socket = io()
var Notifications = {}
var length = {}
console.log(document.getElementById("socket_id").value);
socket.on("connect",()=>{
    
    // console.log("front + ",id);
    
    let receiver_id = document.getElementById("socket_id").value;
    
    // notifications
    socket.on("n"+receiver_id, (notification)=>{
        if (Notifications[receiver_id]){
            Notifications[receiver_id].push(notification)
        }else{
            Notifications[notification.receiver_id] = [notification]
        }
        showNotificationLength(Notifications[receiver_id].length)
        for (var i = 0; i<Notifications[receiver_id].length; i++){
            pushNotification(Notifications[receiver_id][i])
            Notifications[receiver_id].splice(i, 1)
        }
    })
    
    // messages
    socket.on("m_"+receiver_id, (message)=>{
        console.log("messages==> ",message);
        makeMessage(message)
    })

    
    
})

function AddFriendNotifications(u){
    socket.emit("Notifications", u)
}
function sendMessage(chat_id, sender_username){
    const input = document.getElementById('message-input')

    document.getElementById('messages-list').innerHTML +=`
    <li class="d-flex justify-content-between mb-4">
    <div class="card w-100">
        <div class="card-header d-flex justify-content-between p-3">
        <p class="fw-bold mb-0">${sender_username}</p>
        <p class="text-muted small mb-0"><i class="far fa-clock"></i> ${new Date()}</p>
        </div>
        <div class="card-body">
        <p class="mb-0">
            ${input.value}
        </p>
        </div>
    </div>
    <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-5.webp" alt="avatar"
        class="rounded-circle d-flex align-self-start ms-3 shadow-1-strong" width="60">
    </li>
          `
    socket.emit("Messages", {
        message: input.value,
        chat_id:chat_id,
        sender_username:sender_username
    })
    input.value = ""
}

function makeMessage(message){
    var list = document.getElementById('messages-list');
    list.innerHTML += `
        <li class="d-flex justify-content-between mb-4">
            <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp" alt="avatar"
                class="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="60">
            <div class="card">
                <div class="card-header d-flex justify-content-between p-3">
                <p class="fw-bold mb-0">${message.username}</p>
                <p class="text-muted small mb-0"><i class="far fa-clock"></i> ${message.datetime}</p>
                </div>
                <div class="card-body">
                <p class="mb-0">
                    ${message.message}
                </p>
                </div>
            </div>
        </li>
    `
}

const pushNotification = (notification)=>{
    console.log("notification==>",notification);
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
    console.log("--> ",notification);
    if (notification){
        const text = '<span class="fw-bolder">'+notification['sender_username'] + '</span> send you A Friend Request <div class="d-flex justify-content-evenly"><a href="/accept-request/'+notification['data']+'" class="btn btn-primary btn-rounded btn-lg mx-1">accept</a>  <a href="remove-request/'+notification['fr']+'" class="btn btn-dark text-white btn-rounded btn-lg mx-1">remove</a></div>'
        if (notification['type'] === "AddFriend"){
            return [text , "/"+notification['sender_username']]
        }
    }
    return null
}


const showNotificationLength = (length) =>{
    if (!length)
        return 
    const Notification = document.getElementById("notifications-count");
    // console.log("length=",length, "inner= ", Notification.innerText);
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
        Notification.innerHTML = ""
}

const notifyReadDisplayNone = (div_id, ul_id, user_id) =>{
    DisplayNone(div_id)
    toggleAppearance(ul_id)
    getNotifications(user_id)
}

const DisplayNone = (id) =>{
    const notifications = document.getElementById(id);
    notifications.innerText = 0
    notifications.classList.add("d-none")
}

const getNotifications = (id)=>{
    $.ajax({url: '/get-notifications'}, 
    {id: id},
    ).done(function (data) {
        for (var i = 0; i<data.notifications.length; i++){
            pushNotification(data.notifications[i])
            data.notifications.splice(i, 1)
        }
    });
}

$(document).ready(function() {
    $.ajax({url: '/get-notifications-length'}, 
    ).done(function (data) {
        showNotificationLength(data.notifications)
    });
 });

