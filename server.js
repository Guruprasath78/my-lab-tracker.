require('dotenv').config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.static('public')); //Tells Express to show index.html
app.use(express.urlencoded({extended:true})); //Helps read form data

// 1. Connect to MongoDB (Move this up!)
// This ensures we connect BEFORE the server starts listening
console.log("Checking my URL:", process.env.MONGO_URL); 

mongoose.connect(process.env.MONGO_URL)    
    .then(() => console.log("🧪 Connected to Lab Database in the Cloud!"))
    .catch(err => console.log("❌ Connection Error:", err));

// 2. Define the Schema
const chemicalSchema = new mongoose.Schema({
    name: String,
    stock: String,
    safety: String,
    storageLocation: String
});

const Chemical = mongoose.model('Chemical', chemicalSchema);

//Route to save a test chemical to the cloud
app.post('/add-chemical', async (req, res) =>{
    try{
        const newChemical = new Chemical({
            name: req.body.name,
            stock: req.body.stock,
            safety:req.body.safety,
            storageLocation: req.body.storageLocation
        });
        await newChemical.save();
        res.redirect('/') // Goes back to the form ofter saving
           
    } catch (err){
        res.status(500).send("Error:"+ err.message);
    }
});

//New Live Inventory Route
app.get('/inventory', async (req, res) => {
    try {
        let query = {};

        //If the user typed something in the search box
        if (req.query.search) {
            // This looks for names that "contain" the search text (case-insensitive)
            query.name = {$regex: req.query.search, $options: 'i' };
        }

        const allChemicals = await Chemical.find(query);
        
        // Start building the HTML string
        let html = `
            <html>
            <head>
                <title>Lab Inventory Report</title>
            <style>
                :root {
                    --primary: #00d2ff;
                    --bg: #0f172a;
                    --card: #1e293b;
                    --text: #f8fafc;
                }
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    padding: 40px; 
                    background: var(--bg); 
                    color: var(--text);
                }
                h1 { font-weight: 300; letter-spacing: 2px; color: var(--primary); }

                    .search-container { 
                    background: var(--card); 
                    padding: 20px; 
                    border-radius: 12px; 
                    margin-bottom: 30px;
                    border: 1px solid #334155;
                }

                table { 
                    width: 100%; 
                    border-collapse: separate; 
                    border-spacing: 0 10px; /* Gives rows a "floating" look */
                }
                th { 
                    padding: 15px; 
                    text-transform: uppercase; 
                    font-size: 0.8rem; 
                    letter-spacing: 1px;
                    color: #94a3b8;
                }
                tr { background: var(--card); transition: transform 0.2s; }
                tr:hover { transform: scale(1.01); background: #2d3748; }

                td { padding: 20px; border: none; }
                td:first-child { border-radius: 10px 0 0 10px; border-left: 4px solid var(--primary); }
                td:last-child { border-radius: 0 10px 10px 0; }

                input[type="text"] {
                    background: #0f172a;
                    border: 1px solid #334155;
                    color: white;
                    padding: 10px;
                    border-radius: 6px;
                }
                 .back-btn { 
                    text-decoration: none; 
                    color: var(--primary); 
                    border: 1px solid var(--primary);
                    padding: 8px 16px;
                    border-radius: 6px;
                    transition: 0.3s;
                }
                .back-btn:hover { background: var(--primary); color: white; }

                button { cursor: pointer; border-radius: 6px; font-weight: bold; }
            </style>
            </head>
            <body>
                                   
                <a href="/" class="back-btn">← Back to Form</a>
                <h1>🧪 Current Lab Inventory</h1>
                <div style="margin-bottom:20px">
                        <form action="/inventory" method="GET">
                        <div id="inventory-summary" style="display: flex; gap: 20px; margin-bottom: 20px;">
                        <div style="background: var(--card); padding: 15px; border-radius: 8px; border: 1px solid #334155; flex: 1;">
                        <span style="color: #94a3b8; font-size: 0.8rem; text-transform: uppercase;">Total Chemicals</span>
                        <div id="total-count" style="font-size: 1.5rem; color: var(--primary); font-weight: bold;">0</div>
                    </div>
                        <div style="background: var(--card); padding: 15px; border-radius: 8px; border: 1px solid #334155; flex: 1;">
                        <span style="color: #94a3b8; font-size: 0.8rem; text-transform: uppercase;">Low Stock Alerts</span>
                        <div id="alert-count" style="font-size: 1.5rem; color: #ef4444; font-weight: bold;">0</div>
                    </div>
                    </div>    

                            <input type="text" name="search" placeholder="Search by name..."
                            style="padding: 10px; width: 300px; border-raddius:4px; border:1px solid #ddd;" >
                            <button type="submit" style="padding: 10px 15px; background: #007bff; color: white; border:none; border-radius: 4px; cursor: pointer;">Search</button>
                            <a href="/inventory" style="margin-left: 10px; color: #666; text-decoration:none;">Clear</a>
                            
                        </form>
                        <form action="/delete-all" method="POST" onsubmit="return confirm('Are you sure?');">
                            <button style="background:red; color:white;">Delete All Inventory</button>

                        </form>
                    </div>
                <table>
                    <thead>
                        <tr>
                            <th>Chemical Name</th>
                            <th>Stock Level</th>
                            <th>Safety Info</th>
                            <th>Storage Location</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        // Loop through each chemical and add a row to the table
       allChemicals.forEach(item => {
        const stockNum = parseInt(item.stock) || 0;
        const stockColor = stockNum <= 5 ? '#ff4d4d' : '#f8fafc';

        html += `
            <tr class="chemical-row">
                <form action="/update-chemical/${item._id}" method="POST">
                    <td>
                        <input type="text" name="name" value="${item.name}" 
                            style="background:#0f172a; border:1px solid #334155; color:white; padding:5px; border-radius:4px; width:100%;">
                    </td>
                    <td>
                        <input type="text" name="stock" value="${item.stock}" 
                            style="background:#0f172a; border:1px solid #334155; color:${stockColor}; padding:5px; border-radius:4px; width:80px; font-weight:bold;">
                    </td>
                    <td><span style="opacity: 0.7; font-size: 0.9rem;">${item.safety}</span></td>
                    <td>
                        <input type="text" name="storageLocation" value="${item.storageLocation || ''}" placeholder="Enter Location"
                            style="background:#0f172a; border:1px solid #334155; color:white; padding:5px; border-radius:4px; width:100%;">
                    </td>
                    <td style="text-align: right; white-space: nowrap;">
                        <button type="submit" style="background:#00d2ff; color:white; border:none; padding:8px 12px; border-radius:6px; cursor:pointer;">Save</button>
                        
                        <button type="submit" formaction="/delete-chemical/${item._id}" 
                            style="background:#ef4444; color:white; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; margin-left:5px;">Delete</button>
                    </td>
                </form>
            </tr>
        `;
    });
        html += `
                    </tbody>
                </table>                
                <script>
                const searchInput = document.querySelector('input[name="search"]');
                const rows = document.querySelectorAll('.chemical-row');
                const totalDisplay = document.getElementById('total-count');
                const alertDisplay = document.getElementById('alert-count');

                function updateStats() {
                    let visibleCount = 0;
                    let lowStockCount = 0;

                    rows.forEach(row => {
                        if (row.style.display !== "none") {
                            visibleCount++;
                            // Check if the stock input has a red color (your low stock logic)
                            const stockInput = row.querySelector('input[name="stock"]');
                            if (parseInt(stockInput.value) <= 5) {
                                lowStockCount++;
                            }
                        }
                    });

                    totalDisplay.textContent = visibleCount;
                    alertDisplay.textContent = lowStockCount;
                }

                searchInput.addEventListener('input', (e) => {
                    const term = e.target.value.toLowerCase();
                    rows.forEach(row => {
                        const text = row.textContent.toLowerCase();
                        row.style.display = text.includes(term) ? "" : "none";
                    });
                    updateStats(); // Recalculate numbers after filtering
                });

                // Run once on page load to show initial numbers
                updateStats();
            </script>
            </body>
            </html>
        `;
        
        res.send(html);
    } catch (err) {
        res.status(500).send("Error generating report: " + err.message);
    }
});

// New Master Update Route
app.post('/update-chemical/:id', async (req, res) => {
    try {
        await Chemical.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            stock: req.body.stock,
            storageLocation: req.body.storageLocation // Use Capital L here to match Schema
        });
        console.log("Item Updated Successfully");
        res.redirect('/inventory');
    } catch (err) {
        res.status(500).send("Update failed: " + err.message);
    }
});

//The :id is a "parameter" - it acts as a placeholder for the real ID
app.post('/delete-chemical/:id', async (req, res) =>{
    try{
        const result = await Chemical.findByIdAndDelete(req.params.id);
        console.log("Item Deleted:", result);
        res.redirect('/inventory'); //Refresh the page to show it's gone
    } catch (err){
        res.status(500).send("Error deleting item:"+ err.message);

    }
});

//We define the route name(/delete-all)
app.post("/delete-all", async (req,res) => {
    console.log("DELETE ALL request recevied by the server");
    try {
        //2. We given the command to the Database
        // In English:  "Chemical model, delete many items that match {nothing/everything}"
        const result = await Chemical.deleteMany({});//The command to clear the DB
        console.log("Database report:,", result);
        //3. We ell the browser where to go next
        res.redirect('/inventory'); //The command to refresh the page
    } catch (err) {
        console.log("Error occurred:", err.message);
        //4. If  something breaks, tell us why
        res.status(500).send("Error:" + err.message);
    }

});
// 4. Start Server (This MUST be at the very bottom)
app.listen(5000, ()=>{
    console.log("Server is running on http://localhost:5000");
});
