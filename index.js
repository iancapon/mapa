const express=require("express")
const path = require('path');
const app=express()

app.use('/public', express.static(path.join(__dirname, 'public')))

app.use("/",(req,res)=>{
    res.redirect("./public/main.html")
})

app.listen(8000,_=>console.log("SERVER RUNNING: open http://localhost:8000/ on your browser =)"))
