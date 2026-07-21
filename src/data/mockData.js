// Mock data for RisetIn prototype — derived from the FinPro brief & mockup references.

export const categories = [
  { id: "pertanian", label: "Pertanian", color: "bg-leaf/10 text-leaf border-leaf/30" },
  { id: "teknologi", label: "Teknologi", color: "bg-brand-500/10 text-brand-600 border-brand-500/30" },
  { id: "manufaktur", label: "Manufaktur", color: "bg-clay/10 text-clay border-clay/30" },
  { id: "kesehatan", label: "Kesehatan", color: "bg-berry/10 text-berry border-berry/30" },
  { id: "lingkungan", label: "Lingkungan", color: "bg-brand-400/10 text-brand-600 border-brand-400/30" },
  { id: "energi", label: "Energi Terbarukan", color: "bg-gold/10 text-gold border-gold/30" },
];

export const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));

export const risetList = [
  {
    id: "r1",
    judul: "Sistem Irigasi Otomatis Berbasis IoT",
    kampus: "Universitas Brawijaya",
    kategori: "pertanian",
    lisensi: "CC BY-SA",
    views: 120,
    komentar: 4,
    suka: 35,
    diadopsi: 0,
    tahap: "Purwarupa fisik",
    status: "diterbitkan",
    img: "irrigation",
    ringkasan:
      "Sistem irigasi otomatis yang dapat memonitor kelembapan tanah dan cuaca secara real-time menggunakan sensor IoT untuk efisiensi penggunaan air.",
    manfaat: ["Hemat air hingga 40%", "Meningkatkan hasil panen", "Monitoring via aplikasi real-time"],
  },
  {
    id: "r2",
    judul: "Smart Parking Berbasis Sensor AI",
    kampus: "Universitas Brawijaya",
    kategori: "teknologi",
    lisensi: "CC BY-SA",
    views: 500,
    komentar: 8,
    suka: 190,
    diadopsi: 5,
    tahap: "Purwarupa fisik",
    status: "diterbitkan",
    img: "parking",
    ringkasan:
      "Sistem parkir pintar yang mendeteksi slot kosong secara otomatis menggunakan kamera AI, terintegrasi dengan aplikasi pemesanan slot.",
    manfaat: ["Efisiensi pencarian slot 60%", "Mengurangi kemacetan area parkir", "Integrasi pembayaran digital"],
  },
  {
    id: "r3",
    judul: "Robot Inspeksi Kualitas Produk Otomatis",
    kampus: "Universitas Brawijaya",
    kategori: "manufaktur",
    lisensi: "CC BY-SA",
    views: 950,
    komentar: 113,
    suka: 950,
    diadopsi: 10,
    tahap: "Tinjauan literatur",
    status: "diterbitkan",
    img: "robot",
    ringkasan:
      "Perangkat pemindai roda dua yang menggunakan sensor visual untuk mendeteksi cacat produk lini produksi secara instan sebelum dikemas.",
    manfaat: ["Deteksi cacat produk 24 jam nonstop", "Meningkatkan konsistensi mutu", "Mengurangi biaya kontrol kualitas"],
  },
  {
    id: "r4",
    judul: "Smart Posture Detector",
    kampus: "Universitas Brawijaya",
    kategori: "kesehatan",
    lisensi: "CC BY-SA",
    views: 240,
    komentar: 0,
    suka: 70,
    diadopsi: 2,
    tahap: "Desain omnidireksional",
    status: "diterbitkan",
    img: "posture",
    ringkasan:
      "Perangkat pintar berbasis sensor akselerometer/giroskop yang memantau postur tubuh secara real-time. Sistem ini akan memberikan peringatan instan (getaran/notifikasi) saat pengguna mendeteksi postur tubuh membungkuk atau duduk terlalu lama.",
    manfaat: ["Deteksi Dini Postur", "Meningkatkan Kesehatan & Produktivitas", "Ramah Lingkungan & Rendah Bising"],
  },
  {
    id: "r5",
    judul: "Smart Irigation dengan Solar Cell",
    kampus: "Universitas Gadjah Mada",
    kategori: "pertanian",
    lisensi: "CC BY-SA",
    views: 90,
    komentar: 1,
    suka: 676,
    diadopsi: 3,
    tahap: "Purwarupa fisik",
    status: "diterbitkan",
    img: "solar-irrigation",
    ringkasan:
      "Sistem irigasi pintar berbasis panel solar (off-grid) yang memanfaatkan sumber energi mandiri untuk menggerakkan pompa air sekaligus menyiram tanaman berdasarkan kelembapan tanah.",
    manfaat: ["Hemat Biaya Operasional", "Ramah lingkungan", "Cocok untuk lahan tanpa listrik"],
  },
  {
    id: "r6",
    judul: "Sistem Monitoring Kelembapan Tanah",
    kampus: "Universitas Airlangga",
    kategori: "lingkungan",
    lisensi: "CC BY-SA",
    views: 260,
    komentar: 2,
    suka: 100,
    diadopsi: 1,
    tahap: "Tinjauan literatur",
    status: "diterbitkan",
    img: "soil",
    ringkasan:
      "Jaringan sensor nirkabel yang memantau kelembapan tanah lintas petak lahan, mengirimkan data ke dashboard untuk pengambilan keputusan pertanian presisi.",
    manfaat: ["Data lahan real-time", "Mengurangi risiko gagal panen", "Skalabel untuk lahan luas"],
  },
  {
    id: "r7",
    judul: "Sistem Monitoring Kualitas Udara",
    kampus: "Universitas Indonesia",
    kategori: "lingkungan",
    lisensi: "CC BY-SA",
    views: 578,
    komentar: 7,
    suka: 250,
    diadopsi: 0,
    tahap: "Purwarupa fisik",
    status: "diterbitkan",
    img: "air",
    ringkasan:
      "Perangkat berbasis IoT yang memonitor parameter kualitas udara seperti PM2.5, CO2, VOC, suhu, dan kelembapan secara real-time untuk memberikan peringatan dini demi menjaga kesehatan lingkungan.",
    manfaat: ["Deteksi Polusi Dini", "Meningkatkan Kesehatan & Produktivitas", "Dashboard historis kualitas udara"],
  },
  {
    id: "r8",
    judul: "Turbin Angin Sumbu Vertikal",
    kampus: "Universitas Diponegoro",
    kategori: "energi",
    lisensi: "CC BY-SA",
    views: 368,
    komentar: 3,
    suka: 99,
    diadopsi: 0,
    tahap: "Purwarupa fisik",
    status: "diterbitkan",
    img: "turbine",
    ringkasan:
      "Pembangkit listrik tenaga angin inovatif dengan rotor poros vertikal yang mampu menangkap angin dari segala arah tanpa perlu penyesuaian posisi menghadap angin.",
    manfaat: ["Desain Omnidireksional", "Ideal untuk perkotaan atau wilayah angin berubah-ubah"],
  },
  {
    id: "r9",
    judul: "Smart Aquaponic Berbasis IoT dan AI",
    kampus: "Universitas Brawijaya",
    kategori: "pertanian",
    lisensi: "CC BY-SA",
    views: 450,
    komentar: 14,
    suka: 110,
    diadopsi: 2,
    tahap: "Purwarupa fisik",
    status: "diterbitkan",
    img: "aquaponic",
    ringkasan:
      "Sistem akuaponik cerdas yang mengintegrasikan pemantauan kualitas air, pemberian pakan otomatis, dan kontrol iklim berbasis AI untuk budidaya ikan dan sayuran sekaligus.",
    manfaat: ["Efisiensi pakan otomatis", "Hasil panen ganda (ikan & sayur)", "Kontrol dari smartphone"],
  },
  {
    id: "r10",
    judul: "Aplikasi LMS Berbasis Voice Recognition",
    kampus: "Universitas Brawijaya",
    kategori: "teknologi",
    lisensi: null,
    views: 0,
    komentar: 0,
    suka: 0,
    diadopsi: 0,
    tahap: "Gagasan murni",
    status: "draf",
    img: "lms",
    ringkasan:
      "Platform pembelajaran daring yang memungkinkan interaksi materi lewat perintah suara untuk meningkatkan aksesibilitas belajar, terutama bagi penyandang disabilitas.",
    manfaat: ["Aksesibilitas belajar lebih inklusif", "Navigasi materi tanpa mengetik"],
  },
];

