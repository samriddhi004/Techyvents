require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const User = require('./models/user'); 
const verifyToken = require('./middleware/authMiddleware');



var authRouter = require('./routes/auth');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// var mongoose = require("mongoose")
// mongoose.connect('mongodb+srv://kritisubedi011:1234@cluster0.n3ncc.mongodb.net/')
//   .then(() => console.log('Connected!'));
mongoose.connect('mongodb+srv://kritisubedi011:1234@cluster0.n3ncc.mongodb.net/')
  .then(() => console.log('Connected!'))
  .catch(err => console.error('MongoDB connection error:', err));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

app.use(verifyToken);

app.use('/', indexRouter);
app.use(authRouter);
app.use('/', usersRouter);

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
  res.render('error');
});


module.exports = app;
