//1. We ask the project to use the "Express" library we just download
const express = require('express');

//2. We create an 'app' (this is our server)
const app = express();

//Day 2: Our "Database" (for now, just and array)
const LabInventory = [
    {id:1, name: "Hydrochloric Acid", stock: "2 Liters", safety: "Corrosive"},
    {id:2, name: "Sodium Hydroxide", stock: "500 Grams", safety: "Base"},
    {id:3, name: "Distilled Water", stock: "20 Liters", safety: "Safe"},
    {id:4, name: "Acetone", stock: "10 Liters", safety: "Flammable"}
];

//Route 1: The Home Page
app.get('/', (req,res) =>{
    res.send("Welcome to the Lab Inventory")
});

//Route 2: The Inventory Page (This sends JSON data)
app.get('/inventory',(req,res)=>{
    res.json(LabInventory);
});

app.listen(5000, ()=>{
    console.log("Server is running on http://localhost:5000");
});