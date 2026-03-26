require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const ffRouter = require("./routes/ff");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Rate limiter — max 30 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests. Please wait a moment and try again.",
  },
});
app.use(limiter);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/ff", ffRouter);

// Root info
app.get("/", (req, res) => {
  res.json({
    name: "Free Fire UID Checker API",
    version: "1.0.0",
    endpoints: {
      check: "GET /api/ff/check?uid=YOUR_UID",
      checkPost: "POST /api/ff/check  { uid: 'YOUR_UID' }",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found." });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("[ERROR]", err.message);
  res.status(500).json({ success: false, error: "Internal server error." });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  FF UID Checker API running on http://localhost:${PORT}`);
});
