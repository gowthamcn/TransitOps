const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const vehicleRoutes = require("./routes/vehicleRoutes");
const driverRoutes = require("./routes/driverRoutes");
const tripRoutes = require("./routes/tripRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
  res.send("TransitOps Backend Running");
});

// Auth & Dashboard
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Vehicle & Driver
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/drivers", driverRoutes);

// Trip & Maintenance
app.use("/api/trips", tripRoutes);
app.use("/api/maintenance", maintenanceRoutes);

module.exports = app;