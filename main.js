// import classes
import express from 'express'
import Student from './Classes/student.js'

const app = express();
app.use(express.json());
// app.use('/',router)



app.listen(8080);