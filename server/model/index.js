const Sequelize = require('sequelize');
const connect = new Sequelize('shop', 'root', 'root', {
    host: '39.106.94.75',
    dialect: 'mysql',
    port:3306,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions:{
        dateStrings:true,
        typeCast:true
    },
    define: {
        charset: 'utf8mb4'
    }
});

exports.connect = connect
