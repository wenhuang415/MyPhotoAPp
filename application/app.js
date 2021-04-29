var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var handlebars = require('express-handlebars');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dbRouter = require('./routes/dbtest');
var errorPrint = require('./helpers/debug/debugprinters').errorPrint;
var successPrint = require('./helpers/debug/debugprinters').successPrint;
var requestPrint = require('./helpers/debug/debugprinters').requestPrint;

var app = express();

app.use((req,resp,next) => {
    console.info('\x1b[42m\x1b[30m Request URL : ' + req.url + '\x1b[0m');
    next();
})

app.engine(
    "hbs",
    handlebars({
        layoutsDir: path.join(__dirname,"views/layouts"),
        partialsDir: path.join(__dirname,"views/partials"),
        extname: ".hbs",
        defaultLayout: "home",
        helpers: {

        }
    })
);
app.set("view engine", "hbs");
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    requestPrint(req.url);
    next();
});

app.use('/', indexRouter);
app.use('/dbtest',dbRouter);
app.use('/users', usersRouter);

app.use((err, req, res, next) => {
    errorPrint(err);
    res.render('error', {err_message: err});
});

app.use((err, req, res, next) => {
    res.status(500);
    res.send('something went wrong with your db');
});


module.exports = app;
