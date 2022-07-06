var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usersRoutes');
var app = express();
require('./config/passport'); // 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');
app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret : 'ShoppingCard_@!',
  saveUninitialized:true, // هنا بيحجز مكان للداتا اللي لسه متعملتش في الموقع
  resave:false, // في حاله اني مثلا خرجت او قفلت الموقع بيعمل السيشن من اول وجديد لو ترو
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost/shopping-card', {useNewUrlParser:true}, (errors)=>{
  if (errors){
    console.log("errors= ",errors)
  }else{
    console.log("database Connected")
  }
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('shared/error');
});

module.exports = app;
