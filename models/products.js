const mongoose = require('mongoose');

const products = mongoose.Schema({
	productName:{
		type:String,
		required:true,
	},
	productImage:{
		type:String,
		required:true,
	},
	price:{
		type:Number,
		required:true,
	},
	details:{
		required:true,
		type:{
			storageCapacity:String,
			numberSim:String,
			cameraResolution:String,
			displaySize:String,
		}
	}
})

module.exports = mongoose.model('products', products);