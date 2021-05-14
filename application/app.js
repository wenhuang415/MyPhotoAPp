var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var handlebars = require('express-handlebars');
var sessions = require('express-session');
var mysqlSession = require("express-mysql-session")(sessions);
var flash = require('express-flash');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require("./routes/posts");
var commentRouter = require('./routes/comments');
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
            emptyObject: (obj) => {//don't show flash object if there's nothing in it
                return !(obj.constructor === Object && Object.keys(obj).length == 0);
            }
        },
    })
);

//configure sessions
var mysqlSessionStore = new mysqlSession(
    {
        /*using default options */
    },
    require('./conf/database')
);
app.use(sessions({
    key: "csid",//key used for cookie for front end
    secret: "this is a secret from csc317",//used to sign cookie
    store: mysqlSessionStore,
    resave: false,
    saveUninitialized: false//don't save sessions that we don't initialize ourselves
}));

//express flash middleware
app.use(flash());

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

//middleware for log out button to be consistent with login
app.use((req, res, next) => {
    if(req.session.username){
        res.locals.logged = true;
    }
    next();
})

//mounting
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentRouter);

app.use((err, req, res, next) => {
    errorPrint(err);
    res.render('error', {err_message: err});
});

app.use((err, req, res, next) => {
    res.status(500);
    res.send('something went wrong with your db');
});


module.exports = app;
