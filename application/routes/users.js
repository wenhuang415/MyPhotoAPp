var express = require('express');
var router = express.Router();
var db = require('../conf/database');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