export const risetSayaIds = ["r1", "r2", "r3", "r9", "r10"];

export const statusRisetSaya = {
  r1: "diterbitkan",
  r2: "diterbitkan",
  r3: "diadopsi",
  r9: "diadopsi",
  r10: "draf",
};

export const notifications = [
  {
    id: "n1",
    title: "Penelitian Berhasil Diadopsi",
    body: 'Selamat! Penelitian Anda "Robot Inspeksi Kualitas Produk Otomatis" telah diimplementasikan oleh PT Agro Makmur.',
    time: "2 menit lalu",
    unread: true,
    type: "success",
  },
  {
    id: "n2",
    title: "Perubahan Tahapan Kolaborasi",
    body: 'Status kolaborasi "Sistem Irigasi Otomatis Berbasis IoT" telah memasuki tahap Implementasi.',
    time: "1 jam lalu",
    unread: true,
    type: "info",
  },
  {
    id: "n3",
    title: "Pesan Baru",
    body: "Anda menerima pesan baru dari PT Agro Makmur.",
    time: "3 jam lalu",
    unread: true,
    type: "chat",
  },
  {
    id: "n4",
    title: "Permintaan Kolaborasi Baru",
    body: "PT Indomeal mengirimkan permintaan kolaborasi untuk riset Anda.",
    time: "Kemarin",
    unread: false,
    type: "request",
  },
  {
    id: "n5",
    title: "Riset berhasil diunggah!",
    body: 'Penelitian "Sistem Irigasi Otomatis Berbasis IoT" berhasil diunggah dan diterbitkan.',
    time: "3 hari lalu",
    unread: false,
    type: "success",
  },
];

