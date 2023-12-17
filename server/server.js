const express = require("express");
const sequelize = require("sequelize");
const cors = require("cors");

//Import routes and models from the directory
const user_router = require("./routes/user-route");
const User=require('./models/user');
const team_router = require("./routes/team-route");
const Team=require('./models/team');
const project_router = require("./routes/project-route");
const Project=require('./models/project');



//Express for server + use separate routes for each model
const app = express();
app.use(express.json());
app.use(cors());
app.use("/", user_router);
app.use("/", team_router);
app.use("/",project_router);


//use this when we want to precess the requests
app.use( (req,res,next) => {//this a custom middleware function and has next()
    console.log(req.url)    //logs the urls of every request
    next()                  //pass control to the next middleware/route handler
})

app.use( (err,req,res,next) => {        // handles servers errors
    console.log('An error Ocurred! : ' + err)        // logs the error into the console
    res.status(500).json({message: 'server error'}) // responds with status code 500 and message 'server error'
})





//Made app listen to port 8080
app.listen(8080, async () => {
    console.log("Server started on http://localhost:8080");
    
    try{
        await sequelize.authenticate();
        console.log("Connection has been established successfully");
    }
    catch(err)
    {
        console.log("Unnable to connect to the data base: " , err)
    }
});