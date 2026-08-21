import express from "express";
import { store } from "../services/priorityQueueService.js";
import { calculateUrgency, determineCropStage, DEFAULT_WEIGHTS } from "../services/agronomyEngine.js";
import { getAvailableCrops } from "../utils/cropData.js";
import { resolveTieBetweenFarmers } from "../services/tieBreakerService.js";

const router = express.Router();

// --- CROPS & AGRONOMY ---
router.get("/crops", (req, res) => {
  res.json({ success: true, crops: getAvailableCrops() });
});

router.post("/agronomy/calculate", (req, res) => {
  try {
    const result = calculateUrgency(req.body, req.body.weights || DEFAULT_WEIGHTS);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- WATER GROUPS ---
router.get("/water-groups", (req, res) => {
  const groups = store.getWaterGroups();
  res.json({ success: true, waterGroups: groups });
});

router.get("/water-groups/:id", (req, res) => {
  const group = store.getWaterGroupById(req.params.id);
  if (!group) return res.status(404).json({ success: false, error: "Water group not found" });
  res.json({ success: true, waterGroup: group });
});

// --- FARMERS ---
router.get("/farmers", (req, res) => {
  const { waterGroupId } = req.query;
  const farmers = store.getFarmers(waterGroupId);
  res.json({ success: true, count: farmers.length, farmers });
});

router.get("/farmers/:id", (req, res) => {
  const farmer = store.getFarmerById(req.params.id);
  if (!farmer) return res.status(404).json({ success: false, error: "Farmer not found" });
  res.json({ success: true, farmer });
});

router.post("/farmers", (req, res) => {
  try {
    const { name, phone, landholdingSize, waterGroupId, crop, sowingDate, daysSinceLastWater, evidenceVerified } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: "Farmer name is required" });
    }
    const newFarmer = store.addFarmer({
      name,
      phone: phone || "+91 98000 00000",
      landholdingSize: landholdingSize || 1.0,
      waterGroupId: waterGroupId || "wg-01",
      crop,
      sowingDate,
      daysSinceLastWater,
      evidenceVerified
    });
    res.status(201).json({ success: true, farmer: newFarmer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- PLOTS ---
router.get("/plots", (req, res) => {
  const { waterGroupId } = req.query;
  const plots = store.getPlots(waterGroupId);
  res.json({ success: true, count: plots.length, plots });
});

router.get("/plots/:id", (req, res) => {
  const plot = store.getPlotById(req.params.id);
  if (!plot) return res.status(404).json({ success: false, error: "Plot not found" });
  res.json({ success: true, plot });
});

router.post("/plots", (req, res) => {
  try {
    const newPlot = store.addPlot(req.body);
    res.status(201).json({ success: true, plot: newPlot });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put("/plots/:id", (req, res) => {
  try {
    const updated = store.updatePlot(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: "Plot not found" });
    res.json({ success: true, plot: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- AUTHORITATIVE QUEUE ---
router.get("/queue/:waterGroupId", (req, res) => {
  try {
    const data = store.getAuthoritativeQueue(req.params.waterGroupId);
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/queue/recalculate", (req, res) => {
  try {
    const { waterGroupId, customWeights } = req.body;
    const data = store.getAuthoritativeQueue(waterGroupId || "wg-01", customWeights);
    store.addLog(waterGroupId || "wg-01", "MANUAL_RECALCULATE", "Priority queue recalculated manually with updated weights.");
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/queue/:waterGroupId/next", (req, res) => {
  try {
    const data = store.getAuthoritativeQueue(req.params.waterGroupId);
    const nextFarmer = data.queue[0] || null;
    res.json({ success: true, nextFarmer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- TURNS ---
router.post("/turns/start", (req, res) => {
  try {
    const { waterGroupId, plotId } = req.body;
    const turn = store.startTurn(waterGroupId || "wg-01", plotId);
    res.json({ success: true, turn });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post("/turns/complete", (req, res) => {
  try {
    const { waterGroupId, turnId } = req.body;
    const turn = store.completeTurn(waterGroupId || "wg-01", turnId);
    res.json({ success: true, turn });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post("/turns/skip", (req, res) => {
  try {
    const { waterGroupId, turnId, reason } = req.body;
    const turn = store.skipTurn(waterGroupId || "wg-01", turnId, reason);
    res.json({ success: true, turn });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.get("/turns/history/:waterGroupId", (req, res) => {
  try {
    const turns = store.waterTurns.filter(t => !req.params.waterGroupId || t.waterGroupId === req.params.waterGroupId);
    res.json({ success: true, turns });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- DISPUTES ---
router.get("/disputes/:waterGroupId", (req, res) => {
  try {
    const disputes = store.getDisputes(req.params.waterGroupId);
    res.json({ success: true, disputes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/disputes", (req, res) => {
  try {
    const dispute = store.createDispute(req.body);
    res.status(201).json({ success: true, dispute });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.put("/disputes/:id", (req, res) => {
  try {
    const { resolutionNote, status } = req.body;
    const resolved = store.resolveDispute(req.params.id, resolutionNote, status);
    res.json({ success: true, dispute: resolved });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- AUDIT LOGS ---
router.get("/logs/:waterGroupId", (req, res) => {
  try {
    const logs = store.logs.filter(l => !req.params.waterGroupId || l.waterGroupId === req.params.waterGroupId);
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- TIE DEMO (PHASE 7) ---
router.get("/tie-demo", (req, res) => {
  try {
    const demo = store.generateTieDemoScenario();
    res.json({ success: true, ...demo });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/tie-demo/custom", (req, res) => {
  try {
    const { farmerA, farmerB, context } = req.body;
    const resolution = resolveTieBetweenFarmers(farmerA, farmerB, context || {});
    res.json({ success: true, farmerA, farmerB, resolution });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
