# RisetIn — Prototype

Prototype web app untuk **RisetIn**, platform kolaborasi B2B (marketplace inovasi) yang menghubungkan riset mahasiswa dengan kebutuhan industri — dibuat berdasarkan proposal (PRISMA.pdf) dan mockup desain aplikasi.

Ini adalah **prototype front-end saja** (tanpa backend/database sungguhan), dengan layout **website responsif** (sidebar + topbar di desktop, drawer + bottom nav di mobile). Semua data (riset, notifikasi, kolaborasi, chat, komentar) berupa mock data yang tersimpan di memori browser dan akan reset setiap kali halaman di-refresh (kecuali preferensi mode gelap/terang, yang disimpan di localStorage).

## Login & Role

Aplikasi kini diawali dengan halaman **Login/Daftar**. Role (Mahasiswa/Industri) ditentukan otomatis dari alamat email saat login:
- Email yang mengandung kata **"industri"** (contoh: `kemitraan@industriagro.co.id`) → masuk sebagai akun **Industri**
- Email lainnya → masuk sebagai akun **Mahasiswa**

Password tidak divalidasi sungguhan (prototype), isi apa saja yang penting tidak kosong.

## Mode Gelap/Terang

Tombol matahari/bulan di pojok kanan atas (topbar) mengganti tema gelap/terang di seluruh aplikasi. Preferensi disimpan otomatis di browser.

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- React Router (HashRouter, agar bisa dibuka langsung dari file `dist/index.html` tanpa server khusus)
- lucide-react (icon set)

## Menjalankan secara lokal (mode development)

```bash
npm install
npm run dev
```

Buka URL yang muncul di terminal (biasanya `http://localhost:5173`).

## Build untuk produksi

```bash
npm run build
npm run preview
```

Hasil build ada di folder `dist/`.

## Fitur yang tersedia di prototype ini

Setelah login, role ditentukan otomatis dari email yang digunakan (lihat bagian **Login & Role** di atas).

### Mode Mahasiswa
- **Beranda** — ringkasan riset, kolaborasi aktif, pengunjung, riset diadopsi
- **Riset Saya** — tab Diterbitkan / Diadopsi / Draf / Arsip
- **Jelajahi Riset** — cari riset lintas kampus dengan filter cepat (Semua/Terbaru/Populer/Terdekat), kategori bidang, dan **Filter Lanjutan** (kampus, tahap riset, lisensi, minimal suka) yang benar-benar berfungsi
- **Like & Komentar** — tombol suka bisa diklik langsung dari kartu riset (like bertambah/berkurang), tombol komentar membuka halaman komentar tersendiri untuk membaca & menulis komentar
- **Detail Riset** — ringkasan, dokumen, anggota tim, cuplikan komentar dengan tautan ke halaman komentar lengkap
- **Upload Riset** — wizard 4 langkah: Informasi → Dokumen → Pengecekan AI (simulasi ekstraksi metadata) → Publikasi
- **Kolaborasi** — Permintaan Masuk (terima/tolak) & Proyek Berjalan (tahapan kolaborasi + chat)
- **Notifikasi**, **Profil & Pengaturan**

### Mode Industri
- **Beranda** — highlight Matchmaking AI & riset terbaru
- **Matchmaking AI** — chatbot untuk menceritakan kebutuhan industri dan mendapatkan rekomendasi riset dengan skor kecocokan
- **Jelajahi Riset**, **Like & Komentar**, **Filter Lanjutan** — sama seperti mode Mahasiswa
- **Kolaborasi** — Pengajuan Kolaborasi & Proyek Berjalan (tahapan kolaborasi + chat)
- **Profil & Pengaturan**

## Struktur folder

```
src/
  components/   # Sidebar, Topbar, BottomNav, PageHeader, Container, RisetCard, Badge, RisetThumb
  context/      # AppContext.jsx — state global (auth, role, tema, riset, like, komentar, notifikasi, kolaborasi)
  data/         # mockData.js — seluruh data contoh (16 riset, komentar, notifikasi, dll)
  pages/        # Login, Beranda, Riset, RisetSaya, DetailRiset, Komentar, UploadRiset,
                # Kolaborasi, KolaborasiProses, Chat, MatchmakingAI, Notifikasi, Profil, EditProfil, Pengaturan
```

## Catatan

Karena ini masih prototype, autentikasi (login), backend, database, dan integrasi AI (NLP Matchmaking, ekstraksi metadata) hanya berupa simulasi UI/UX — belum terhubung ke layanan sungguhan. Data like/komentar/riset baru akan hilang saat halaman di-refresh karena hanya disimpan di memori (state React), bukan di database.
