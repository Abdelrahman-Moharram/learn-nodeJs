const addFakeData = require('../init/productInit');
const products = require('../models/products')










const index = (req, res, next) => {
	products.find({},(errors, result)=>{
		if (errors){
			console.log(errors)
		}
		else{			
			console.log(result)
			res.render('Home/index', { title: 'Shoping Card', products:result });
		}
	})
}


// const getSearch = (req, res, next)=>{

// }
const search = (req, res, next)=>{
	console.log("req.query.search = ",req.query.search)
	products.find({productName:new RegExp('.*'+req.query.search+'*.', "i")}, (errors, result)=>{
		if (errors){
			console.log(errors)
		}
		else{
			res.render('Home/index', { title: req.query.search + ' | search', products:result });
		}
	})
}



module.exports = {
	index : index,
	search: search,
}