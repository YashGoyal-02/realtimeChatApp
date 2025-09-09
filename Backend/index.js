import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import connectdb from './config/db.js';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from "cors"
import userRouter from './routes/user.routes.js';
import messageRouter from './routes/message.routes.js';
import { app, server } from './socket/socket.js'; // use socket app
dotenv.config();

const port = process.env.PORT || 5000

app.use(cors({ // here we need two things one is origin (frontend url) , credentials
    origin : "http://localhost:5173",
    credentials : true
}));
app.use(express.json()); // setting up a middleware to the req. from the body
app.use(cookieParser());

app.use("/api/auth" , authRouter);
app.use("/api/user" , userRouter);
app.use("/api/message" , messageRouter);


server.listen(port,()=>{ // listen server through http server.
    connectdb();
    console.log("server started");
})

