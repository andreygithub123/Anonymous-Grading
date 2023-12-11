const sequelize = require("../sequelize");
const {DataTypes} = require ('sequelize');

const Project = sequelize.define("Project", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    projectName:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    teamId:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    grades:{
        type:DataTypes.ARRAY(DataTypes.FLOAT),
        validate: {
            isFiveGrades(array){
                if(array.length > 5) {
                    throw new Error('Maximum 5 grades for this project!')
                }
            },
            isFloatArray(array){
                if(!Array.isArray(array) || array.some(num => typeof num !== 'number' || isNaN(num))){
                    throw new Error('The grades should be floats only!')
                }

            }
        }
    }
});

module.exports=Project;