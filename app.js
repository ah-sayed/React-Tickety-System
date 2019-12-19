const createError = require('http-errors');
const express = require('express');
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connectDB = require('./config/db');
const cors = require('./utils/cors');
const dotenv = require('dotenv');

// All API endpoints
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/api/users');
const uploadRouter = require('./routes/api/uploadPhoto');
const authRouter = require('./routes/api/auth');
const profileRouter = require('./routes/api/profile');
const ticketsRouter = require('./routes/api/tickets');

const app = express();

// Configure .env file to load stored variables
// dotenv.config();

// Connect to our mongoDB
connectDB();

// Use CORS with options
app.use(cors.corsWithOptions);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

// Use passport to register or login uer before using the API
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/api/auth', authRouter);

// 
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', usersRouter);
app.use('/api/profile', profileRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/imageUpload', uploadRouter);

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
