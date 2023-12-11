const sequelize = require("../sequelize");
const {DataTypes} = require ('sequelize');

const Team = sequelize.define("Team", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true,
    },
    teamName :{
        type: DataTypes.STRING,
        allowNull:false
    },
    noMembers : {
        type: DataTypes.INTEGER
    }
  
});

module.exports=Team;