const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/ChatApp'


const {FriendRequest, Friend} = require("../models/friends.models")

const sendFriendRequest = (sender, receiver) =>{
    return new Promise((resolve, reject) =>{
        mongoose.connect(DB_URL).then(() =>{
            if (sender !== receiver){
                return FriendRequest.findOne({sender: sender, receiver: receiver})
            }else{
                mongoose.disconnect()
                reject("can't send friend request to yourself")
            }
        }).then((friendRequest)=>{
            if (friendRequest){
                mongoose.disconnect()
                reject("Friend request already sent")
            }else{
                let request = new FriendRequest({
                    sender:sender,
                    receiver:receiver
                })
                return request.save()
            }
        }).then((request)=>{
            mongoose.disconnect()
            resolve(request)
        }).catch(err=>{
            mongoose.disconnect()
            reject(err)
        })
    })
}

const FirendShip = (data)=>{
    return new Promise((resolve, reject)=>{
        mongoose.connect(DB_URL).then(() =>{
            let friendShip = new Friend(data)
            return friendShip.save()
        }).then((friendShip)=>{
            resolve(friendShip)
            mongoose.disconnect()
        }).catch(err=>{
            mongoose.disconnect()
            reject(err)
        })
    })
}


// return new Promise((resolve, reject) => {
//     mongoose.connect(DB_URL).then(()=>{
//         return FriendRequest.find({sender:sender,receiver: receiver}).then(friendRequest=>{
//             if(!friendRequest){
//                 console.log(sender, receiver, friendRequest);
//                 mongoose.disconnect()
//                 reject('404')
//             }else{
//                 mongoose.disconnect()
//                 resolve(friendRequest)
//             }
//         }).catch(err=>{
//             mongoose.disconnect()
//             reject(err)
//         })
//     })
// })
const getReceiverFriendsRequests = (sender, receiver) =>{
    return new Promise((resolve, reject) =>{
        mongoose.connect(DB_URL).then(()=>{
            return FriendRequest.findOne({sender:sender,receiver: receiver})
        }).then(fr=>{
             mongoose.disconnect()
            resolve(fr)
        }).catch(err=>{
            mongoose.disconnect()
            reject(err)
        })
    })
}


const senderFriendsRequests = (username) =>{
    return new Promise((resolve, reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            return FriendRequest.find({sender:username})
        }).then(reqs=>{
            // console.log("==>",reqs);
            if(reqs){
                mongoose.disconnect()
                resolve(reqs)
            }
        }).catch(errs=>{
            mongoose.disconnect()
            reject(errs)
        })
    })
}


module.exports = {
    sendFriendRequest,
    FirendShip,
    getReceiverFriendsRequests,
    senderFriendsRequests
}