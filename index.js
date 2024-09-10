import { db } from "./database/db.js"
import express from "express"
import Dotenv  from "dotenv";
import 'dotenv/config'
import { router } from "./routes/user.model.routes.js";
const app=express()
app.use(express.json())

app.use('/',router)

db()
.then(()=>{
    app.listen(process.env.PORT||4000,()=>{
        console.log(`your server is running on this port:${process.env.PORT}`)
    })

})
.catch((err)=>{
console.log('db connect but server not working',err)
})