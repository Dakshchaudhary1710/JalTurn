import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/api.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
app.use(express.json());

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "HEALTHY",
    service: "JalTurn Irrigation Scheduling Engine",
    version: "1.0.0",
    agronomicStandard: "FAO-56 Evapotranspiration Guidelines",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api", apiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("JalTurn Server Error:", err.stack);
  res.status(500).json({
    success: false,
    error: err.message || "Internal Agronomic Engine Error"
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🌾 JalTurn Agronomic Backend running on http://localhost:${PORT}`);
  console.log(`💧 Crop-Urgency-Based Shared Irrigation Scheduler Active`);
  console.log(`=======================================================`);
});

export default app;
