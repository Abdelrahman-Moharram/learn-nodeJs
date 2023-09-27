const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const sessionStore = require('connect-mongodb-session')(session);
const flash = require('express-flash')
require('dotenv').config();
const hbs = require('hbs');
const server = require('http').createServer(app) // socket.io require http server type
const io = require('socket.io')(server)
const socketFriends = require("./sockets/Friends.sockets")

socketFriends.FriendsRequest(io)

// // socket.io CONFIG
// io.on("connection", (socket)=>{
//     console.log("connected");
//     // socketInit(socket)
    
// })



// import Routes
const ErrorRoutes = require('./Routers/errors.routes')
const HomeRoutes = require('./Routers/home.routes')
const AccountsRoutes = require('./Routers/accounts.routes');

hbs.registerPartials(__dirname + 'views/components');
hbs.registerPartial('chatTemp', '{{prefix}}')
app.use(bodyParser.urlencoded({ extended:true}))
app.use(express.static('static'));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));





const STORE = new sessionStore({
    uri:'mongodb://127.0.0.1:27017',
    collection:"ChatApp",
})

app.use(session({
    secret:"expressAppdjashdbasbdjkahsbdjbasdba=-=asd=a-012",
    saveUninitialized : false,
    resave:true,
    cookie:{
        maxAge:100*60*60*24*7,
    },
    store:STORE
}))

var appendLocalsToUseInViews = function(req, res, next)
{            
    //append request and session to use directly in views and avoid passing around needless stuff
    res.locals.user = req.session.user;
    next(null, req, res);
}
app.use(appendLocalsToUseInViews);
app.use(flash({ sessionKeyName: 'flashMessage' }));

app.use('/', HomeRoutes)
app.use('/accounts', AccountsRoutes)
app.use(ErrorRoutes)


server.listen(process.env.port_number, process.env.ip, ()=>{
    console.log("listening on 127.0.0.1:"+(process.env.port_number).toString())
})