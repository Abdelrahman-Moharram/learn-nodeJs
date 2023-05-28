const express = require('express');
const app = express();
const server = require('http').createServer(app)
//-- app بدل ال  listen  وهخلي السيرفر يعمل  createServer(app) في ال app هباصي ال express بتاع ال  app  وعشان اربطه بال "http"  عشان استخدم السوكيت لازم اشتغل علي 
const io = require('socket.io')(server);
const path = require('path');
// routes import
const aboutRouter = require('./Routes/aboutRouter');

// socket configurations

io.on('connection', (socket)=>{
	socket.emit('serverEvent', {
		status:"connected",
		// data:[
		// 	"Adel",
		// 	"adel@yahoo.com"
		// ]
	})
	socket.on('ClientMessage', data=>{
		console.log(data)
		socket.broadcast.emit('serverMessage', data)
	})
})


// CONFS

app.set("view engine", "hbs")
app.set("views", path.join(__dirname, "views"))


// ADD ROUTES
app.use("/about",aboutRouter);

app.all("/",(req, res, next)=>{
	res.send("Hello There in Home");
})

app.use((req, res, next)=>{
	res.send("Not Found 404 Error!");
})

server.listen("3000", "192.168.1.5", ()=>console.log("Server running on port 192.168.1.5:3000"));
