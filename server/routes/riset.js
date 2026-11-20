import { Router } from "express";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import multer from "multer";
import { query } from "../db.js";
import { optionalAuth, requireAuth, requireRole } from "../middleware/auth.js";
import { createNotification, formatRelativeTime, formatRisetRow } from "../utils/format.js";

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, "../uploads");

const ALLOWED_KATEGORI = new Set(["pertanian", "teknologi", "manufaktur", "kesehatan", "lingkungan", "energi"]);
const ALLOWED_STATUS = new Set(["diterbitkan", "diadopsi", "draf", "arsip"]);
const ALLOWED_COVER_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const ALLOWED_COVER_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_DOC_EXT = new Set([".pdf", ".png", ".jpg", ".jpeg", ".webp", ".docx", ".xlsx"]);
const ALLOWED_DOC_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

function sanitizeDisplayName(name) {
  return path.basename(String(name || "dokumen")).replace(/[^\w.\- ()]/g, "_").slice(0, 120) || "dokumen";
}

const isServerless = Boolean(process.env.VERCEL);

// ponytail: local dev saves to server/uploads; Vercel serverless uses memoryStorage and stores small covers inline as data URLs.
const storage = isServerless
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, uploadsDir),
      filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname || "").toLowerCase();
        const safeExt = ext.replace(/[^a-z0-9.]/g, "");
        cb(null, `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${safeExt}`);
      },
    });

const upload = multer({
  storage,
  limits: { fileSize: isServerless ? 4 * 1024 * 1024 : 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const mime = String(file.mimetype || "").toLowerCase();
    if (file.fieldname === "cover" && (!ALLOWED_COVER_EXT.has(ext) || !ALLOWED_COVER_MIME.has(mime))) {
      return cb(Object.assign(new Error("Format cover harus JPG, PNG, atau WebP."), { status: 400 }));
    }
    if (file.fieldname === "dokumen" && (!ALLOWED_DOC_EXT.has(ext) || !ALLOWED_DOC_MIME.has(mime))) {
      return cb(Object.assign(new Error("Format dokumen harus PDF, gambar, DOCX, atau XLSX."), { status: 400 }));
    }
    cb(null, true);
  },
});

const RISET_SELECT = `
  select
    r.*,
    coalesce(lc.cnt, 0)::int as like_count,
    coalesce(cc.cnt, 0)::int as comment_count,
    case when ul.user_id is not null then true else false end as liked
  from riset r
  left join (
    select riset_id, count(*)::int as cnt from riset_likes group by riset_id
  ) lc on lc.riset_id = r.id
  left join (
    select riset_id, count(*)::int as cnt from comments group by riset_id
  ) cc on cc.riset_id = r.id
  left join riset_likes ul on ul.riset_id = r.id and ul.user_id = $1
`;

function parseId(raw) {
  if (!/^\d+$/.test(String(raw || ""))) return null;
  return String(raw);
}

router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.id || null;
    const { rows } = await query(
      `${RISET_SELECT}
       where r.status <> 'draf' or r.author_id = $1
       order by r.created_at desc, r.id desc`,
      [userId]
    );
    res.json({ riset: rows.map((row) => formatRisetRow(row, userId)) });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", optionalAuth, async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: "ID riset tidak valid." });

    if (req.query.trackView === "1") {
      await query("update riset set views = views + 1 where id = $1", [id]);
    }

    const userId = req.user?.id || null;
    const { rows } = await query(`${RISET_SELECT} where r.id = $2`, [userId, id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Riset tidak ditemukan." });
    }
    res.json({ riset: formatRisetRow(rows[0], userId) });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  requireAuth,
  requireRole("mahasiswa"),
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "dokumen", maxCount: 5 },
  ]),
  async (req, res, next) => {
    try {
      const judul = String(req.body?.judul || "").trim().slice(0, 160);
      const kampus = String(req.body?.kampus || req.user.kampus || "Universitas Brawijaya").trim().slice(0, 120);
      const kategori = String(req.body?.kategori || "teknologi").trim().toLowerCase();
      const tahap = String(req.body?.tahap || "Gagasan murni").trim().slice(0, 60);
      const lisensi = String(req.body?.lisensi || "CC BY-SA").trim().slice(0, 40) || null;
      const ringkasan = String(req.body?.ringkasan || "").trim().slice(0, 2000);
      const status = ALLOWED_STATUS.has(req.body?.status) ? req.body.status : "diterbitkan";

      if (judul.length < 3) {
        return res.status(400).json({ error: "Judul riset minimal 3 karakter." });
      }
      if (!ALLOWED_KATEGORI.has(kategori)) {
        return res.status(400).json({ error: "Bidang riset tidak valid." });
      }

      let manfaat = [];
      if (req.body?.manfaat) {
        try {
          const parsed = JSON.parse(req.body.manfaat);
          if (Array.isArray(parsed)) manfaat = parsed.map((m) => String(m).trim().slice(0, 200)).filter(Boolean).slice(0, 15);
        } catch {
          manfaat = String(req.body.manfaat)
            .split(/\r?\n/)
            .map((m) => m.trim().slice(0, 200))
            .filter(Boolean)
            .slice(0, 15);
        }
      }
      if (manfaat.length === 0) {
        manfaat = ["Manfaat riset akan dilengkapi oleh tim peneliti"];
      }

      const coverFile = req.files?.cover?.[0];
      const docFiles = req.files?.dokumen || [];
      let imgUrl = null;
      if (coverFile) {
        if (isServerless && coverFile.buffer) {
          if (coverFile.buffer.length > 2 * 1024 * 1024) {
            return res.status(400).json({ error: "Ukuran gambar cover maksimal 2MB." });
          }
          imgUrl = `data:${coverFile.mimetype};base64,${coverFile.buffer.toString("base64")}`;
        } else if (coverFile.filename) {
          imgUrl = `/uploads/${coverFile.filename}`;
        }
      }
      const dokumen = docFiles.map((f) => ({
        name: sanitizeDisplayName(f.originalname),
        url: !isServerless && f.filename ? `/uploads/${f.filename}` : null,
      }));

      const anggota = [{ nama: req.user.nama, role: "Ketua Peneliti" }];

      const inserted = await query(
        `insert into riset
           (author_id, judul, kampus, kategori, lisensi, tahap, status, img, img_url, ringkasan, manfaat, dokumen, anggota)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13::jsonb)
         returning id`,
        [
          req.user.id,
          judul,
          kampus,
          kategori,
          lisensi,
          tahap,
          status,
          kategori === "pertanian" ? "irrigation" : kategori === "energi" ? "turbine" : "lms",
          imgUrl,
          ringkasan || "Belum ada deskripsi lengkap untuk riset ini.",
          manfaat,
          JSON.stringify(dokumen),
          JSON.stringify(anggota),
        ]
      );

      await createNotification({
        userId: req.user.id,
        title: "Riset berhasil diunggah!",
        body: `Penelitian "${judul}" berhasil diunggah dengan status ${status}.`,
        type: "success",
      });

      const { rows } = await query(`${RISET_SELECT} where r.id = $2`, [req.user.id, inserted.rows[0].id]);
      res.status(201).json({ riset: formatRisetRow(rows[0], req.user.id) });
    } catch (err) {
      next(err);
    }
  }
);

