# RisetIn — Prototype

Prototype web app untuk **RisetIn**, platform kolaborasi B2B (marketplace inovasi) yang menghubungkan riset mahasiswa dengan kebutuhan industri — dibuat berdasarkan proposal (PRISMA.pdf) dan mockup desain aplikasi.

Ini adalah **prototype front-end saja** (tanpa backend/database sungguhan), dengan layout **website responsif** (sidebar + topbar di desktop, drawer + bottom nav di mobile) — bukan tampilan aplikasi mobile dalam frame HP. Semua data (riset, notifikasi, kolaborasi, chat) berupa mock data yang tersimpan di memori browser dan akan reset setiap kali halaman di-refresh.

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

Prototype disimulasikan dalam tampilan **frame smartphone** di tengah layar, mengikuti mockup yang diberikan. Terdapat dua peran (role) yang bisa dicoba lewat menu **Profil → Beralih ke mode Industri/Mahasiswa**:

### Mode Mahasiswa
- **Beranda** — ringkasan riset, kolaborasi aktif, pengunjung, riset diadopsi
- **Riset Saya** — tab Diterbitkan / Diadopsi / Draf / Arsip
- **Riset** — jelajah & cari riset kampus lain dengan filter (Semua/Terbaru/Populer/Terdekat) dan kategori bidang
- **Detail Riset** — ringkasan, dokumen, anggota tim, komentar
- **Upload Riset** — wizard 4 langkah: Informasi → Dokumen → Pengecekan AI (simulasi ekstraksi metadata) → Publikasi
- **Kolaborasi** — Permintaan Masuk (terima/tolak) & Proyek Berjalan (tahapan kolaborasi + chat)
- **Notifikasi**
- **Profil & Pengaturan**

### Mode Industri
- **Beranda** — highlight Matchmaking AI & riset terbaru
- **Matchmaking AI** — chatbot untuk menceritakan kebutuhan industri dan mendapatkan rekomendasi riset dengan skor kecocokan
- **Riset** — jelajah riset dari berbagai kampus
- **Kolaborasi** — Pengajuan Kolaborasi & Proyek Berjalan (tahapan kolaborasi + chat)
- **Profil & Pengaturan**

## Struktur folder

```
src/
  components/   # PhoneShell, TopBar, BottomNav, RisetCard, Badge, RisetThumb
  context/      # AppContext.jsx — state global (role, riset, notifikasi, kolaborasi)
  data/         # mockData.js — seluruh data contoh (mengacu pada isi dokumen proposal)
  pages/        # setiap halaman aplikasi
```

## Catatan

Karena ini masih prototype, autentikasi, backend, database, dan integrasi AI (NLP Matchmaking, ekstraksi metadata) hanya berupa simulasi UI/UX — belum terhubung ke layanan sungguhan.
