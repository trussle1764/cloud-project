const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// SQLite DB (Render-safe path)
const db = new sqlite3.Database(path.join(__dirname, "data.db"));

// API 1: Monthly Sales
app.get("/api/monthly-sales", (req, res) => {
  db.all("SELECT month, sales FROM monthly_sales", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// API 2: Traffic Sources
app.get("/api/traffic-sources", (req, res) => {
  db.all("SELECT source, percentage FROM traffic_sources", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Root route (IMPORTANT)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔥 Render PORT fix
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
