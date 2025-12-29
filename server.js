const express = require('express');
const app = express();

app.get('/',(req,res)=>{
    res.send("Day 1: My Chemistry Lab Server is working");
});

app.listen(5000, () =>{
    console.log("Server is running on http://localhost:5000");
});