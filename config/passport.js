const passport = require('passport');
const localStrategy = require("passport-local").Strategy;
const users = require('../models/usersModel');






passport.serializeUser((user, done)=>{
	return done(null, user.id)
})

passport.deserializeUser((id, done)=>{
	users.find({id:id},('email fullname username'), (err, user)=>{
		return done(err, user)
	})
})

passport.use('local-signup', new localStrategy({
	usernameField:'email',
	passwordField:'password',
	passReqToCallback:true
},(req, email, password, done)=>{
	users.findOne({email:email}, (err, user)=>{
		if (err){
			return done(err)
		}
		if (user){
			req.flash('inputData', req.body)
			return done(null, false, req.flash("signupError", {email:["email already exist"]}))
		}
		const newUser = new users({
			email : email,
			fullname : req.body.fullname,
			username : req.body.username, 
			password : new users().hashPassword(password),
		})
		newUser.save((err, user)=>{
			if(err){
				return done(err)
			}
			return done(null, user)
		})
	})
}))



passport.use('local-signin', new localStrategy({
	usernameField: 'email',
	passwordField:'password',
	passReqToCallback: true
},(req, email, password, done)=>{
	req.flash('email', email)
	users.findOne({email:email}, (err, user)=>{
		if(err){
			return done(err)
		}
		if(!user){
			return done(null, false, req.flash("signinError", {email:["email not found"]}))
		}
		if(!user.comparePassword(password, user.password)){
			return done(null, false, req.flash('signinError', {password:['password in correct']}))
		}
		req.flash("user", user)
		console.log("user 66 passport.js ==> ", user)
		return done(null, user)
	})
}))