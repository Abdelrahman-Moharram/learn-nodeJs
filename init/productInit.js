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