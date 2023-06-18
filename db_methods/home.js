const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/ChatApp'


const User = require("../models/users.model")
const {FriendRequest, Friend} = require("../models/friends.models");



const user_data = (username, currUser=null) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL).then(()=>{
            return User.findOne({username: username}).then(user=>{
                if(!user){
                    mongoose.disconnect()
                    reject('404')
                }else{
                    mongoose.disconnect()
                    return user
                }
            }).then(user=>{
                
                mongoose.disconnect()
                resolve(user)    // user, sender, reciever, isUserProfile, sendAdd, sendMessage
                
            }).catch(err=>{
                mongoose.disconnect()
                reject(err)
            })
        })
    })
}


const getFriendRequest = (sender, receiver) =>{
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL).then(()=>{
            return FriendRequest.findOne({sender:sender, receiver:receiver})    
        }).then(fr=>{
            mongoose.disconnect()
            resolve(fr)
        }).catch(err=>{
            mongoose.disconnect()
        
            reject(err)

        })
    })     
}

const getFriendRequestById = (id) =>{
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL).then(()=>{
            return FriendRequest.findOne({_id:id})    
        }).then(fr=>{
            mongoose.disconnect()
            resolve(fr)
        }).catch(err=>{
            mongoose.disconnect()
        
            reject(err)

        })
    })     
}

const getAllFriendsRequests = (currUser)=>{
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL).then(()=>{
            return FriendRequest.find({receiver:currUser, status:"pending"})
        }).then(frs=>{
            mongoose.disconnect()
            resolve(frs)
        }).catch(err=>{
            mongoose.disconnect()
            reject(err)
        })
    })
}

const is_sender = (sender, reciever)=>{
    return getFriendRequest(sender, reciever).then((data)=>{
        return data
    }).catch(err=>{console.log("err=>",err);})
}

const getFriendShip = (sender, receiver)=>{
    return new Promise((resolve, reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            return Friend.findOne({sender:sender, receiver:receiver})
        }).then(fr=>{
            if(fr){
                resolve(fr)
                mongoose.disconnect()
            }else{
                return Friend.findOne({sender:receiver, receiver:sender})
            }
        }).then(fr=>{
            resolve(fr)
            mongoose.disconnect()
        }).catch(err=>{
            mongoose.disconnect()
            reject(err)
        })
    })
};

const FriendRequestOps = async function(currUser, UserProfile){
    data = {
        is_sender: false,
        is_receiver: false,
        sameProfile: false,
        sendAdd:false,
        sendMessage:false,
        FriendRequest:null
    }
    await is_sender(currUser, UserProfile).then((fr_data)=>{
        data.is_sender = fr_data !== null;
        data.FriendRequest = fr_data
    }) 
    if (!data.is_sender){
        await is_sender(UserProfile, currUser).then((fr_data)=>{
            data.is_receiver = fr_data !== null;
            if(fr_data)
                data.FriendRequest = fr_data._id
        }) 
    }
    data.sameProfile = currUser === UserProfile
    data.sendAdd = ! data.is_sender && ! data.is_receiver && ! data.sameProfile && currUser!== undefined
    data.sendMessage = currUser !== undefined
    return data
}


const RemoveFriendRequest = (id)=>{
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL).then(()=>{
            return FriendRequest.findByIdAndRemove(id);
        }).then(removed=>{
            mongoose.disconnect()
            resolve(removed);
        }).catch(err=>{
            mongoose.disconnect();
            reject(err)
        })
    })
}

const MakeFriendShip = (id)=>{
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL).then(()=>{
            return FriendRequest.findOneAndUpdate({_id:id}, {status:"accepted"})
            
        }).then(fr=>{
            const newFriend =  new Friend({
                sender:fr.sender,
                receiver:fr.receiver,
                friendRequest:fr
            })
            return newFriend.save()
        }).then(FriendShip=>{
            mongoose.disconnect()
            resolve(FriendShip)
        }).catch(err=>{
            mongoose.disconnect()
            reject(err)
        })
    })
}

module.exports = {
    getFriendRequest,
    user_data,
    getAllFriendsRequests,
    FriendRequestOps,
    RemoveFriendRequest,
    MakeFriendShip,
    getFriendShip
}