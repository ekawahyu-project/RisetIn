import { Router } from "express";
import { query } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { createNotification, formatClockTime, formatRelativeTime } from "../utils/format.js";

const STAGE_LABELS = ["Inisiasi", "Negosiasi", "Pengembangan", "Implementasi", "Hilirisasi"];
const MAX_SIGNATURE_LEN = 300_000;

function parseId(raw) {
  if (!/^\d+$/.test(String(raw || ""))) return null;
  return String(raw);
}

async function getParticipantCollab(collabId, userId) {
  const { rows } = await query(
    `select c.*, r.judul as riset_judul, r.kampus as riset_kampus,
            u_ind.nama as industri_nama, u_mhs.nama as mahasiswa_nama
     from collaborations c
     join riset r on r.id = c.riset_id
     join users u_ind on u_ind.id = c.industri_id
     join users u_mhs on u_mhs.id = c.mahasiswa_id
     where c.id = $1`,
    [collabId]
  );
  const collab = rows[0];
  if (!collab) return { error: 404, message: "Kolaborasi tidak ditemukan." };
  const isParticipant =
    String(collab.mahasiswa_id) === String(userId) || String(collab.industri_id) === String(userId);
  if (!isParticipant) return { error: 403, message: "Anda tidak memiliki akses ke kolaborasi ini." };
  return { collab };
}

export const kolaborasiRouter = Router();

kolaborasiRouter.get("/", requireAuth, async (req, res, next) => {
  try {
    const uid = req.user.id;
    const { rows } = await query(
      `select
         c.id, c.riset_id, c.industri_id, c.mahasiswa_id, c.pesan, c.status, c.tahap, c.created_at, c.updated_at,
         r.kampus as riset_kampus,
         u_ind.nama as perusahaan,
         (n.id is not null) as has_nda
       from collaborations c
       join riset r on r.id = c.riset_id
       join users u_ind on u_ind.id = c.industri_id
       left join nda_agreements n on n.collaboration_id = c.id
       where c.mahasiswa_id = $1 or c.industri_id = $1
       order by c.updated_at desc, c.id desc`,
      [uid]
    );

    const masuk = [];
    const berjalan = [];
    const indPengajuan = [];
    const indBerjalan = [];

    for (const row of rows) {
      const id = String(row.id);
      const risetId = String(row.riset_id);
      const isMhs = String(row.mahasiswa_id) === String(uid);
      const isInd = String(row.industri_id) === String(uid);

      if (isMhs) {
        if (row.status === "menunggu") {
          masuk.push({
            id,
            risetId,
            perusahaan: row.perusahaan,
            pesan: row.pesan,
            waktu: formatRelativeTime(row.created_at),
            status: row.status,
          });
        } else if (row.status === "diterima") {
          berjalan.push({
            id,
            risetId,
            perusahaan: row.perusahaan,
            updated: formatRelativeTime(row.updated_at),
            tahap: Number(row.tahap) || 0,
            hasNda: Boolean(row.has_nda),
          });
        }
      }

      if (isInd) {
        if (row.status === "menunggu" || row.status === "ditolak") {
          indPengajuan.push({
            id,
            risetId,
            kampus: row.riset_kampus,
            status: row.status,
            waktu: formatRelativeTime(row.created_at),
          });
        } else if (row.status === "diterima") {
          indBerjalan.push({
            id,
            risetId,
            updated: formatRelativeTime(row.updated_at),
            tahap: Number(row.tahap) || 0,
            hasNda: Boolean(row.has_nda),
          });
        }
      }
    }

    res.json({ masuk, berjalan, indPengajuan, indBerjalan });
  } catch (err) {
    next(err);
  }
});

kolaborasiRouter.post("/", requireAuth, requireRole("industri"), async (req, res, next) => {
  try {
    const risetId = parseId(req.body?.risetId);
    if (!risetId) return res.status(400).json({ error: "ID riset tidak valid." });

    const risetRes = await query("select id, author_id, judul, kampus, status from riset where id = $1", [risetId]);
    const r = risetRes.rows[0];
    if (!r) return res.status(404).json({ error: "Riset tidak ditemukan." });
    if (r.status === "draf" || r.status === "arsip") {
      return res.status(400).json({ error: "Riset ini belum tersedia untuk kolaborasi." });
    }

    const dup = await query(
      `select id, status from collaborations
       where riset_id = $1 and industri_id = $2 and status in ('menunggu', 'diterima')`,
      [risetId, req.user.id]
    );
    if (dup.rows.length > 0) {
      return res.status(409).json({
        error:
          dup.rows[0].status === "diterima"
            ? "Anda sudah memiliki kolaborasi aktif pada riset ini."
            : "Pengajuan kolaborasi untuk riset ini masih menunggu tanggapan.",
      });
    }

    const pesan = String(req.body?.pesan || `Tertarik berkolaborasi untuk riset "${r.judul}"`).trim().slice(0, 500);
    const { rows } = await query(
      `insert into collaborations (riset_id, industri_id, mahasiswa_id, pesan, status, tahap)
       values ($1, $2, $3, $4, 'menunggu', 0)
       returning id, riset_id, status, created_at`,
      [risetId, req.user.id, r.author_id, pesan]
    );

    await createNotification({
      userId: r.author_id,
      title: "Permintaan Kolaborasi Baru",
      body: `${req.user.nama} mengirimkan permintaan kolaborasi untuk riset "${r.judul}".`,
      type: "request",
    });

    res.status(201).json({
      pengajuan: {
        id: String(rows[0].id),
        risetId: String(rows[0].riset_id),
        kampus: r.kampus,
        status: rows[0].status,
        waktu: formatRelativeTime(rows[0].created_at),
      },
    });
  } catch (err) {
    next(err);
  }
});

