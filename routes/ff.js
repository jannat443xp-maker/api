const express = require("express");
const router = express.Router();
const { checkUID } = require("../services/ffService");

// ── GET /api/ff/check?uid=534049908 ─────────────────────────────────────────
router.get("/check", async (req, res) => {
  const uid = req.query.uid;
  const region = req.query.region || "sg"; // Default to Singapore

  if (!uid || !/^\d+$/.test(uid)) {
    return res.status(400).json({
      success: false,
      error: "Invalid or missing UID. Must be numeric.",
    });
  }

  const result = await checkUID(uid, region);
  if (!result.success) {
    return res.status(result.status || 500).json(result);
  }
  return res.json(result);
});

// ── POST /api/ff/check  { "uid": "534049908" } ──────────────────────────────
router.post("/check", async (req, res) => {
  const uid = req.body?.uid;
  if (!uid || !/^\d+$/.test(String(uid))) {
    return res.status(400).json({
      success: false,
      error: "Invalid or missing UID. Must be numeric.",
    });
  }

  const result = await checkUID(String(uid));
  if (!result.success) {
    return res.status(result.status || 500).json(result);
  }
  return res.json(result);
});

module.exports = router;
