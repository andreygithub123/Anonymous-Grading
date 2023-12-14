const sequelize = require("../sequelize");
const {DataTypes} = require ('sequelize');

const Project = sequelize.define("Project", {
    projectName:{
        type:DataTypes.STRING,
        allowNull:false,
        validate: {
            isSafeProjectString(value) {
                // Validate that projectName does not contain harmful characters like * , JOINS etc
                const safePattern = /^[a-zA-Z0-9\s]+$/;
                if (!safePattern.test(value)) {
                    throw new Error('Invalid characters in projectName');
                }
            },
        },
    },
    grades:{
        type:DataTypes.TEXT 
    },
    foreignKeyTeam: {
        type:DataTypes.INTEGER,
        allowNull:true,
    }
});

module.exports=Project;