const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
    res.send("TransitOps Backend Running");
});

// Authentication Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
module.exports = app;