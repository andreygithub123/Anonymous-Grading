const sequelize = require("../sequelize");
const {DataTypes} = require ('sequelize');

const User = sequelize.define("User", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true,
    },
    fullName :{
        type: DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        validate: {
            isEmail:true,
        },
    },
    type:{
        type: DataTypes.ENUM,
        values: ['ProjectMember', 'Professor', 'Student']
    },
    teamId:
    {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    password : {
        type:DataTypes.STRING,
        allowNull:false
    }

});

module.exports=User;