const {Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');  

class Restaurant extends Model{}
Restaurant.init({
    name: DataTypes.STRING,
    imange: DataTypes.STRING
}, {sequelize:sequelize})

class Menu extends Model{}
Menu.init({
    title: DataTypes.STRING
}, {sequelize:sequelize})

class Item extends Model{}
Item.init({
    title: DataTypes.STRING,
    price : DataTypes.FLOAT
}, {sequelize : sequelize})

Restaurant.hasMany(Menu)
Menu.belongsTo(Restaurant)
Menu.hasMany(Item)
Item.belongsTo(Menu)

module.exports = {Restaurant, sequelize, Menu, Item}
