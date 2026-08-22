require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const waterGroupRoutes = require("./routes/waterGroupRoutes");
const farmerRoutes = require("./routes/farmerRoutes");
const queueRoutes = require("./routes/queueRoutes");
const turnRoutes = require("./routes/turnRoutes");
const disputeRoutes = require("./routes/disputeRoutes");
const auditRoutes = require("./routes/auditRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.json({
    name: "JalTurn API",
    status: "Running",
    version: "1.0.0",
    endpoints: {
      waterGroups: "/api/water-groups",
      farmers: "/api/farmers",
      queue: "/api/queue/:waterGroupId",
      audit: "/api/audit"
    }
  });
});

app.use("/api/water-groups", waterGroupRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/turns", turnRoutes);
app.use("/api/disputes", disputeRoutes);
app.use("/api", auditRoutes);

app.listen(PORT, () => {
  console.log(`JalTurn backend running on http://localhost:${PORT}`);
});