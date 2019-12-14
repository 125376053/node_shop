var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize')
var test = require('../model/test').test

router.post('/test',async function(req,res){
    res.send('ok')
})

module.exports = router;
