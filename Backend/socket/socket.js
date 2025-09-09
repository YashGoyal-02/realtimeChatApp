// creating socket
import http from "http"
import express from "express"
import { Server } from "socket.io"; //creating server from socket io

let app = express();

const server = http.createServer(app) // ab hum app ke through routes bna lenge aur server par listen kar lenge.

const io = new Server(server,{ // creating server using socket.io
    cors : {
        origin : process.env.CLIENT_URL || "http://localhost:5173", // frontend URl
    }
})

const userSocketMap = {}

export const getReceiverSocketId = (receiver) => {
    return userSocketMap[receiver] // gives the value means receiversocket id used for messaging
}

io.on("connection",(socket)=>{

    const userId = socket.handshake.query.userId;

    if(userId != undefined){
        userSocketMap[userId] = socket.id
        // userid : socketid
    }

    io.emit("getOnlineUsers" , Object.keys(userSocketMap)) // online users are the users which was stored in userSocketMap
    
    socket.on("disconnect",()=>{ // to get the user which is online.
        delete userSocketMap[userId]
        io.emit("getOnlineUsers" , Object.keys(userSocketMap))
    })

    // When we have to send something from backend to frontend it must be in events.
    // io.emit("hello","hello yash") // (eventname , response);


}) // jaise hi koi frontend sai user ayega toh ye turant fire hoga aur btayega user ki connect hua h. aur use ek socketid de dega use hi ye socket use krega for realtime communication.

export {app,server,io} // ab isi app ko index.js mai import kro.
// we emits events by io
