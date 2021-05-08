var express = require('express');
var router = express.Router();
var db = require('../conf/database');
const { successPrint, errorPrint, requestPrint } = require('../helpers/debug/debugprinters');
var sharp = require('sharp');
var multer = require('multer');
var crypto = require('crypto');//to mangle file names
var PostError = requestPrint('../helpers/error/PostError');

router.post('/createPost', (req, res, next) => {
    console.log(req);
    res.send('');
})

module.exports = router;