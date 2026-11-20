import { Router } from "express";
import { query } from "../db.js";
import { requireAuth, signToken } from "../middleware/auth.js";
import { buildUserPayload, computeInitials } from "../utils/format.js";

const router = Router();

// Demo-friendly auth for competition judging:
// Maps any login/register input to the seeded Mahasiswa or Industri demo account
// without exposing password checks or allowing public user-table spam.
async function handleDemoSession(req, res, next) {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const rawRole = String(req.body?.role || "").trim().toLowerCase();
    const customName = String(req.body?.nama || "").trim().slice(0, 80);

    const role =
      rawRole === "industri" || rawRole === "mahasiswa"
        ? rawRole
        : /industri/i.test(email)
        ? "industri"
        : "mahasiswa";

    const { rows } = await query("select * from users where role = $1 order by id asc limit 1", [role]);
    const demoUser = rows[0];
    if (!demoUser) {
      return res.status(503).json({
        error: "Akun demo belum tersedia di database. Jalankan 'npm run db:setup' terlebih dahulu.",
      });
    }

    const effectiveRow = customName.length >= 2
      ? { ...demoUser, nama: customName, inisial: computeInitials(customName) }
      : demoUser;

    const token = signToken(demoUser, customName.length >= 2 ? { displayName: customName } : {});
    const user = await buildUserPayload(effectiveRow);
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
}

router.post("/demo", handleDemoSession);
router.post("/login", handleDemoSession);
router.post("/register", handleDemoSession);

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await buildUserPayload(req.user);
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

router.patch("/profile", requireAuth, async (req, res, next) => {
  try {
    const nama = String(req.body?.nama ?? req.user.nama).trim().slice(0, 100);
    const telp = String(req.body?.telp ?? req.user.telp ?? "").trim().slice(0, 30);
    const bio = String(req.body?.bio ?? req.user.bio ?? "").trim().slice(0, 600);
    const kampus =
      req.user.role === "mahasiswa"
        ? String(req.body?.kampus ?? req.user.kampus ?? "").trim().slice(0, 120)
        : req.user.kampus;
    const sektor =
      req.user.role === "industri"
        ? String(req.body?.sektor ?? req.user.sektor ?? "").trim().slice(0, 120)
        : req.user.sektor;

    if (nama.length < 2) {
      return res.status(400).json({ error: "Nama lengkap minimal 2 karakter." });
    }

    const inisial = computeInitials(nama);
    const { rows } = await query(
      `update users
       set nama = $1, inisial = $2, telp = $3, bio = $4, kampus = $5, sektor = $6, updated_at = now()
       where id = $7
       returning *`,
      [nama, inisial, telp, bio, kampus, sektor, req.user.id]
    );

    const user = await buildUserPayload(rows[0]);
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

export default router;
