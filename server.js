const express = require("express");
const sequelize = require("sequelize");

//routers
const user_router = require("./routes/user-route");
require('./models/user');


const app = express();
app.use(express.json());
app.use("/", user_router);

//use this when we want to precess the requests
app.use( (req,res,next) => {//this a custom middleware function and has next()
    console.log(req.url)    //logs the urls of every request
    next()                  //->After finishing this code,Pass control to the next middleware/route handler
})

app.use( (err,req,res,next) => {        // handles servers errors
    console.log('An error Ocurred!')        // logs the error into the console
    res.status(500).json({message: 'server error'}) // respnds with status code 500 and message 'server error'
})



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