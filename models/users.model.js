const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
	name:{
		type:String, 
		required: true
	},
	username:{
		type:String,
		required:true,
		unique:true
	},
	email:{
		type:String,
		required:true
	},
	image:{
		type:String,
		required:false
	},
	password:{
		type:String,
		required:true
	},
	active:{
		type:Boolean,
		default:false,
	},
	lastLogin:{
		type: Date,
		default: Date.now()
	},
})

const UserLinks = mongoose.Schema({
	link:{
		type: String,
		required:true
	},
	domain:{
		type:String,
		required:true
	},
	user_id:{
		required:true,
		type:String
	}
})


module.exports = mongoose.model("User", usersSchema)