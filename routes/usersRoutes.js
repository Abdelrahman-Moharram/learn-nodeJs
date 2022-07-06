var express = require('express');
var router = express.Router();
const check = require('express-validator').check;
const users = require('../Controller/usersController');
const validationResult = require('express-validator').validationResult
const passport = require('passport');
const csrf = require('csurf');

router.use(csrf());

router.get('/register',is_loggedin_redirect_home,users.getRegister);	
router.get('/user',is_loggedin, users.profile)
router.get('/signin',is_loggedin_redirect_home,users.getSignin)


router.get('/logout', (req, res, next)=>{
	req.logOut(true, (err)=>{
		if (err)
			console.log("logout err ",err)
	});
	res.redirect('/')
})







function is_loggedin(req, res, next){
	if(! req.isAuthenticated()){
		res.redirect('/users/signin');
		return ;
	}
	next();
}





function is_loggedin_redirect_home(req, res, next){
	console.log("req.isAuthenticated() = ",req.isAuthenticated())
	if(req.isAuthenticated()){
		res.redirect('/');
		return ;
	}
	next();
}




router.post("/register", [
	check("username").notEmpty().withMessage("username shouldn't be Empty"),
	check("fullname").notEmpty().withMessage("fullname shouldn't be Empty"),
	check("email").notEmpty().withMessage("email shouldn't be Empty"),
	check("password").notEmpty().withMessage("password shouldn't be Empty"),
	
	
	check('username').exists().withMessage("username already taken"),
	check('email').exists().withMessage("email already registered"),
	
	check("password2").custom((value, {req})=>{
		if(value === req.body.password){
			return true
		}
		else{
			throw new Error("Password doesn't match !") 
		}
	})
],(req, res, next)=>{
	const validResults = validationResult(req);
	var signupError = req.flash("signupError"); 
	if(!validResults.isEmpty() || signupError.length){
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
	next()
},	passport.authenticate('local-signup',{
	session: false,
	successRedirect:'/users/signin',
	failureRedirect:'/users/register',
	failureMessage:true,
})
);




router.post('/signin', [
	check("email").notEmpty().withMessage("email shouldn't be Empty"),
	check("password").notEmpty().withMessage("password shouldn't be Empty"),
], (req, res, next)=>{
	const validResults = validationResult(req);
	console.log("validResults", validResults);
	if(!validResults.isEmpty()){
		var ER = {
			email:[],
			password:[],
		}
		validResults.errors.forEach(element => {
			ER[element.param].push(element.msg)
		});
		req.flash('signinError', ER)
		req.flash('email', req.body.email)
		res.redirect('signin')
		return;
	}
	next()
},passport.authenticate('local-signin', {
	successRedirect: '/',
	failureRedirect:'/users/signin',
	failureFlash:true
}))

module.exports = router;
