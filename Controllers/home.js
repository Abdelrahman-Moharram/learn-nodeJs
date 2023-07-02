const {
      getAllFriendsRequests
    , FriendRequestOps
    , user_data
    , RemoveFriendRequest
    , getFriendRequest
    , MakeFriendShip
    , getFriendShip
    , SearchUser} = require("../db_methods/home")
const {
    sendFriendRequest,
    FirendShip,
    getReceiverFriendsRequests,
    senderFriendsRequests,
} = require("../db_methods/Friend");

const index = (req, res, next)=>{
    res.render('home/index', {title:"Home"})
}




const chat = (req, res, next)=>{
    // console.log(req.session.user)
    res.render('home/index', {title:req.params.username,})
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
    
    var userSession = req.session.user
    if (userSession){
        userSession = userSession.username
    }
    user_data(req.params.username, userSession).then((user)=>{
        getFriendShip(userSession, req.params.username).then(friendShip=>{
            if (friendShip){
                const fr={
                    is_sender: false,
                    is_receiver: false,
                    sameProfile: false,
                    sendAdd:false,
                    sendMessage:true,
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
    MakeFriendShip(req.params.id).then((friendship)=>{
        if (req.query.next)
            return res.redirect(req.query.next)
        res.redirect("/friends-requests")
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
    search
}