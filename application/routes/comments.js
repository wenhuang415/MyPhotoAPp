var express = require("express");
var router = express.Router();
const { successPrint, errorPrint } = require("../helpers/debug/debugprinters");
const { create } = require('../models/Comments');

router.post('/create', (req,res,next) => {
    console.log(req.body);
    res.json("comment received!");
})

module.exports = router;