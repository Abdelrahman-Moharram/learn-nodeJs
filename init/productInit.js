const addProducts = require('../models/products')

const allProds=[
	{
		productName:'Samsung Galaxy s21 Ultra',
		productImage: '/images/download (1).jpg',
		price:19000,
		details:{
			storageCapacity:'512 GB',
			numberSim:'dual sim card',
			cameraResolution:'100 MP',
			displaySize:'1920X1080 OLED',
		},
	},

	{
		productName:'Samsung Galaxy s20 Ultra',
		productImage: '/images/download (2).jpg',
		price:17000,
		details:{
			storageCapacity:'320 GB',
			numberSim:'dual sim card',
			cameraResolution:'48 MP',
			displaySize:'1920X1080 OLED',
		},
	},
	


]
const addFakeData = () =>{
	allProds.forEach(element => {
		const product = new addProducts(element);
		product.save((errors, result)=>{
			if (errors){
				console.log(errors)
			}
			else{
				console.log(result)
			}
		});
	});
}

module.exports = addFakeData;








//routes

	// userModel.findOne({email:req.body.email}, (ERR, RES)=>{
	// 	if(ERR){
	// 		console.log("ERR = ",ERR)
	// 		return;
	// 	}
	// 	else{
	// 		if(!RES){
	// 			const newUser = new userModel({
	// 				username:req.body.username,
	// 				fullname:req.body.fullname,
	// 				email:req.body.email,
	// 				password: new userModel().hashPassword(req.body.password),
	// 			})
	// 			newUser.save((Err, results)=>{
	// 				if(Err){
	// 					console.log("Err = ",Err)
	// 					return; 
	// 				}
	// 				console.log("results", results)
	// 				res.redirect("/")
	// 			})
	// 		}
	// 		else{
	// 		res.render('users/register', {title:'register', errors: {email: ['this email registered before']}, data:req.body})	
	// 		}
	// 	}
	// })

















//===============================================================================







// router.post('/register', [
// 	check('email').notEmpty().withMessage('Email Can\'t be Empty'),
// 	check('email').isEmail().withMessage('Email is Not Valid'),

// 	check('username').notEmpty().withMessage('username Can\'t be Empty'),

// 	check('fullname').notEmpty().withMessage('fullname Can\'t be Empty'),

// 	check('password').notEmpty().withMessage('password Can\'t be Empty'),
// 	check('password').isLength({min:5}).withMessage('password is too weak'),

// 	check('password2').custom((value, {req})=>{
// 		if(value !== req.body.password){
// 			throw new Error('password not match')
// 		}
// 		return true
// 		}),
// 	],(req, res, next) =>{
// 		const errors = validationResult(req);
// 		if (!errors.isEmpty()){
// 			console.log(errors.errors)
// 			res.render('users/register',{'errors':errors.errors, data: req.body})
// 			return;
// 		}
// 		const newUser = new userModel({
// 			username : req.body.username,
// 			fullname : req.body.fullname,
// 			email 	 : req.body.email,
// 			password : new userModel().hashPassword(req.body.password)
// 		});
// 		userModel.findOne({email:req.body.email}, (Err, results)=>{
// 			if (Err){
// 				console.log(Err)
// 			}
// 			else{
// 				if(results){
// 					res.render('users/register',{errors:[{msg:'this user already registered'}], data: req.body})
// 				}
// 				else{
// 					newUser.save((errors, result)=>{
// 						if (errors){
// 							console.log(errors)
// 						}
// 						else{
// 							console.log(result)
// 							res.redirect('/')
// 						}
// 					});
// 				}
// 			}
// 		})
		
// });
