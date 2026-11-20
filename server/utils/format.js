import { query } from "../db.js";

export function computeInitials(nama) {
  const words = String(nama || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "U";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function formatRelativeTime(dateInput) {
  if (!dateInput) return "Baru saja";
  const ts = new Date(dateInput).getTime();
  if (Number.isNaN(ts)) return "Baru saja";
  const diffSec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (diffSec < 60) return "Baru saja";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) return "Kemarin";
  if (diffDay < 30) return `${diffDay} hari lalu`;
  return new Date(ts).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export function formatClockTime(dateInput) {
  const d = new Date(dateInput || Date.now());
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function formatCompactNumber(num) {
  const n = Number(num) || 0;
  if (n >= 1000) {
    const val = (n / 1000).toFixed(1).replace(/\.0$/, "");
    return `${val}rb`;
  }
  return String(n);
}

export function formatRisetRow(row, currentUserId = null) {
  return {
    id: String(row.id),
    authorId: String(row.author_id),
    isMine: currentUserId != null && String(row.author_id) === String(currentUserId),
    judul: row.judul,
    kampus: row.kampus,
    kategori: row.kategori,
    lisensi: row.lisensi,
    views: Number(row.views) || 0,
    komentar: Number(row.comment_count) || 0,
    suka: (Number(row.base_likes) || 0) + (Number(row.like_count) || 0),
    liked: Boolean(row.liked),
    diadopsi: Number(row.diadopsi) || 0,
    tahap: row.tahap,
    status: row.status,
    img: row.img || "lms",
    imgUrl: row.img_url || null,
    ringkasan: row.ringkasan || "",
    manfaat: Array.isArray(row.manfaat) ? row.manfaat : [],
    dokumen: Array.isArray(row.dokumen) ? row.dokumen : [],
    anggota: Array.isArray(row.anggota) ? row.anggota : [],
    createdAt: row.created_at,
  };
}

export async function buildUserPayload(userRow) {
  const uid = userRow.id;
  let stats;

  if (userRow.role === "mahasiswa") {
    const [risetStat, collabStat] = await Promise.all([
      query(
        `select
           count(*)::int as total_riset,
           coalesce(sum(views), 0)::int as total_views,
           coalesce(sum(diadopsi), 0)::int as total_diadopsi
         from riset
         where author_id = $1`,
        [uid]
      ),
      query(
        `select count(*)::int as total_kolab
         from collaborations
         where mahasiswa_id = $1 and status = 'diterima'`,
        [uid]
      ),
    ]);
    const r = risetStat.rows[0];
    stats = {
      riset: r.total_riset,
      kolaborasi: collabStat.rows[0].total_kolab,
      pengunjung: formatCompactNumber(r.total_views),
      diadopsi: r.total_diadopsi,
    };
  } else {
    const { rows } = await query(
      `select
         count(*) filter (where status = 'menunggu')::int as kebutuhan,
         count(*) filter (where status = 'diterima')::int as kolaborasi,
         count(*) filter (where status = 'diterima' and tahap >= 4)::int as diadopsi
       from collaborations
       where industri_id = $1`,
      [uid]
    );
    const c = rows[0];
    stats = {
      kebutuhan: c.kebutuhan,
      kolaborasi: c.kolaborasi,
      dilihat: "0",
      diadopsi: c.diadopsi,
    };
  }

  return {
    id: String(userRow.id),
    email: userRow.email,
    roleKey: userRow.role,
    role: userRow.role === "industri" ? "Industri" : "Mahasiswa",
    nama: userRow.nama,
    inisial: userRow.inisial,
    kampus: userRow.kampus || "",
    sektor: userRow.sektor || "",
    bio: userRow.bio || "",
    nim: userRow.nim || "",
    nib: userRow.nib || "",
    telp: userRow.telp || "",
    stats,
  };
}

export async function createNotification({ userId, title, body, type = "info" }) {
  await query(
    `insert into notifications (user_id, title, body, type)
     values ($1, $2, $3, $4)`,
    [userId, title, body, type]
  );
}
