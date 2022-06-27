const validationResult = require('express-validator').validationResult
const userModel = require('../models/usersModel');
const passport = require('passport');



const getSignin = (req, res, next)=>{
	var signErrors = req.flash('signinError');
	var inputEmail = req.flash('email');
  res.render('users/login', {title:'signin', signErrors: signErrors[0], email: inputEmail[0], checkuser:false});
}





const getRegister = (req, res, next)=> {
	var errorMessages = req.flash("signupError");
	var inputData = req.flash('inputData');
  res.render('users/register', {title:'register', errors:errorMessages[0], data:inputData[0], checkuser:false});
}


const profile = (req, res, next)=>{
	res.render('users/profile',{user:req.user, checkuser:true})
}



const postRegister = (req, res, next)=>{
	const validResults = validationResult(req);
	console.log("validResults", validResults);
	if(!validResults.isEmpty()){
		var ER = {
			username:[],
			email:[],
			fullname:[],
			password:[],
			password2:[]
		}
		validResults.errors.forEach(element => {
			ER[element.param].push(element.msg)
		});
		res.render('users/register', {title:'register', errors: ER, data:req.body})
		return;
	}
	passport.authenticate('local-signup',{
		successRedirect:'/users/signin',
		failureRedirect:'/users/register',
		failureMessage:true,
	});

	
}





module.exports = {
	getSignin:getSignin,
	getRegister: getRegister,
	postRegister : postRegister,
	profile:profile
}