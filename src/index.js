import express from "express";
import citasRouter from "./router/citas.router.js"
import {Server} from "socket.io"
import {createServer} from "node:http"
import cors from "cors"
const app=express();
const server=createServer(app)
const io=new Server(server)
io.on("connection",(socket)=>{
    console.log("a user has connection")

    socket.on("disconnect",()=>{
        console.log("User disconnect")
    })
})

app.use(express.json())
app.use(cors())
app.use("/api/",citasRouter)


/*SOCKETS**/
server.listen(5000,()=>{

    console.log("Cargando en el servidor  5000")
})
