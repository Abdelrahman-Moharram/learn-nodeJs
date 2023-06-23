const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const sessionStore = require('connect-mongodb-session')(session);
const flash = require('express-flash')

const server = require('http').createServer(app) // socket.io require http server type
const io = require('socket.io')(server)
const socketInit = require("./sockets/init.sockets")
const socketFriends = require("./sockets/Friends.sockets")

socketFriends.FriendsRequest(io)

// socket.io CONFIG
io.on("connection", (socket)=>{
    console.log("connected");
    // socketInit(socket)
    
})



// import Routes
const ErrorRoutes = require('./Routers/errors.routes')
const HomeRoutes = require('./Routers/home.routes')
const AccountsRoutes = require('./Routers/accounts.routes');


app.use(bodyParser.urlencoded({ extended:true}))
app.use(express.static('static'));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));






const STORE = new sessionStore({
    uri:'mongodb://localhost:27017',
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


server.listen("3000", "192.168.1.105", ()=>{
    console.log("listening on 192.168.1.105:3000")
})