import express from 'express'
import mongoose from 'mongoose';
import cors from "cors";

import { json } from 'express';
const Mongo_URL="mongodb+srv://Ritesh:123@cluster1.lgo3ddb.mongodb.net/OnlineLecturedb";
import Registerroutes from './Routes/Registerroutes.js'
import CourseRoutes from './Routes/CourseRoutes.js'
const app = express();
app.use(json());
app.use(cors());

app.use(Registerroutes)
app.use(CourseRoutes)
const PORT = 8080;
mongoose.connect(Mongo_URL)
.then(()=>{
    console.log("connnected");
    app.listen(PORT, () => {
        console.log(`server is running ${PORT}`);
    });
    
})
.catch(()=>{
    console.log("error");
})
