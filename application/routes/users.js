var express = require('express');
var router = express.Router();
var db = require('../conf/database');
var errorPrint = require('../helpers/debug/debugprinters').errorPrint;
var successPrint = require('../helpers/debug/debugprinters').successPrint;
var requestPrint = require('../helpers/debug/debugprinters').requestPrint;
var UserError = require('../helpers/error/UserError');
const UserModel = require("../models/Users");
var PostError = require('../helpers/error/PostError');
var bcrypt = require('bcrypt');

router.post('/register', (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let cpassword = req.body.password;
  UserModel.usernameExists(username)
    .then((userDoesNameExists) => {
      if (userDoesNameExists) {
        throw new UserError(
          "Registration Failed: Email already exists",
          "/registration",
          200
        );
      } else {
        return UserModel.emailExists(email);
      }
    })
    .then((emailDoesExist) => {
      if (emailDoesExist) {
        throw new UserError(
          "Registration Failed: Email already exists",
          "/registration",
          200
        );
      } else {
        return UserModel.create(username, password, email);
      }
    })
    .then((createdUserId) => {
      if (createdUserId < 0) {
        throw new UserError(
          "Server Error, user could not be created",
          "/registration",
          500
        );
      } else {
        successPrint("User.js -->user was created");
        req.flash('success', 'user account has been made');
        res.redirect('/login');
      }
    })
    .catch((err) => {
      errorPrint("user could not be made", err);
      if (err instanceof UserError) {
        errorPrint(err.getMessage());
        req.flash('error', err.getMessage());//get error message from object
        res.status(err.getStatus());
        res.redirect(err.getRedirectURL());
      } else {
        next(err);
      }
    });
});//end of register

//user log in
router.post('/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  UserModel.authenticate(username, password)
    .then((loggedUserId) => {
      if (loggedUserId > 0) {
        //sessions to track log in
        successPrint(`User ${username} is logged in`);
        req.session.username = username;
        req.session.userId = loggedUserId;
        res.locals.logged = true;
        req.flash('success', 'log in was successful');
        res.redirect("/");
      } else {
        throw new UserError("Invalid username and/or password", "/login", 200);
      }
    })
    .catch((err) => {
      errorPrint("user login failed");
      if (err instanceof UserError) {
        errorPrint(err.getMessage());
        req.flash('error', err.getMessage());//get error message from object
        res.status(err.getStatus());
        res.redirect("/login");
      } else {
        next(err);
      }
    })
});//end of login

//log out
router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      errorPrint('session could not be destroyed.');
      next(err);
    } else {
      successPrint('session was destroyed');
      res.clearCookie('csid');
      res.json({ status: "OK", message: "user is logged out" });
    }
  })
});

module.exports = router;
