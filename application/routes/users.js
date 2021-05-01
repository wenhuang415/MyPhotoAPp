var express = require('express');
var router = express.Router();
var db = require('../conf/database');
var errorPrint = require('../helpers/debug/debugprinters').errorPrint;
var successPrint = require('../helpers/debug/debugprinters').successPrint;
var requestPrint = require('../helpers/debug/debugprinters').requestPrint;
var bcrypt = require('bcrypt');



router.post('/register', (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let cpassword = req.body.password;
  /*
  * do server side validation
  */
 db.execute("SELECT * FROM users WHERE username=?",[username]).then(
   ([results, fields]) => {
   if(results && results.length == 0) {
    return db.execute("SELECT * FROM users WHERE email=?", [email]);
   }else{
     throw new UserError(
       "Registration Failed: Username already exists",
       "/registration",
       200
     );
   }
 })
 .then(([results, fields]) => {
  if(results && results.length == 0) {
    return bcrypt.hash(password,15);
  } else {
     throw new UserError(
       "Registration Failed: Email already exists",
       "/registration",
       200
     );
   }
 })
 .then((hashedPassword) => {
    let baseSQL = "INSERT INTO users (username, email, password, created) VALUES (?,?,?,now());"
    return db.execute(baseSQL,[username, email, hashedPassword]) 
 })
 .then(([results, fields]) => {
  if(results && results.affectedRows){
    successPrint("User.js -->user was created");
    req.flash('success','user account has been made');
    res.redirect('/login');
  }else{
    throw new UserError(
      "Server Error, user could not be created",
      "/registration",
      500
    );
  }
 })
 .catch((err) => {
   errorPrint("user could not be made", err);
   if(err instanceof UserError){
    errorPrint(err.getMessage());
    req.flash('error',err.getMessage());//get error message from object
    res.status(err.getStatus());
    res.redirect(err.getRedirectURL());
   }else{
     next(err);
   }
 });
});//end of register

//user log in
router.post('/login', (req, res, next) => {
  let username =req.body.username;
  let password = req.body.password;
  /**
   * do server validation
   */
  let baseSQL = "SELECT id,username, password FROM users WHERE username=?;";
  let userId;//userid for posts
  db.execute(baseSQL,[username])
  .then(([results, fields]) => {
    if(results && results.length == 1) {
      let hashedPassword = results[0].password;
      userId = results[0].id;
      return bcrypt.compare(password, hashedPassword)
    }else{
      throw new UserError("invalid username and/or password", "/login", 200);
    }
  })
  .then((passwordsMatched) => {
    if(passwordsMatched){
      //sessions to track log in
      successPrint(`User ${username} is logged in`);
      req.session.username = username;
      req.session.userId = userId;
      res.locals.logged = true;
      req.flash('success','log in was successful');
      res.redirect("/");
    }else{
      throw new UserError("Invalid username and/or password", "/login", 200);
    }
  })
  .catch((err) => {
    errorPrint("user login failed");
    if(err instanceof UserError){
      errorPrint(err.getMessage());
      req.flash('error',err.getMessage());//get error message from object
      res.status(err.getStatus());
      res.redirect('/login');
    } else{
      next(err);
    }
  })
});//end of login

//log out
router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if(err){
      errorPrint('session could not be destroyed.');
      next(err);
    }else{
      successPrint('session was destroyed');
      res.clearCookie('csid');
      res.json({status:"OK", message:"user is logged out"});
    }
  })
});

module.exports = router;
