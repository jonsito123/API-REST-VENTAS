import express from "express";
import citasRouter from "./router/citas.router.js"
const app=express();
import cors from "cors"

app.use(express.json())
app.use(cors())
app.use("/api/",citasRouter)

app.listen(5000)
console.log("Server running in the port 3000")