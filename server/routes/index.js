var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize')
var cityList = require('../model/cityList').cityList
var citySwiper = require('../model/citySwiper').citySwiper

router.get('/city/list', async function (req, res) {
    let cityList1 = await cityList.findAll({raw: true})
    res.send({
        code: 1,
        msg: '获取成功',
        cityList1
    })
})

router.get('/city/picture', async function (req, res) {
    let id = req.query.area_id
    let ret = await citySwiper.findAll({
        where: {
            city_id: id
        },
        include: {
            model: cityList
        }
    })
    ret = JSON.parse(JSON.stringify(ret))
    //console.log(ret);
    var ret1 = ret.map(value=>{
        return {
            ...value,
            href:'http://127.0.0.1:3301'+value.href
        }
    })
    console.log(ret1);
    res.send({
        code: 1,
        msg: '获取成功',
        ret:ret1
    })
})

module.exports = router;