export const collaborationsMasuk = [
  {
    id: "c1",
    risetId: "r1",
    perusahaan: "PT Agro Makmur",
    pesan: "Tertarik dengan Sistem Irigasi Otomatis Berbasis IoT",
    waktu: "10 menit lalu",
    status: "menunggu",
  },
  {
    id: "c2",
    risetId: "r3",
    perusahaan: "PT Indomeal",
    pesan: "Tertarik dengan Robot Inspeksi Kualitas Produk...",
    waktu: "1 jam lalu",
    status: "menunggu",
  },
];

export const collaborationsBerjalan = [
  {
    id: "p1",
    risetId: "r1",
    perusahaan: "PT Agro Makmur",
    updated: "5 menit lalu",
    tahap: 2, // 0-indexed current active stage
  },
  {
    id: "p2",
    risetId: "r3",
    perusahaan: "PT Indomeal",
    updated: "30 menit lalu",
    tahap: 1,
  },
];

export const tahapanKolaborasi = [
  { key: "inisiasi", label: "Inisiasi", desc: "Penemuan & komunikasi awal" },
  { key: "negosiasi", label: "Negosiasi", desc: "Diskusi kebutuhan & kesepakatan" },
  { key: "pengembangan", label: "Pengembangan", desc: "Riset & pengembangan bersama" },
  { key: "implementasi", label: "Implementasi", desc: "Penerapan & evaluasi" },
  { key: "hilirisasi", label: "Hilirisasi", desc: "Komersialisasi atau adopsi" },
];

export const chatSeed = [
  {
    id: "m1",
    from: "them",
    text: "Halo Kak Wahyu, kami tertarik dengan penelitian Sistem Irigasi Otomatis Berbasis IoT untuk Pertanian. Apakah teknologi ini sudah pernah diuji di lapangan?",
    time: "09:41",
  },
];

export const industryCollabPengajuan = [
  {
    id: "ic1",
    risetId: "r6",
    kampus: "Universitas Airlangga",
    status: "menunggu",
  },
  {
    id: "ic2",
    risetId: "r7",
    kampus: "Universitas Indonesia",
    status: "ditolak",
  },
];

export const industryCollabBerjalan = [
  {
    id: "ib1",
    risetId: "r1",
    updated: "5 menit lalu",
    tahap: 0,
  },
];

export const matchmakingResults = [
  { risetId: "r1", score: 95 },
  { risetId: "r5", score: 88 },
  { risetId: "r6", score: 76 },
];

export const userMahasiswa = {
  nama: "Eka Wahyu M",
  role: "Mahasiswa",
  kampus: "Universitas Brawijaya",
  inisial: "EM",
  bio: "Saya adalah mahasiswa S1 di Universitas Brawijaya, jurusan Pendidikan Teknologi Informasi yang memiliki minat kuat pada penelitian, pengembangan, dan inovasi.",
  stats: { riset: 5, kolaborasi: 2, pengunjung: "4rb", diadopsi: 17 },
  nim: "255150600111029",
  email: "ekawahyu@student.ub.ac.id",
};

export const userIndustri = {
  nama: "PT Agro Makmur",
  role: "Industri",
  sektor: "Pertanian & Agribisnis",
  inisial: "AM",
  bio: "Perusahaan agribisnis nasional yang berfokus pada modernisasi manajemen air dan efisiensi hasil pertanian melalui adopsi teknologi.",
  stats: { kebutuhan: 3, kolaborasi: 1, dilihat: "1.2rb", diadopsi: 4 },
  nib: "8120xxxxxxxx",
  email: "kemitraan@agromakmur.co.id",
};
