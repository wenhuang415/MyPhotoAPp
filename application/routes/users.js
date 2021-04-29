var express = require('express');
var router = express.Router();
var db = require('../conf/database');
var errorPrint = require('../helpers/debug/debugprinters').errorPrint;
var successPrint = require('../helpers/debug/debugprinters').successPrint;
var requestPrint = require('../helpers/debug/debugprinters').requestPrint;
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

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
    let baseSQL = "INSERT INTO users (username, email, password, created) VALUES (?,?,?,now());"
    return db.execute(baseSQL,[username, email, password]) 
  } else {
     throw new UserError(
       "Registration Failed: Email already exists",
       "/registration",
       200
     );
   }
 })
 .then(([results, fields]) => {
  if(results && results.affectedRows){
    successPrint("User.js -->user was created");
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
    res.status(err.getStatus());
    res.redirect(err.getRedirectURL());
   }else{
     next(err);
   }
 });
});

module.exports = router;
