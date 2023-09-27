const mongoose = require('mongoose');
process.env.DB_URL = 'mongodb://127.0.0.1:27017/ChatApp'


const User = require("../models/users.model")
const bcrypt = require('bcrypt')



const hashPassword = (password)=>{
    return bcrypt.hash(password, 10)
}






const CreateUser = (data) =>{
    return new Promise((resolve, reject) =>{
        mongoose.connect(process.env.DB_URL).then(()=>{
            return User.findOne({email: data.email})
        }).then(user=>{
            if(user){
                mongoose.disconnect()
                reject("User already exists")
            }else if(data.password !== data.retype_password){
                mongoose.disconnect()
                reject("Password did not match")
            }
            else{
                return hashPassword(data.password)
            }
        }).then(hasedPassword=>{
            let newUser = new User({
                email: data.email,
                username: data.username,
                name:data.name,
                // image:data.image,
                password: hasedPassword
            })
            return newUser.save()
        }).then(user=>{
            mongoose.disconnect()
            resolve(user)
        }).catch(err=>{
            mongoose.disconnect()
            reject(err)
        })
    })
}


const Authenticate = (email, password) =>{
    return new Promise((resolve, reject) =>{
        mongoose.connect(process.env.DB_URL).then(()=>{
            return User.findOne({email:email})
        }).then(user=>{
            if(user){
                if (bcrypt.compare(password, user.password)){
                    mongoose.disconnect()
                    delete user["password"]
                    resolve(user)
                }else{
                    mongoose.disconnect()
                    reject("Invalid password")
                }
            }else{
                mongoose.disconnect()
                reject("User with this email is Not Found")
            }
        }).catch(err=>{
            mongoose.disconnect()
            reject(err)
        });
    })
}



const getUserByUsername = (usernames) =>{
    return new Promise((resolve, reject)=>{
        mongoose.connect(process.env.DB_URL).then(()=>{
            return User.find({username: {$in:  usernames}})
            // return User.where({username:username}).findOne()

        }).then(user=>{
            resolve(user)
            mongoose.disconnect()
        }).catch(err=>{
            reject(err)
            mongoose.disconnect()
        })
    })
}



module.exports = {
    CreateUser,
    Authenticate,
    getUserByUsername
}