const sequelize = require("../sequelize");
const {DataTypes} = require ('sequelize');

const User = sequelize.define("User", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    fullName :{
        type: DataTypes.STRING,
        allowNull:false,
        validate: {
            isNameSafe(value) {
                // Validate that teamName does not contain harmful characters
                const safePattern = /^[a-zA-Z0-9\s]+$/;
                if (!safePattern.test(value)) {
                    throw new Error('Invalid characters in user name');
                }
            },
        },
    },
    email:{
        type:DataTypes.STRING,
        validate: {
            isEmail:true
        },
    },
    type:{
        type: DataTypes.ENUM,
        values: ['ProjectMember', 'Professor', 'Student'],
        validate: {
            isIn: [['ProjectMember', 'Professor', 'Student']]
        },
    },
    password : {
        type:DataTypes.STRING,
        allowNull:false
    },
    TeamId:{
        type:DataTypes.INTEGER
        }
});

module.exports=User;