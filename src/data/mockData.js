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
    imgUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop&q=80",
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
    imgUrl: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&h=300&fit=crop&q=80",
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
    imgUrl: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=400&h=300&fit=crop&q=80",
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
    imgUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&q=80",
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
    imgUrl: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=400&h=300&fit=crop&q=80",
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
    imgUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop&q=80",
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
    imgUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop&q=80",
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
    imgUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=300&fit=crop&q=80",
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
    imgUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=80",
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
    imgUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&q=80",
    ringkasan:
      "Platform pembelajaran daring yang memungkinkan interaksi materi lewat perintah suara untuk meningkatkan aksesibilitas belajar, terutama bagi penyandang disabilitas.",
    manfaat: ["Aksesibilitas belajar lebih inklusif", "Navigasi materi tanpa mengetik"],
  },
  {
    id: "r11",
    judul: "Wearable Deteksi Dini Aritmia Jantung",
    kampus: "Institut Teknologi Bandung",
    kategori: "kesehatan",
    lisensi: "CC BY-SA",
    views: 812,
    komentar: 21,
    suka: 340,
    diadopsi: 6,
    tahap: "Purwarupa fisik",
    status: "diterbitkan",
    img: "posture",
    imgUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop&q=80",
    ringkasan:
      "Perangkat wearable ringan yang memantau sinyal EKG secara kontinu dan mengirimkan peringatan dini ke ponsel pengguna serta tenaga medis saat mendeteksi indikasi aritmia.",
    manfaat: ["Deteksi dini gangguan irama jantung", "Data riwayat kesehatan tersimpan otomatis", "Notifikasi darurat ke keluarga/medis"],
  },
  {
    id: "r12",
    judul: "Sistem Sortasi Buah Otomatis Berbasis Computer Vision",
    kampus: "Institut Pertanian Bogor",
    kategori: "manufaktur",
    lisensi: "CC BY-SA",
    views: 431,
    komentar: 9,
    suka: 176,
    diadopsi: 3,
    tahap: "Purwarupa fisik",
    status: "diterbitkan",
    img: "robot",
    imgUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&q=80",
    ringkasan:
      "Mesin sortasi otomatis yang menggunakan computer vision untuk mengklasifikasikan buah berdasarkan ukuran, warna, dan tingkat kematangan pada lini pengemasan.",
    manfaat: ["Sortasi 3x lebih cepat dari manual", "Konsistensi grading kualitas ekspor", "Mengurangi kebutuhan tenaga kerja manual"],
  },
  {
    id: "r13",
    judul: "Panel Surya Fleksibel untuk Atap Rumah Tropis",
    kampus: "Institut Teknologi Sepuluh Nopember",
    kategori: "energi",
    lisensi: "CC BY-SA",
    views: 297,
    komentar: 5,
    suka: 128,
    diadopsi: 1,
    tahap: "Tinjauan literatur",
    status: "diterbitkan",
    img: "turbine",
    imgUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop&q=80",
    ringkasan:
      "Panel surya berbahan fleksibel yang dirancang tahan terhadap kelembapan tinggi dan mudah dipasang di berbagai bentuk atap rumah di iklim tropis.",
    manfaat: ["Instalasi lebih ringan & fleksibel", "Tahan kelembapan tinggi", "Cocok untuk rumah tapak perkotaan"],
  },
  {
    id: "r14",
    judul: "Bioplastik dari Limbah Kulit Singkong",
    kampus: "Universitas Padjadjaran",
    kategori: "lingkungan",
    lisensi: "CC BY-SA",
    views: 356,
    komentar: 12,
    suka: 205,
    diadopsi: 2,
    tahap: "Purwarupa fisik",
    status: "diterbitkan",
    img: "aquaponic",
    imgUrl: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&h=300&fit=crop&q=80",
    ringkasan:
      "Material bioplastik biodegradable yang diproduksi dari limbah kulit singkong, ditujukan sebagai alternatif kemasan ramah lingkungan bagi UMKM makanan.",
    manfaat: ["Terurai alami dalam hitungan minggu", "Memanfaatkan limbah pertanian", "Biaya produksi kompetitif untuk UMKM"],
  },
  {
    id: "r15",
    judul: "Drone Penyemprot Presisi untuk Lahan Perkebunan",
    kampus: "Universitas Gadjah Mada",
    kategori: "pertanian",
    lisensi: "CC BY-SA",
    views: 604,
    komentar: 17,
    suka: 289,
    diadopsi: 4,
    tahap: "Purwarupa fisik",
    status: "diterbitkan",
    img: "irrigation",
    imgUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=300&fit=crop&q=80",
    ringkasan:
      "Drone penyemprot otomatis dengan pemetaan lahan presisi yang mengoptimalkan dosis pupuk dan pestisida sesuai kebutuhan titik lahan spesifik.",
    manfaat: ["Efisiensi penggunaan pupuk hingga 30%", "Pemetaan lahan otomatis", "Mengurangi paparan bahan kimia ke petani"],
  },
  {
    id: "r16",
    judul: "Platform Prediksi Cuaca Mikro untuk Nelayan",
    kampus: "Universitas Hasanuddin",
    kategori: "teknologi",
    lisensi: "CC BY-SA",
    views: 219,
    komentar: 6,
    suka: 143,
    diadopsi: 1,
    tahap: "Tinjauan literatur",
    status: "diterbitkan",
    img: "air",
    imgUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&q=80",
    ringkasan:
      "Platform berbasis machine learning yang memprediksi kondisi cuaca dan gelombang laut mikro di wilayah tangkap nelayan lokal untuk meningkatkan keselamatan melaut.",
    manfaat: ["Prediksi cuaca hyperlocal", "Peringatan dini gelombang tinggi", "Akses gratis lewat aplikasi ringan"],
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

export const commentsSeed = {
  r1: [
    {
      id: "cm1",
      nama: "PT Agro Makmur",
      inisial: "AM",
      text: "Apakah sistem ini sudah diuji untuk lahan sawah dengan kemiringan tertentu?",
      time: "2 hari lalu",
    },
    {
      id: "cm2",
      nama: "Dr. Sinta Wulandari",
      inisial: "SW",
      text: "Riset yang sangat aplikatif, cocok untuk mendukung ketahanan pangan daerah kering.",
      time: "1 hari lalu",
    },
  ],
  r3: [
    {
      id: "cm3",
      nama: "PT Indomeal",
      inisial: "PI",
      text: "Berapa rata-rata akurasi deteksi cacat produk pada uji coba terakhir?",
      time: "3 hari lalu",
    },
  ],
};

export const commentCountFallback = 0;

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
