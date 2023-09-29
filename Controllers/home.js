const {
      getAllFriendsRequests, 
      FriendRequestOps, 
      user_data, 
      RemoveFriendRequest, 
      getFriendRequest,
      MakeFriendShip,
      getFriendShip,
      SearchUser,
      getAllChats,
      createChat,
      getChatById,
      getMessageByChatId
} = require("../db_methods/home")


const {
    sendFriendRequest,
    FirendShip,
    getReceiverFriendsRequests,
    senderFriendsRequests,
} = require("../db_methods/Friend");

const {readUserNotifications, 
    getUnReadNotifications, 
    getUserNotifications
} = require("../db_methods/notifications");









// ------------------------------ Controllers ------------------------------ // 

// getAllChats
// createChat

const fixChatName = (chats, username)=>{
    for (const chat of chats){
        var chatname=""
        if (chat.users.length < 1){
            return chats
        }
        chat.users.forEach((element, index) => {
            if (element !== username){
                if (index >= chat.users.length-1){
                    chatname += element 
                }else{
                    chatname += element +" "
                }
            }
        });
        chat.name = chatname
    }
    return chats
}


const index = (req, res, next)=>{
    getAllChats(req.session.user.username).then(chats=>{
        chats = fixChatName(chats,  req.session.user.username)
        res.render('home/chat', {title:"Home", chats:chats})
    }).catch(err=>{
        console.log(err);
    })
}


function timeformat(date) {
    var h = date.getHours();
    var m = date.getMinutes();
    var x = h >= 12 ? 'pm' : 'am';
    h = h % 12;
    h = h ? h : 12;
    m = m < 10 ? '0'+m: m;
    var mytime= h + ':' + m + ' ' + x;
    return mytime;
  }

const chat = (req, res, next)=>{
    getAllChats(req.session.user.username).then(chats=>{
        chats = fixChatName(chats,  req.session.user.username)
        if (req.params.chat_id){
            if (req.params.chat_id !== "favicon.ico"){
                getChatById(req.params.chat_id).then(chat=>{
                    getMessageByChatId(req.params.chat_id).then(messages=>{
                        chat = fixChatName([chat], req.session.user.username)[0]
                        for (message of messages) {
                            message.is_sender= message.sender_username===req.session.user.username
                            message.datetime= timeformat(message.datetime)
                        }
                        res.render('home/chat', {title:"Home", chats:chats, chat:chat, messages:messages, is_sender: messages.sender_username===req.session.user.username})
                    })
                }).catch(err=>{
                console.log("chat error",err,);   
                })
            }else{
                res.redirect("/")
            }
        }else{
            res.render('home/chat', {title:"Home", chats:chats})
        }
    }).catch(err=>{
    })
}


const FriendRequest = (req, res, next)=>{
    sendFriendRequest(req.session.user.username, req.params.username).then(request=>{
        if (req.query.next)
            return res.redirect(req.query.next)
        res.redirect("/"+req.params.username)
    }).catch(err=>{
        if (err === "can't send friend request to yourself"){
            req.flash("friendRequest", err)
            if (req.query.next)
                return res.redirect(req.query.next)
            
            res.redirect("/"+req.params.username)
        }
        console.log(err);
    })
}


const getfriendsRequests = (req, res, next)=>{
    getAllFriendsRequests(req.session.user.username).then(requests=>{
        res.render("accounts/requests",{title:"Friends Requests",requests:requests})
    }).catch(err=>{
        res.redirect("/accounts/"+req.session.user.username+"/friends-requests")
    })
}







const profile = (req, res, next)=>{
    console.log(req.params);
    var userSession = req.session.user
    if (userSession){
        userSession = userSession.username
    }
    user_data(req.params.username, userSession).then((user)=>{
        getFriendShip(userSession, req.params.username).then(friendShip=>{
            if (friendShip){
                console.log(friendShip);
                const fr={
                    is_sender: false,
                    is_receiver: false,
                    sameProfile: false,
                    sendAdd:false,
                    sendMessage:true,
                    chat_id: friendShip.chat_id,
                    FriendRequest:friendShip.friendRequest
                }
                res.render("home/profile", {
                    title:req.params.username,
                    friendShip:true , 
                    frOps:fr, 
                    u:user, 
                    
                    errors:req.flash("friendRequest")
                })
            }else{
                FriendRequestOps(userSession, req.params.username).then((fr)=>{
                    res.render("home/profile", {
                        FriendRequest:fr.FriendRequest,
                        title:req.params.username, 
                        frOps:fr, 
                        u:user, 
                        errors:req.flash("friendRequest")
                    })
                }).catch(err=>{console.log("76=>",err);})
            }
        }).catch(err=>{console.log("72=>",err);})

        

    }).catch(err=>{
        if (err === '404'){
            next()
        }else{
            console.log(err)
        }
    })
}


const search = (req, res)=>{
    SearchUser(req.query.search).then(users=>{
        res.render("home/search",{title:"search | "+req.query.search,query:req.query.search,users:users})
    }).catch(err=>{console.log("err",err);});
}


const removeRequest = (req, res, next)=>{
    RemoveFriendRequest(req.params.id).then((removed)=>{
        if (req.query.next)
            return res.redirect(req.query.next)
        res.redirect("/friends-requests")
    }).catch(err=>{
        console.log("on remove request : home controller  err=",err);
    })
}

const acceptRequest=(req, res, next)=>{
    MakeFriendShip(req.params.id).then((friendship, chat)=>{
        if (req.query.next)
            return res.redirect(req.query.next)
        res.redirect("/")
    }).catch(err=>{
        console.log("204-err", err);
    })
}

const markRead = (req, res, next)=>{
    getUserNotifications(req.session.user._id).then(notifications=>{
        readUserNotifications(req.session.user._id).then((readNotifications)=>{
            return res.send({
                notifications:notifications
            })
        }).catch(err=>{
            console.error("read notifications errors= ",err);
        })
    }).catch(errs=>{
        console.error("read notifications errors= ",errs);
        
    })
}

const getUnReadNotificationsLength = (req, res, next)=>{
    getUnReadNotifications(req.session.user._id).then((notifications)=>{
        return res.send({
            notifications:notifications.length
        })
    }).catch(err=>{
        console.error("read notifications errors= ",err);
    })
}












module.exports = {
    index,
    FriendRequest,
    getfriendsRequests,
    removeRequest,
    profile,
    chat,
    acceptRequest,
    search,
    markRead,
    getUnReadNotificationsLength
}