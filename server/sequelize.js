const { Sequelize } = require('sequelize') ;

// Use sequelize with sqlite query type on project.db database
const sequelize = new Sequelize({
    dialect:"sqlite",
    storage:"./sqlite/project.db"
});


sequelize
.sync({
   alter:true  //checks if the table exists already
})
.then(() => {
    console.log("All models were syncronized successfully");
});

//export the sequelize
module.exports = sequelize  