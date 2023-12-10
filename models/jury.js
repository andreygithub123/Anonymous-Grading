const sequelize = require("../sequelize");
const {DataTypes} = require ('sequelize');

const Jury = sequelize.define("Jury", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    fullName : DataTypes.STRING,
    email:{
        type:DataTypes.STRING,
        validate: {
            isEmail:true,
        },
    },
});

module.exports=Jury;