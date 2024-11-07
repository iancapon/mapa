const express=require("express")
const path = require('path');
const app=express()

app.use('/public', express.static(path.join(__dirname, 'public')))

app.use("/",(req,res)=>{
    res.redirect("./public/main.html")
})

app.listen(8000,_=>console.log("ESCUCHANDO PUERTO 8000"))