var Sequelize = require('sequelize')
var connect = require('./index').connect
var moment = require('moment')
const cityList = connect.define('cityList', {
    // 属性
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
        get() {
            return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
        }
    },
    updatedAt: {
        type: Sequelize.DATE,
        get() {
            return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
        }
    }
}, {
    timestamps: false,
    tableName: 'cityList',
    freezeTableName:true
});

cityList.sync()

exports.cityList = cityList