kolaborasiRouter.patch("/:id/respond", requireAuth, requireRole("mahasiswa"), async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: "ID kolaborasi tidak valid." });

    const action = req.body?.action;
    if (action !== "accept" && action !== "reject") {
      return res.status(400).json({ error: "Aksi harus 'accept' atau 'reject'." });
    }

    const { rows } = await query(
      `select c.*, r.judul as riset_judul, u_ind.nama as perusahaan
       from collaborations c
       join riset r on r.id = c.riset_id
       join users u_ind on u_ind.id = c.industri_id
       where c.id = $1 and c.mahasiswa_id = $2`,
      [id, req.user.id]
    );
    const collab = rows[0];
    if (!collab) return res.status(404).json({ error: "Permintaan kolaborasi tidak ditemukan." });
    if (collab.status !== "menunggu") {
      return res.status(409).json({ error: "Permintaan kolaborasi ini sudah diproses." });
    }

    const newStatus = action === "accept" ? "diterima" : "ditolak";
    const updated = await query(
      `update collaborations set status = $1, updated_at = now() where id = $2 returning *`,
      [newStatus, id]
    );

    await createNotification({
      userId: collab.industri_id,
      title: action === "accept" ? "Pengajuan Kolaborasi Diterima" : "Pengajuan Kolaborasi Ditolak",
      body:
        action === "accept"
          ? `${req.user.nama} menerima pengajuan kolaborasi untuk "${collab.riset_judul}".`
          : `${req.user.nama} belum dapat menerima pengajuan kolaborasi untuk "${collab.riset_judul}".`,
      type: action === "accept" ? "success" : "info",
    });

    const row = updated.rows[0];
    res.json({
      collaboration: {
        id: String(row.id),
        risetId: String(row.riset_id),
        perusahaan: collab.perusahaan,
        status: row.status,
        tahap: Number(row.tahap) || 0,
        updated: formatRelativeTime(row.updated_at),
      },
    });
  } catch (err) {
    next(err);
  }
});

kolaborasiRouter.patch("/:id/stage", requireAuth, requireRole("mahasiswa"), async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: "ID kolaborasi tidak valid." });

    const { rows } = await query(
      `select c.*, r.judul as riset_judul
       from collaborations c
       join riset r on r.id = c.riset_id
       where c.id = $1 and c.mahasiswa_id = $2 and c.status = 'diterima'`,
      [id, req.user.id]
    );
    const collab = rows[0];
    if (!collab) return res.status(404).json({ error: "Proyek kolaborasi aktif tidak ditemukan." });

    const nextStage = Math.min((Number(collab.tahap) || 0) + 1, 4);
    const updated = await query(
      `update collaborations set tahap = $1, updated_at = now() where id = $2 returning *`,
      [nextStage, id]
    );

    if (nextStage === 4 && Number(collab.tahap) < 4) {
      await query(
        `update riset set status = 'diadopsi', diadopsi = diadopsi + 1, updated_at = now() where id = $1`,
        [collab.riset_id]
      );
    }

    const label = STAGE_LABELS[nextStage] || "Tahap Berikutnya";
    await createNotification({
      userId: collab.industri_id,
      title: "Perubahan Tahapan Kolaborasi",
      body: `Status kolaborasi "${collab.riset_judul}" telah memasuki tahap ${label}.`,
      type: nextStage === 4 ? "success" : "info",
    });

    const row = updated.rows[0];
    res.json({
      collaboration: {
        id: String(row.id),
        tahap: Number(row.tahap),
        updated: formatRelativeTime(row.updated_at),
      },
    });
  } catch (err) {
    next(err);
  }
});

