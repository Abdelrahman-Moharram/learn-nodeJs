const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
	_id:{
		required : true,
		type: String,
	},
	quantity:{
		required : true,
		type : Number,
	},
	totalCredit:{
		required : true,
		type:Number
	},
	selectedProduct:{
		required : true,
		type : Array,
	}
})


module.exports = mongoose.model('Card', cardSchema)