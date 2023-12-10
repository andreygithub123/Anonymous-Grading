// import classes
import express from 'express'
import Student from './Classes/student.js'
import homeRouter from './Routers/home.js'
import aboutRouter from './Routers/about.js';


// create an Express Server
const app = express();
// use express.json for parsing into/from json format
app.use(express.json());

// Routers that will be used in the server
app.use('/',homeRouter)
app.use('/',aboutRouter)






// Server port
app.listen(8080);