kolaborasiRouter.get("/:id/nda", requireAuth, async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: "ID kolaborasi tidak valid." });

    const check = await getParticipantCollab(id, req.user.id);
    if (check.error) return res.status(check.error).json({ error: check.message });

    const { rows } = await query("select * from nda_agreements where collaboration_id = $1", [id]);
    const row = rows[0];
    if (!row) return res.json({ nda: null });

    res.json({
      nda: {
        id: String(row.id),
        collaborationId: String(row.collaboration_id),
        nomorNDA: row.nomor_nda,
        nama: row.signer_nama,
        jabatan: row.signer_jabatan,
        signature: row.signature_data,
        signedAt: row.signed_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

kolaborasiRouter.post("/:id/nda", requireAuth, async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: "ID kolaborasi tidak valid." });

    const check = await getParticipantCollab(id, req.user.id);
    if (check.error) return res.status(check.error).json({ error: check.message });

    const nama = String(req.body?.nama || "").trim().slice(0, 100);
    const jabatan = String(req.body?.jabatan || "").trim().slice(0, 100);
    const signature = String(req.body?.signature || "");

    if (!nama || !jabatan) {
      return res.status(400).json({ error: "Nama lengkap dan jabatan wajib diisi." });
    }
    if (!/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(signature) || signature.length > MAX_SIGNATURE_LEN) {
      return res.status(400).json({ error: "Tanda tangan digital tidak valid atau terlalu besar." });
    }

    const existing = await query("select id from nda_agreements where collaboration_id = $1", [id]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "NDA untuk kolaborasi ini sudah ditandatangani." });
    }

    const today = new Date();
    const datePart = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const nomorNDA = `NDA-${datePart}-${String(id).padStart(4, "0")}`;

    const { rows } = await query(
      `insert into nda_agreements (collaboration_id, nomor_nda, signer_id, signer_nama, signer_jabatan, signature_data)
       values ($1, $2, $3, $4, $5, $6)
       returning *`,
      [id, nomorNDA, req.user.id, nama, jabatan, signature]
    );

    const partnerId =
      String(check.collab.mahasiswa_id) === String(req.user.id)
        ? check.collab.industri_id
        : check.collab.mahasiswa_id;
    await createNotification({
      userId: partnerId,
      title: "Digital NDA Ditandatangani",
      body: `${nama} telah menandatangani NDA (${nomorNDA}) untuk riset "${check.collab.riset_judul}".`,
      type: "success",
    });

    const row = rows[0];
    res.status(201).json({
      nda: {
        id: String(row.id),
        collaborationId: String(row.collaboration_id),
        nomorNDA: row.nomor_nda,
        nama: row.signer_nama,
        jabatan: row.signer_jabatan,
        signature: row.signature_data,
        signedAt: row.signed_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

kolaborasiRouter.get("/:id/messages", requireAuth, async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: "ID kolaborasi tidak valid." });

    const check = await getParticipantCollab(id, req.user.id);
    if (check.error) return res.status(check.error).json({ error: check.message });

    const { rows } = await query(
      `select id, sender_id, body, created_at
       from messages
       where collaboration_id = $1
       order by created_at asc, id asc`,
      [id]
    );

    res.json({
      messages: rows.map((m) => ({
        id: String(m.id),
        from: String(m.sender_id) === String(req.user.id) ? "me" : "them",
        text: m.body,
        time: formatClockTime(m.created_at),
        createdAt: m.created_at,
      })),
    });
  } catch (err) {
    next(err);
  }
});

kolaborasiRouter.post("/:id/messages", requireAuth, async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: "ID kolaborasi tidak valid." });

    const check = await getParticipantCollab(id, req.user.id);
    if (check.error) return res.status(check.error).json({ error: check.message });

    const text = String(req.body?.text || "").trim();
    if (!text) return res.status(400).json({ error: "Pesan tidak boleh kosong." });
    if (text.length > 2000) return res.status(400).json({ error: "Pesan maksimal 2000 karakter." });

    const { rows } = await query(
      `insert into messages (collaboration_id, sender_id, body)
       values ($1, $2, $3)
       returning id, sender_id, body, created_at`,
      [id, req.user.id, text]
    );

    await query("update collaborations set updated_at = now() where id = $1", [id]);

    const partnerId =
      String(check.collab.mahasiswa_id) === String(req.user.id)
        ? check.collab.industri_id
        : check.collab.mahasiswa_id;
    await createNotification({
      userId: partnerId,
      title: "Pesan Baru",
      body: `Anda menerima pesan baru dari ${req.user.nama}.`,
      type: "chat",
    });

    const m = rows[0];
    res.status(201).json({
      message: {
        id: String(m.id),
        from: "me",
        text: m.body,
        time: formatClockTime(m.created_at),
        createdAt: m.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

export const notificationsRouter = Router();

notificationsRouter.get("/", requireAuth, async (req, res, next) => {
  try {
    const { rows } = await query(
      `select id, title, body, type, unread, created_at
       from notifications
       where user_id = $1
       order by created_at desc, id desc
       limit 50`,
      [req.user.id]
    );
    res.json({
      notifications: rows.map((n) => ({
        id: String(n.id),
        title: n.title,
        body: n.body,
        type: n.type,
        unread: Boolean(n.unread),
        time: formatRelativeTime(n.created_at),
      })),
    });
  } catch (err) {
    next(err);
  }
});

notificationsRouter.post("/read-all", requireAuth, async (req, res, next) => {
  try {
    await query("update notifications set unread = false where user_id = $1 and unread = true", [req.user.id]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
