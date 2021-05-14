var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;
const {getRecentPosts, getPostById} = require('../middleware/postmiddleware');
var db = require('../conf/database');

/* GET home page. */
router.get('/', getRecentPosts, function(req, res, next) {
  //next(new Error('test'));
  res.render('index',{title:"Home Page"});
});

router.get('/login',(req,res,next) => {
  res.render("login", {title:"Log In"});
});

router.get('/registration',(req,res,next) => {
  res.render("registration", {title:"Register"});
});

router.get('/imagepost',(req,res,next) => {
  res.render("imagepost", {title:"View an Image"});
});

//middleware to protect postimage if not logged in
router.use('/postimage', isLoggedIn);
router.get('/postimage', (req,res,next) => {
  res.render("postimage", {title:"Post an Image"});
});

//post/id
router.get("/post/:id(\\d+)", getPostById, (req,res,next) => {
  res.render('imagepost', { title: `Post ${req.params.id}`});
});

module.exports = router;
