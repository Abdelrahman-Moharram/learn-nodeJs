const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
})

userSchema.methods.hashPassword = (password) =>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)
}

userSchema.methods.comparePassword = (password, userPassword) =>{
    return bcrypt.compareSync(password, userPassword);
}

module.exports = mongoose.model('users', userSchema)