router.post("/:id/like", requireAuth, async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: "ID riset tidak valid." });

    const exists = await query("select id, base_likes from riset where id = $1", [id]);
    if (exists.rows.length === 0) {
      return res.status(404).json({ error: "Riset tidak ditemukan." });
    }

    const del = await query(
      "delete from riset_likes where riset_id = $1 and user_id = $2 returning riset_id",
      [id, req.user.id]
    );

    let liked = false;
    if (del.rows.length === 0) {
      await query(
        "insert into riset_likes (riset_id, user_id) values ($1, $2) on conflict do nothing",
        [id, req.user.id]
      );
      liked = true;
    }

    const countRes = await query("select count(*)::int as cnt from riset_likes where riset_id = $1", [id]);
    const suka = (Number(exists.rows[0].base_likes) || 0) + countRes.rows[0].cnt;
    res.json({ liked, suka });
  } catch (err) {
    next(err);
  }
});

router.get("/:id/comments", async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: "ID riset tidak valid." });

    const { rows } = await query(
      `select id, author_name, author_inisial, body, created_at
       from comments
       where riset_id = $1
       order by created_at asc, id asc`,
      [id]
    );

    res.json({
      comments: rows.map((c) => ({
        id: String(c.id),
        nama: c.author_name,
        inisial: c.author_inisial,
        text: c.body,
        time: formatRelativeTime(c.created_at),
        createdAt: c.created_at,
      })),
    });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/comments", requireAuth, async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: "ID riset tidak valid." });

    const text = String(req.body?.text || "").trim();
    if (!text) return res.status(400).json({ error: "Komentar tidak boleh kosong." });
    if (text.length > 1500) return res.status(400).json({ error: "Komentar maksimal 1500 karakter." });

    const risetRes = await query("select id, author_id, judul from riset where id = $1", [id]);
    if (risetRes.rows.length === 0) {
      return res.status(404).json({ error: "Riset tidak ditemukan." });
    }

    const { rows } = await query(
      `insert into comments (riset_id, user_id, author_name, author_inisial, body)
       values ($1, $2, $3, $4, $5)
       returning id, author_name, author_inisial, body, created_at`,
      [id, req.user.id, req.user.nama, req.user.inisial, text]
    );

    const targetRiset = risetRes.rows[0];
    if (String(targetRiset.author_id) !== String(req.user.id)) {
      await createNotification({
        userId: targetRiset.author_id,
        title: "Komentar Baru",
        body: `${req.user.nama} berkomentar pada riset "${targetRiset.judul}".`,
        type: "info",
      });
    }

    const cntRes = await query("select count(*)::int as cnt from comments where riset_id = $1", [id]);
    const c = rows[0];
    res.status(201).json({
      comment: {
        id: String(c.id),
        nama: c.author_name,
        inisial: c.author_inisial,
        text: c.body,
        time: formatRelativeTime(c.created_at),
        createdAt: c.created_at,
      },
      komentar: cntRes.rows[0].cnt,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
