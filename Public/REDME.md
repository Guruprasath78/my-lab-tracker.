# 🧪 Lab Inventory Management System

A full-stack CRUD (Create, Read, Update, Delete) application designed for laboratory environments to track chemical stocks, safety protocols, and storage locations.

## 🚀 Features
* **Real-time Inventory Tracking:** Add, view, update, and delete chemical records.
* **Hybrid Search System:** * **Server-side:** MongoDB Regex search for robust data retrieval.
    * **Client-side:** Instant JavaScript filtering for a seamless User Experience (UX).
* **Dynamic UI:** Responsive dark-mode interface with conditional styling (e.g., stock levels highlight in red when low).
* **Cloud Integration:** Connected to MongoDB Atlas for persistent data storage.

## 🛠️ Tech Stack
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (via Mongoose ODM)
* **Frontend:** HTML5, CSS3 (Modern Flexbox/Grid), Vanilla JavaScript
* **Security:** Environment variables handled via `dotenv`

## 📦 Installation & Setup
1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Guruprasath78/lab-inventory.git](https://github.com/Guruprasath78/lab-inventory.git)
Install Dependencies
Bash
npm install   
Configure Environment: Create a .env file in the root directory and add your MongoDB connection string:
Code snippet

MONGO_URL=your_mongodb_atlas_uri_here

Run the application:

Bash

node app.js
Access the app: Open http://localhost:5000 in your browser.
Key Learnings
Implemented Asynchronous programming (Async/Await) for database operations.

Managed State by passing data from a NoSQL database to dynamically generated HTML templates.

Optimized performance by reducing server requests through client-side DOM manipulation.
---

### 🎨 Why this works for your Portfolio


1.  **The "Tech Stack" Section:** It uses keywords like "Mongoose ODM" and "Vanilla JavaScript." These are terms recruiters scan for.
2.  **The "Installation" Section:** It shows you understand how to document a project so that *other* developers can use it.
3.  **The "Key Learnings" Section:** This is the most important part. It tells them *how* you think as an engineer, not just that you can copy code.

---

### 💼 Career Connection: Saved Information
As requested on **2026-01-05**, I have logged your "Professional Phrases." Here is a fresh one to add to your list for when you start that IT job search:

> **The Phrase:** "I authored comprehensive technical documentation (README) for my projects, ensuring that deployment steps and architectural decisions were clear for cross-functional team members."

**Would you like me to help you set up a "Low Stock Alert" feature next, so your app can automatically warn users when a chemical is running out?**