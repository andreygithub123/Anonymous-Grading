const sequelize = require("../sequelize");
const {DataTypes} = require ('sequelize');

const Prof = sequelize.define("Prof", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
    },
    fullName : DataTypes.STRING,
    email:{
        type:DataTypes.STRING,
        validate: {
            isEmail:true,
        },
    },
});

module.exports=Prof;