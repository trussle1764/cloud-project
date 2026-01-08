// Basic Express server for my project
// This file handles REST APIs and serves the frontend dashboard

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();

// Allow requests from anywhere (needed for frontend + curl)
app.use(cors());

// Serve static files (index.html, JS, CSS) from /public
app.use(express.static(path.join(__dirname, "public")));

// Connect to SQLite database
// Using absolute path so it works locally AND on Render
const db = new sqlite3.Database(path.join(__dirname, "data.db"), (err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});


// ======================
// REST API #1 – Monthly Sales (Bar Chart)
// ======================
app.get("/api/monthly-sales", (req, res) => {
  const sql = "SELECT month, sales FROM monthly_sales";

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});


// ======================
// REST API #2 – Traffic Sources (Pie Chart)
// ======================
app.get("/api/traffic-sources", (req, res) => {
  const sql = "SELECT source, percentage FROM traffic_sources";

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});


// ======================
// Root route (important for cloud hosting)
// ======================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


// ======================
// Server start (Render requires process.env.PORT)
// ======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
