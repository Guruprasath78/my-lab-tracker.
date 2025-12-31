// //1. We ask the project to use the "Express" library we just download
// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');

// //2. We create an 'app' (this is our server)
// const app = express();

// mongoose.connect(process.env.MONGO_URL)
//     .then(() => console.log("Connected to Lab Database in the Cloud!"))
//     .catch(err => console.log("Connection Error:", err));
   
// const chemicalSchema = new mongoose.Schema({
//     name: String,
//     stock: String,
//     safety: String
// });

// const Chemical = mongoose.model('Chemical', chemicalSchema);

// //Day 2: Our "Database" (for now, just and array)
// const LabInventory = [
//     {id:1, name: "Hydrochloric Acid", stock: "2 Liters", safety: "Corrosive"},
//     {id:2, name: "Sodium Hydroxide", stock: "500 Grams", safety: "Base"},
//     {id:3, name: "Distilled Water", stock: "20 Liters", safety: "Safe"},
//     {id:4, name: "Acetone", stock: "10 Liters", safety: "Flammable"}
// ];

// //Route 1: The Home Page
// app.get('/', (req,res) =>{
//     res.send("Welcome to the Lab Inventory")
// });

// //Route 2: The Inventory Page (This sends JSON data)
// app.get('/inventory',(req,res)=>{
//     res.json(LabInventory);
// });

// app.listen(5000, ()=>{
//     console.log("Server is running on http://localhost:5000");
// });

// //Connect to MongoDB

// console.log("Checking my URL:", process.env.MONGO_URL);

// require('dotenv').config();
require('dotenv').config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// 1. Connect to MongoDB (Move this up!)
// This ensures we connect BEFORE the server starts listening
console.log("Checking my URL:", process.env.MONGO_URL); 

mongoose.connect('mongodb+srv://lab_admin:Apple12345@cluster0.mongodb.net/LabData')
    .then(() => console.log("🧪 Connected to Lab Database in the Cloud!"))
    .catch(err => console.log("❌ Connection Error:", err));

// 2. Define the Schema
const chemicalSchema = new mongoose.Schema({
    name: String,
    stock: String,
    safety: String
});

const Chemical = mongoose.model('Chemical', chemicalSchema);

// 3. Routes
const LabInventory = [
    {id:1, name: "Hydrochloric Acid", stock: "2 Liters", safety: "Corrosive"},
    {id:2, name: "Sodium Hydroxide", stock: "500 Grams", safety: "Base"},
    {id:3, name: "Distilled Water", stock: "20 Liters", safety: "Safe"},
    {id:4, name: "Acetone", stock: "10 Liters", safety: "Flammable"}
];

app.get('/', (req,res) =>{
    res.send("Welcome to the Lab Inventory")
});

app.get('/inventory',(req,res)=>{
    res.json(LabInventory);
});

// 4. Start Server (This MUST be at the very bottom)
app.listen(5000, ()=>{
    console.log("Server is running on http://localhost:5000");
});