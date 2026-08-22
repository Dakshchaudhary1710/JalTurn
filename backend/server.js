require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const seedDatabase = require("./config/seeder");

const waterGroupRoutes   = require("./routes/waterGroupRoutes");
const farmerRoutes       = require("./routes/farmerRoutes");
const queueRoutes        = require("./routes/queueRoutes");
const turnRoutes         = require("./routes/turnRoutes");
const disputeRoutes      = require("./routes/disputeRoutes");
const auditRoutes        = require("./routes/auditRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL, // e.g. https://jal-turn.vercel.app
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true
}));
app.use(express.json());

// Connect to DB and seed initial data if empty
connectDB().then(() => {
  seedDatabase();
});

app.get("/", (req, res) => {
  res.json({
    name: "JalTurn API",
    status: "Running",
    version: "2.0.0",
    endpoints: {
      waterGroups:   "/api/water-groups",
      farmers:       "/api/farmers",
      queue:         "/api/queue/:waterGroupId",
      turns:         "/api/turns",
      disputes:      "/api/disputes",
      audit:         "/api/audit/:waterGroupId",
      notifications: "/api/notifications/:waterGroupId"
    }
  });
});

app.use("/api/water-groups",  waterGroupRoutes);
app.use("/api/farmers",       farmerRoutes);
app.use("/api/queue",         queueRoutes);
app.use("/api/turns",         turnRoutes);
app.use("/api/disputes",      disputeRoutes);
app.use("/api",               auditRoutes);
app.use("/api/notifications", notificationRoutes);

app.listen(PORT, () => {
  console.log(`JalTurn backend v2.0 running on http://localhost:${PORT}`);
});