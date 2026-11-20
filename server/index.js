import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { query } from "./db.js";
import authRouter from "./routes/auth.js";
import risetRouter from "./routes/riset.js";
import { kolaborasiRouter, notificationsRouter } from "./routes/kolaborasi.js";
import matchmakingRouter from "./routes/matchmaking.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, "uploads");

export const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

// Basic HTTP security headers
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

// ponytail: in-memory fixed-window limiter fits single-instance Express; swap to Redis store when scaling horizontally.
function createRateLimiter({ windowMs, max, message }) {
  const hits = new Map();
  return (req, res, next) => {
    const key = req.ip || req.socket?.remoteAddress || "unknown";
    const now = Date.now();
    const entry = hits.get(key);
    if (!entry || now > entry.resetAt) {
      if (hits.size > 5000) hits.clear();
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    entry.count += 1;
    if (entry.count > max) {
      return res.status(429).json({ error: message });
    }
    next();
  };
}

const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Terlalu banyak percobaan login/daftar. Coba lagi dalam beberapa menit.",
});
const matchmakingLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: "Terlalu banyak permintaan Matchmaking AI. Tunggu beberapa menit sebelum mencoba lagi.",
});

// Minimal CORS support (in dev Vite proxies /api; in prod set CORS_ORIGIN)
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (allowedOrigins.includes("*") || allowedOrigins.includes(origin))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: "1mb" }));
// Sandbox static uploads so uploaded files can never execute scripts in browser
app.use(
  "/uploads",
  (_req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'none'; sandbox");
    res.setHeader("X-Content-Type-Options", "nosniff");
    next();
  },
  express.static(uploadsDir, { dotfiles: "deny" })
);

app.get("/api/health", async (_req, res) => {
  let dbOk = false;
  try {
    await query("select 1");
    dbOk = true;
  } catch (err) {
    console.error("[health db error]", err.message);
  }
  res.json({
    ok: dbOk,
    db: dbOk,
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY?.trim()),
  });
});

app.use("/api/auth", authLimiter, authRouter);
app.use("/api/riset", risetRouter);
app.use("/api/collaborations", kolaborasiRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/matchmaking", matchmakingLimiter, matchmakingRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan." });
});

app.use((err, _req, res, _next) => {
  if (err?.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "Ukuran file terlalu besar (maksimal 20MB)." });
  }
  const status = Number(err?.status) || 500;
  if (status >= 500) {
    console.error("[server error]", err);
  }
  // Never leak raw internal DB/runtime error details on 500
  const safeMessage =
    status === 503
      ? err.message || "Layanan sementara belum tersedia."
      : status >= 500
      ? "Terjadi kesalahan internal pada server."
      : err.message;
  res.status(status).json({ error: safeMessage });
});

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const port = Number(process.env.PORT) || 3001;
  app.listen(port, () => {
    console.log(`RisetIn API berjalan di http://localhost:${port}`);
  });
}
