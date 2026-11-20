import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import { closePool, getPool, query } from "./db.js";
import {
  risetList,
  risetSayaIds,
  statusRisetSaya,
  commentsSeed,
  chatSeed,
  notifications as notifSeed,
  userMahasiswa,
  userIndustri,
} from "../src/data/mockData.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  const schemaPath = path.resolve(__dirname, "schema.sql");
  const schemaSql = await fs.readFile(schemaPath, "utf8");

  console.log("1. Menjalankan schema.sql...");
  await query(schemaSql);
  console.log("   Skema tabel berhasil disiapkan.");

  const existingUsers = await query("select count(*)::int as cnt from users");
  if (existingUsers.rows[0].cnt > 0) {
    console.log("2. Data seed sudah ada, melewati proses seed agar tidak duplikat.");
    return;
  }

  console.log("2. Mengisi akun demo & data awal RisetIn...");
  const client = await getPool().connect();
  try {
    await client.query("begin");

    const demoHash = await bcrypt.hash("password123", 10);

    const mhsMain = (
      await client.query(
        `insert into users (email, password_hash, role, nama, inisial, kampus, bio, nim)
         values ($1, $2, 'mahasiswa', $3, $4, $5, $6, $7)
         returning id`,
        [
          userMahasiswa.email,
          demoHash,
          userMahasiswa.nama,
          userMahasiswa.inisial,
          userMahasiswa.kampus,
          userMahasiswa.bio,
          userMahasiswa.nim,
        ]
      )
    ).rows[0].id;

    const mhsOther = (
      await client.query(
        `insert into users (email, password_hash, role, nama, inisial, kampus, bio)
         values ($1, $2, 'mahasiswa', 'Tim Peneliti Nusantara', 'TP', 'Universitas Gadjah Mada', 'Peneliti kolaboratif lintas universitas di Indonesia.')
         returning id`,
        ["peneliti@kampus.ac.id", demoHash]
      )
    ).rows[0].id;

    const indMain = (
      await client.query(
        `insert into users (email, password_hash, role, nama, inisial, sektor, bio, nib)
         values ($1, $2, 'industri', $3, $4, $5, $6, $7)
         returning id`,
        [
          "kemitraan@industriagro.co.id",
          demoHash,
          userIndustri.nama,
          userIndustri.inisial,
          userIndustri.sektor,
          userIndustri.bio,
          userIndustri.nib,
        ]
      )
    ).rows[0].id;

    const indSecond = (
      await client.query(
        `insert into users (email, password_hash, role, nama, inisial, sektor, bio)
         values ($1, $2, 'industri', 'PT Indomeal', 'PI', 'Manufaktur & Pangan', 'Perusahaan manufaktur pangan dengan fokus otomasi kualitas produksi.')
         returning id`,
        ["kemitraan@indomeal.co.id", demoHash]
      )
    ).rows[0].id;

    // Seed 16 riset from mockData.js and map mock IDs ("r1"..) -> Postgres bigint IDs
    const mockIdToDbId = new Map();
    const defaultDocs = [
      { name: "Proposal Riset.pdf", url: null },
      { name: "Dokumentasi Purwarupa.pdf", url: null },
      { name: "Data Uji Coba.xlsx", url: null },
    ];
    const defaultTeam = [
      { nama: "Eka Wahyu Maulidan", role: "Ketua Peneliti" },
      { nama: "Aisyah Berlianti Afriandi", role: "Anggota Peneliti" },
      { nama: "Rezha Anugrah Putra", role: "Anggota Peneliti" },
    ];

    for (const r of risetList) {
      const isMine = risetSayaIds.includes(r.id);
      const authorId = isMine ? mhsMain : mhsOther;
      const status = isMine ? statusRisetSaya[r.id] || r.status : r.status;
      const team = isMine ? defaultTeam : [{ nama: `Tim Riset ${r.kampus}`, role: "Ketua Peneliti" }];

      const inserted = await client.query(
        `insert into riset
           (author_id, judul, kampus, kategori, lisensi, views, base_likes, diadopsi, tahap, status, img, img_url, ringkasan, manfaat, dokumen, anggota)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15::jsonb, $16::jsonb)
         returning id`,
        [
          authorId,
          r.judul,
          r.kampus,
          r.kategori,
          r.lisensi,
          r.views,
          r.suka,
          r.diadopsi,
          r.tahap,
          status,
          r.img,
          r.imgUrl,
          r.ringkasan,
          r.manfaat,
          JSON.stringify(defaultDocs),
          JSON.stringify(team),
        ]
      );
      mockIdToDbId.set(r.id, inserted.rows[0].id);
    }

    // Seed comments
    for (const [mockRisetId, list] of Object.entries(commentsSeed)) {
      const dbRisetId = mockIdToDbId.get(mockRisetId);
      if (!dbRisetId) continue;
      for (const c of list) {
        const userId = c.nama === "PT Agro Makmur" ? indMain : c.nama === "PT Indomeal" ? indSecond : null;
        await client.query(
          `insert into comments (riset_id, user_id, author_name, author_inisial, body)
           values ($1, $2, $3, $4, $5)`,
          [dbRisetId, userId, c.nama, c.inisial, c.text]
        );
      }
    }

    // Seed collaborations (active + pending + rejected)
    const r1 = mockIdToDbId.get("r1");
    const r2 = mockIdToDbId.get("r2");
    const r3 = mockIdToDbId.get("r3");
    const r6 = mockIdToDbId.get("r6");
    const r7 = mockIdToDbId.get("r7");

    // Active collab: PT Agro Makmur <-> Eka Wahyu on r1
    const cActive1 = (
      await client.query(
        `insert into collaborations (riset_id, industri_id, mahasiswa_id, pesan, status, tahap)
         values ($1, $2, $3, 'Tertarik mengimplementasikan Sistem Irigasi Otomatis Berbasis IoT', 'diterima', 2)
         returning id`,
        [r1, indMain, mhsMain]
      )
    ).rows[0].id;

    // Active collab: PT Indomeal <-> Eka Wahyu on r3
    await client.query(
      `insert into collaborations (riset_id, industri_id, mahasiswa_id, pesan, status, tahap)
       values ($1, $2, $3, 'Tertarik dengan Robot Inspeksi Kualitas Produk Otomatis', 'diterima', 1)`,
      [r3, indSecond, mhsMain]
    );

    // Incoming pending request for Eka Wahyu on r2 from PT Agro Makmur
    await client.query(
      `insert into collaborations (riset_id, industri_id, mahasiswa_id, pesan, status, tahap)
       values ($1, $2, $3, 'Tertarik mengevaluasi Smart Parking Berbasis Sensor AI untuk kawasan pabrik kami', 'menunggu', 0)`,
      [r2, indMain, mhsMain]
    );

    // Industry outgoing requests (menunggu & ditolak) on other campus riset
    await client.query(
      `insert into collaborations (riset_id, industri_id, mahasiswa_id, pesan, status, tahap)
       values ($1, $2, $3, 'Tertarik uji coba Sistem Monitoring Kelembapan Tanah di lahan perkebunan', 'menunggu', 0)`,
      [r6, indMain, mhsOther]
    );
    await client.query(
      `insert into collaborations (riset_id, industri_id, mahasiswa_id, pesan, status, tahap)
       values ($1, $2, $3, 'Pengajuan penjajakan Sistem Monitoring Kualitas Udara', 'ditolak', 0)`,
      [r7, indMain, mhsOther]
    );

    // Seed chat message on active collab r1
    for (const msg of chatSeed) {
      await client.query(
        `insert into messages (collaboration_id, sender_id, body)
         values ($1, $2, $3)`,
        [cActive1, indMain, msg.text]
      );
    }

    // Seed notifications for demo Mahasiswa & Industri
    for (const n of notifSeed) {
      await client.query(
        `insert into notifications (user_id, title, body, type, unread)
         values ($1, $2, $3, $4, $5)`,
        [mhsMain, n.title, n.body, n.type, n.unread]
      );
    }
    await client.query(
      `insert into notifications (user_id, title, body, type, unread)
       values ($1, 'Kolaborasi Aktif Berjalan', 'Kolaborasi Sistem Irigasi Otomatis Berbasis IoT sedang berada di tahap Pengembangan.', 'info', true)`,
      [indMain]
    );

    await client.query("commit");
    console.log("   Seed selesai!");
    console.log("   Akun Demo Mahasiswa : ekawahyu@student.ub.ac.id / password123");
    console.log("   Akun Demo Industri  : kemitraan@industriagro.co.id / password123");
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}

run()
  .catch((err) => {
    console.error("Gagal menjalankan db:setup:", err.message);
    process.exitCode = 1;
  })
  .finally(() => closePool());
