const mongoose = require('mongoose');
process.env.DB_URL = 'mongodb://127.0.0.1:27017/ChatApp'


const User = require("../models/users.model")
const {FriendRequest, Friend} = require("../models/friends.models");
const {
    Chat,
    Message,
} =  require("../models/messages.models");

const user_data = (username, currUser=null) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.DB_URL).then(()=>{
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
        mongoose.connect(process.env.DB_URL).then(()=>{
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
        mongoose.connect(process.env.DB_URL).then(()=>{
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
        mongoose.connect(process.env.DB_URL).then(()=>{
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
        mongoose.connect(process.env.DB_URL).then(()=>{
            return Friend.findOne({sender:sender, receiver:receiver})
        }).then(fr=>{
            if(fr){
                mongoose.disconnect()
                resolve(fr)
            }else{
                return Friend.findOne({sender:receiver, receiver:sender})
            }
        }).then(fr=>{
            mongoose.disconnect()
            resolve(fr)
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
        mongoose.connect(process.env.DB_URL).then(()=>{
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
        mongoose.connect(process.env.DB_URL).then(()=>{
            return FriendRequest.findOneAndUpdate({_id:id}, {status:"accepted"})
            
        }).then(fr=>{
            const newChat = new Chat({
                users:[fr.sender, fr.receiver]
            })
            newChat.save()
            return {chat:newChat, fr:fr}
        }).then((data)=>{
            const newFriend =  new Friend({
                sender: data.fr.sender,
                receiver: data.fr.receiver,
                friendRequest:data.fr,
                chat_id: data.chat._id
            })
            return newFriend.save()                
        }).catch(err=>{
            console.log("create chat error= ", err);
        }).then(FriendShip=>{
            resolve(FriendShip)
            mongoose.disconnect()
            
        }).catch(err=>{
            mongoose.disconnect()
            reject("==< ",err)
        })
    })
}

// return User.find(
//     {"username":{ "$regex": query, "$options": "i" }},
//     {"name":{ "$regex": query, "$options": "i" }},
//     {"email":{ "$regex": query, "$options": "i" }}
//     )


const SearchUser = (query) =>{
    return new Promise((resolve, reject)=>{
        mongoose.connect(process.env.DB_URL).then(()=>{
            if (query){
                return User.find({
                    "$or":[
                        {
                            "name":{"$regex":query, "$options": "i"},
                        },
                        {
                            "username":{"$regex":query, "$options": "i"},
                        },
                        {
                            "email":{"$regex":query, "$options": "i"},
                        },
                    ]
                })
            }
            return null
        }).then(users=>{
            mongoose.disconnect()
            resolve(users)
        }).catch(err=>{
            mongoose.disconnect()
            reject(err)
        })
    })
}
// Message
// Chat



const getAllChats = (id)=>{
    return new Promise((resolve, reject)=>{
        mongoose.connect(process.env.DB_URL).then(()=>{
            return Chat.find({users: {$all: [id]}})
        }).then(chats=>{
            mongoose.disconnect()
            resolve(chats)
        }).catch(err=>{
            console.log("err=> ",err);
            mongoose.disconnect()
            reject(err)
        })
    })
}

const getChatById = (chat_id)=>{
    return new Promise((resolve, reject)=>{
        mongoose.connect(process.env.DB_URL).then(()=>{
            return Chat.findOne({_id: chat_id})
        }).then(chat=>{
            mongoose.disconnect()
            resolve(chat)
        }).catch(err=>{
            mongoose.disconnect()
            reject(err)
        })
    })
}



const createChat = (data) =>{
    return new Promise((resolve, reject)=>{
        mongoose.connect(process.env.DB_URL).then(()=>{
            const newChat = new Chat({
                users: data.users,
                name: data.name,
                image: data.image,
                admins: data.admins,
            })
            return newChat.save()
        }).then((chat)=>{
            mongoose.disconnect()
            resolve(chat)
        }).catch(err=>{
            mongoose.disconnect()
            reject("272 create chat error=> ",err)
        })
    })
}

const addMessage = (data) =>{
    return new Promise((resolve, reject)=>{
        mongoose.connect(process.env.DB_URL).then(()=>{
            const newMessage = new Message({
                sender_username: data.sender_username,
                message: data.message,
                files: data.files,
                chat_id: data.chat_id
            })
            return newMessage.save()
        }).then(message=>{
            mongoose.disconnect()
            resolve(message)
        }).catch(err=>{
            mongoose.disconnect()
            reject(err)
        })
    })
}

const getChatByUsersIds= (users) =>{
    mongoose.connect(process.env.DB_URL).then(()=>{
        return Chat.find({users:users})
    }).then(chat=>{
        mongoose.disconnect()   
        resolve(chat)
    }).catch(err=>{
        mongoose.disconnect()
        reject(err)
    })
}

const getMessageByChatId = async (chat_id) =>{
    if(chat_id){
        const connection = await mongoose.connect(process.env.DB_URL)
        var messages = await Message.find({chat_id:chat_id}).sort({datetime:1})
        if (messages){
            await mongoose.disconnect()
            return messages
        }else{
            await mongoose.disconnect()
            throw {message:"An error occurred", code:500}
        }
    }else{
        throw {message:"Chat Id Not Valid", code:500}
    }
}


module.exports = {
    getFriendRequest,
    user_data,
    getAllFriendsRequests,
    FriendRequestOps,
    RemoveFriendRequest,
    MakeFriendShip,
    getFriendShip,
    SearchUser,
    getAllChats,
    createChat,
    getChatById,
    addMessage,
    getChatByUsersIds,
    getMessageByChatId
}