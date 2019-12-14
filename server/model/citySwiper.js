var Sequelize = require('sequelize')
var connect = require('./index').connect
var moment = require('moment')
var cityList = require("./cityList").cityList

const citySwiper = connect.define('citySwiper', {
    title:Sequelize.STRING,
    href:Sequelize.STRING,
    city_id:{
        type: Sequelize.INTEGER,
        references: {
            model: cityList,
            key: 'id'
        }
    }
}, {
    timestamps: false,
    tableName: 'citySwiper',
    freezeTableName:true
});
citySwiper.sync()

citySwiper.belongsTo(cityList, {foreignKey: 'city_id'})

// citySwiper.bulkCreate([
//     {title:'北京1',href:'/go2.jpg','city_id':1},
//     {title:'北京2',href:'/go3.jpg','city_id':2}
// ])

exports.citySwiper = citySwiper
