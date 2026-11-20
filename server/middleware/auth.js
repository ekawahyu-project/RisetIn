import jwt from "jsonwebtoken";
import { query } from "../db.js";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    throw new Error("JWT_SECRET belum diset di server/.env");
  }
  return secret;
}

export function signToken(user, extras = {}) {
  const claims = { sub: String(user.id), role: user.role };
  if (extras.displayName) claims.displayName = String(extras.displayName).slice(0, 80);
  return jwt.sign(claims, getJwtSecret(), { expiresIn: "7d" });
}

function extractToken(req) {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) return header.slice(7).trim();
  return null;
}

async function resolveUser(token) {
  const payload = jwt.verify(token, getJwtSecret());
  const { rows } = await query("select * from users where id = $1", [payload.sub]);
  const user = rows[0];
  if (!user) return null;
  if (payload.displayName) {
    return { ...user, nama: String(payload.displayName).slice(0, 80) };
  }
  return user;
}

export async function requireAuth(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ error: "Silakan masuk terlebih dahulu." });
    }
    const user = await resolveUser(token);
    if (!user) {
      return res.status(401).json({ error: "Sesi tidak valid. Silakan masuk ulang." });
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Sesi berakhir. Silakan masuk ulang." });
    }
    next(err);
  }
}

export async function optionalAuth(req, _res, next) {
  try {
    const token = extractToken(req);
    if (token) {
      req.user = await resolveUser(token);
    }
  } catch {
    req.user = null;
  }
  next();
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({
        error: `Fitur ini hanya untuk akun ${role === "industri" ? "Industri" : "Mahasiswa"}.`,
      });
    }
    next();
  };
}
