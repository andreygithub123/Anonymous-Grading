const sequelize = require("../sequelize");
const {DataTypes} = require ('sequelize');

const Team = sequelize.define("Team", {
    teamId:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    teamName :{
        type: DataTypes.STRING,
        allowNull:false,
        validate: {
            isSafeString(value) {
                // Validate that teamName does not contain harmful characters
                const safePattern = /^[a-zA-Z0-9\s]+$/;
                if (!safePattern.test(value)) {
                    throw new Error('Invalid characters in teamName');
                }
            },
        },
    },
    noMembers : {
        type: DataTypes.INTEGER
    }
  
});

Team.beforeCreate((team, options) => {
    team.teamName = sequelize.escape(team.teamName);
});


module.exports=Team;