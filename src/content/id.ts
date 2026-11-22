import type { SiteContent } from "./types";

// Terjemahan dari en.ts. Istilah mengikuti aplikasi Lunar (Strings.id.resx): pulau, Jangan Ganggu,
// Pengonversi berkas, Catatan, Rekaman, Pemakaian. Sumber sama dengan en.ts.
export const id = {
  hero: {
    title: "Dynamic Island untuk Windows 11",
    lead: "Lunar adalah pulau kecil di bagian atas layar, dengan sepasang mata yang berkedip dan melirik ke sana kemari saat Anda bekerja. Klik, dan pulau itu terbuka berisi semua yang Anda pakai setiap hari. Tutup, dan ia menyingkir lagi.",
    facts: [
      "Gratis dan open source",
      "Windows 11, 64-bit",
      "Tidak perlu hak administrator",
      "Tanpa akun, tanpa telemetri",
    ],
    source: "README.md intro; Install; Your privacy",
  },

  why: [
    {
      title: "Punya kepribadian",
      body: "Bukan toolbar biasa: Lunar adalah sepasang mata yang berkedip, melirik, dan tersenyum saat ada kabar baik. Terasa hidup tanpa pernah mengganggu.",
      source: "README.md Why Lunar: It has a personality",
    },
    {
      title: "Tak terlihat saat berbagi layar",
      body: "Semua jendela Lunar tidak ikut terbagi di Teams, Zoom, dan Meet, serta tidak masuk ke screenshot dan rekaman layar. Anda melihat kontrol, catatan, dan timer Anda; penonton tidak.",
      source: "README.md Why Lunar: Invisible in screen shares",
    },
    {
      title: "Mode fokus yang benar-benar fokus",
      body: "Mulai sesi Pomodoro dan Lunar menyalakan Jangan Ganggu di Windows untuk Anda. Dimatikan saat Anda jeda, dan dikembalikan seperti semula saat selesai.",
      source: "README.md Why Lunar: Focus mode",
    },
    {
      title: "Perekam di dalam pulau",
      body: "Tekan Rekam lalu tutup pulaunya. Pulau menampilkan garis suara merah, waktu, serta tombol Jeda dan Berhenti. Rekaman disimpan sebagai file MP3 biasa.",
      source: "README.md Why Lunar: A recorder that lives in the island",
    },
    {
      title: "Pulau menunjukkan apa yang terjadi",
      body: "Saat musik diputar, pulau yang tertutup menampilkan gambar lagu dan bar suara yang bergerak mengikuti apa yang Anda dengar. Saat merekam atau fokus, pulau berubah menjadi perekam atau hitungan mundur.",
      source: "README.md Why Lunar: The island shows what's happening",
    },
    {
      title: "Pill atau Notch",
      body: "Pakai pill yang mengambang, atau ganti ke Notch yang menempel di tepi atas layar dan terbuka menjadi panel lebar dengan halaman sebagai tab.",
      source: "README.md Why Lunar: Pill or Notch",
    },
    {
      title: "Terjemahkan layar di tempat",
      body: "Tekan Ctrl+Alt+T dan Lunar membaca teks di layar lalu menampilkannya dalam bahasa Inggris, Indonesia, atau Jepang, tepat di atas teks aslinya. Layar dibaca di PC Anda dan hanya teksnya yang dikirim, dengan kunci Microsoft Azure gratis milik Anda, setelah Anda mengizinkan sekali.",
      source: "README.md Why Lunar: Translate your screen in place",
    },
    {
      title: "Privat sejak awal",
      body: "File, catatan, dan rekaman Anda tidak pernah meninggalkan PC. Tidak ada akun Lunar dan tidak ada telemetri. Log tidak pernah berisi nama file, isi catatan, audio, atau apa yang Anda dengarkan.",
      source: "README.md Why Lunar: Private by design",
    },
    {
      title: "Ringan sekali",
      body: "Saat diam, Lunar memakai sekitar 0,04 % CPU dan sekitar 95 MB memori pribadi, diukur selama lima menit di laptop biasa.",
      source: "README.md Why Lunar: Light as a feather",
    },
    {
      title: "Memperbarui diri, dengan aman",
      body: "Saat ada versi baru, Lunar bertanya: Instal sekarang atau Nanti. Lunar hanya memasang unduhan yang sidik jarinya cocok dengan rilis resmi. Pengecekan ini bisa dimatikan.",
      source: "README.md Why Lunar: Keeps itself up to date",
    },
    {
      title: "Untuk semua orang",
      body: "Dukungan keyboard penuh, nama untuk pembaca layar, tema Kontras Tinggi, dan gerakan yang dikurangi. Tema gelap dan terang. Bahasa Inggris dan Bahasa Indonesia.",
      source: "README.md Why Lunar: Made for everyone",
    },
  ],

  pages: [
    {
      id: "system",
      name: "Sistem",
      body: "Jam, volume dan senyap, kecerahan layar, Wi-Fi dan Bluetooth, serta tombol Terjemahkan. Semuanya mengikuti perubahan yang Anda buat di tempat lain, misalnya tombol volume di keyboard.",
      source: "README.md What's inside: System",
    },
    {
      id: "media",
      name: "Media",
      body: "Apa yang sedang diputar di aplikasi mana pun yang mendukung kontrol media Windows, dengan gambar, putar dan jeda, sebelumnya, berikutnya, penggeseran posisi, dan pindah antar aplikasi.",
      source: "README.md What's inside: Media",
    },
    {
      id: "pomodoro",
      name: "Pomodoro",
      body: "Timer fokus 1 sampai 180 menit dengan pilihan cepat. Jangan Ganggu menyala selama berjalan, hitungan mundur tampil di pulau yang tertutup, dan telur pixel-art melompat saat Anda fokus lalu pecah menjadi telur ceplok di akhir.",
      source: "README.md What's inside: Pomodoro",
    },
    {
      id: "converter",
      name: "Pengonversi berkas",
      body: "Konversi antara PNG, JPG, dan PDF, atau ubah gambar menjadi dokumen Word, sepenuhnya tanpa internet. Masukkan banyak file sekaligus, ikuti antreannya, batalkan atau coba lagi. File asli tidak pernah diubah.",
      source: "README.md What's inside: File converter",
    },
    {
      id: "notes",
      name: "Catatan dan Rekaman",
      body: "Catatan teks singkat yang tersimpan saat Anda mengetik, dengan Urungkan setelah menghapus. Juga perekam suara: pilih mikrofon atau biarkan Windows memilih, dan dapatkan file MP3 di Music\\Lunar Recordings atau folder pilihan Anda.",
      source: "README.md What's inside: Notes & Records",
    },
    {
      id: "usage",
      name: "Pemakaian",
      body: "Batas 5 jam dan mingguan Claude Anda dalam sekilas, dengan pemberitahuan kecil saat batas direset. Mati sampai Anda menyalakannya.",
      source: "README.md What's inside: Usage",
    },
  ],

  whatsNew: {
    version: "1.1.1",
    items: [
      {
        title: "Musik di pulau",
        body: "Gambar lagu dan bar suara yang bergerak di pulau yang tertutup saat musik atau video diputar.",
        source: "README.md New in 1.1.1; release notes v1.1.1",
      },
      {
        title: "Gaya pulau",
        body: "Pill yang mengambang, atau Notch di tepi atas yang terbuka menjadi panel lebar dengan tab.",
        source: "README.md New in 1.1.1; release notes v1.1.1",
      },
      {
        title: "Terjemahan layar",
        body: "Baca layar yang aktif dan lihat hasilnya dalam bahasa Inggris, Indonesia, atau Jepang, di atas teks aslinya. Ctrl+Alt+T; perlu kunci Azure Translator gratis milik Anda sendiri.",
        source: "README.md New in 1.1.1; release notes v1.1.1",
      },
      {
        title: "Tampilan Pengaturan yang lebih lembut",
        body: "Warna yang lebih tenang untuk jendela Pengaturan dan kepala halaman Sistem yang lebih rapi.",
        source: "README.md New in 1.1.1; release notes v1.1.1 Also",
      },
    ],
  },

  privacy: {
    summary:
      "Semuanya berjalan di PC Anda. File, catatan, dan rekaman tidak pernah diunggah. Tidak ada akun dan tidak ada telemetri. Log lokal mencatat apa yang terjadi, tidak pernah apa yang sedang Anda kerjakan.",
    waysTitle: "Lunar terhubung ke internet hanya dengan tiga cara",
    ways: [
      {
        title: "Pengecekan pembaruan harian",
        body: "Sekali sehari Lunar bertanya ke GitHub apakah ada versi baru. GitHub melihat bahwa ada yang bertanya. Bisa dimatikan di Pengaturan → Update.",
        source: "README.md Your privacy; PRIVACY.md Update check",
      },
      {
        title: "Halaman Pemakaian",
        body: "Opsional, dan hanya setelah Anda menyalakannya.",
        source: "README.md Your privacy; PRIVACY.md Summary",
      },
      {
        title: "Terjemahan layar",
        body: "Hanya saat Anda meminta terjemahan. Yang dikirim hanya teks yang dikenali, tidak pernah gambar layar, ke Microsoft Azure AI Translator dengan kunci Anda sendiri, dan hanya setelah Anda mengizinkan sekali. Tidak ada yang disimpan.",
        source: "README.md Your privacy; PRIVACY.md Screen translation",
      },
    ],
    never:
      "Tidak pernah dicatat: nama dan lokasi file, isi dokumen, isi catatan, audio rekaman, nama jaringan Wi-Fi, nama perangkat Bluetooth, atau apa yang Anda dengarkan.",
    recordings:
      "Lunar membuka mikrofon hanya saat Anda menekan Rekam, dan Windows menampilkan tanda mikrofonnya sendiri. Beri tahu orang lain sebelum Anda merekam mereka.",
    thisSite:
      "Situs ini tidak memakai cookie, analytics, atau skrip pihak ketiga. Situs ini tidak memuat apa pun selain dari dirinya sendiri.",
    source: "README.md Your privacy; PRIVACY.md Summary, What is never logged, Recordings",
  },

  install: {
    steps: [
      "Unduh Lunar.msi dari rilis terbaru.",
      "Jalankan. Lunar terpasang hanya untuk akun Windows Anda dan tidak perlu hak administrator. Bilah progres singkat muncul lalu tertutup sendiri setelah selesai.",
      "Buka Lunar dari menu Start. Mata Lunar muncul di bagian atas layar.",
    ],
    smartScreen:
      "Installer belum ditandatangani (code-signed), jadi Windows SmartScreen mungkin menampilkan “Windows protected your PC”. Pilih More info, lalu Run anyway.",
    verify:
      "Untuk memeriksa unduhan, bandingkan hasil perintah ini dengan file Lunar.msi.sha256 di halaman rilis:",
    verifyCommand: "Get-FileHash .\\Lunar.msi",
    updating:
      "Lunar menawarkan versi baru dengan sendirinya. Dari versi 1.0.5 atau lebih lama, pasang Lunar.msi yang baru secara manual sekali saja. Pengaturan, catatan, dan rekaman Anda selalu tetap ada.",
    removing:
      "Pengaturan Windows → Aplikasi → Lunar. Lunar bertanya apakah pengaturan dan catatannya ikut dihapus. Rekaman Anda tetap di folder Anda sendiri.",
    requirements:
      "Windows 11, 64-bit. Tidak ada yang perlu dipasang lagi, karena runtime .NET sudah disertakan.",
    source: "README.md Install",
  },

  limits: [
    {
      title: "Hanya Windows 11",
      body: "Lunar berjalan di Windows 11, 64-bit. Windows 10 tidak didukung.",
      source: "README.md Good to know; release notes v1.0.6 Requirements",
    },
    {
      title: "Word ke PDF belum ada",
      body: "Dokumen Word bisa dibuat dari gambar, tetapi file Word belum bisa dikonversi ke PDF.",
      source: "README.md Good to know",
    },
    {
      title: "Beberapa tombol bergantung pada Windows",
      body: "Tombol Wi-Fi dan Bluetooth, penggeseran posisi media, dan kecerahan monitor eksternal bergantung pada Windows, driver, aplikasi media, dan monitornya. Jika sesuatu tidak diizinkan, Lunar mengatakannya dan membuka pengaturan Windows yang tepat.",
      source: "README.md Good to know",
    },
    {
      title: "Jangan Ganggu memakai fitur yang tidak didokumentasikan",
      body: "Lunar menyalakan Jangan Ganggu lewat fitur Windows yang tidak didokumentasikan Microsoft. Jika Windows menolak, timer tetap berjalan dan memberi tahu Anda.",
      source: "README.md Good to know",
    },
    {
      title: "Anda juga tidak bisa men-screenshot Lunar",
      body: "Karena tak terlihat oleh tangkapan layar, screenshot Anda sendiri juga tidak menampilkan Lunar.",
      source: "README.md Good to know",
    },
    {
      title: "Terjemahan perlu kunci sendiri",
      body: "Terjemahan layar perlu kunci Azure Translator milik Anda (paket gratis Microsoft) dan koneksi internet. Bahasa Jepang perlu bahasa Jepang Windows untuk membaca. Ini terjemahan mesin dan bisa salah.",
      source: "README.md Good to know",
    },
    {
      title: "Halaman Pemakaian bisa berhenti bekerja",
      body: "Halaman ini memakai alamat Anthropic yang tidak didokumentasikan secara resmi. Lunar tidak berafiliasi dengan Anthropic.",
      source: "README.md Good to know",
    },
    {
      title: "Diuji dengan satu monitor",
      body: "Lunar sudah diuji di Windows 11 dengan satu monitor.",
      source: "README.md Good to know",
    },
  ],

  openSource: {
    body: "Lunar gratis dan open source dengan Apache License 2.0. Kode, laporan masalah, dan setiap rilis ada di GitHub.",
    stack: "Ditulis dengan C# di .NET 10 dan WPF. Installer-nya berupa MSI per pengguna.",
    source: "README.md License; For developers",
  },

  faq: [
    {
      question: "Apakah Lunar gratis?",
      answer:
        "Ya. Lunar gratis dan open source dengan Apache License 2.0. Tidak ada akun dan tidak ada yang perlu dibeli.",
      source: "README.md License; Your privacy",
    },
    {
      question: "Kenapa Windows memberi peringatan saat memasang?",
      answer:
        "Installer belum ditandatangani (code-signed), jadi SmartScreen mungkin menampilkan “Windows protected your PC”. Pilih More info, lalu Run anyway. Anda bisa memeriksa unduhan dengan file SHA-256 di halaman rilis terlebih dahulu.",
      source: "README.md Install",
    },
    {
      question: "Apakah bisa di Windows 10?",
      answer: "Tidak. Lunar memerlukan Windows 11, 64-bit.",
      source: "README.md Good to know; release notes v1.0.6 Requirements",
    },
    {
      question: "Kenapa Lunar tidak bisa di-screenshot?",
      answer:
        "Memang disengaja. Semua jendela Lunar dikecualikan dari tangkapan layar, sehingga tidak ikut saat Anda berbagi layar atau merekam. Screenshot Anda sendiri juga tidak menampilkannya.",
      source: "README.md Why Lunar; Good to know",
    },
    {
      question: "Apakah Lunar mengirim data saya ke mana pun?",
      answer:
        "File, catatan, dan rekaman Anda tidak pernah meninggalkan PC. Lunar hanya terhubung ke internet untuk pengecekan pembaruan harian (bisa dimatikan), halaman Pemakaian yang opsional, dan terjemahan layar saat Anda memintanya.",
      source: "README.md Your privacy",
    },
    {
      question: "Apakah terjemahan layar berbayar?",
      answer:
        "Lunar memakai kunci Microsoft Azure Translator milik Anda sendiri, yang bisa didapat dengan paket gratis Microsoft. Jatah gratis bulanannya ditentukan oleh Microsoft, bukan oleh Lunar.",
      source: "README.md Good to know; release notes v1.1.1 Known limits",
    },
    {
      question: "Bagaimana cara memperbarui atau menghapus Lunar?",
      answer:
        "Lunar menawarkan versi baru dengan sendirinya dan tetap menyimpan pengaturan, catatan, dan rekaman Anda. Untuk menghapus, buka Pengaturan Windows → Aplikasi → Lunar; rekaman Anda tetap di folder Anda sendiri.",
      source: "README.md Install",
    },
    {
      question: "Apakah Lunar dibuat oleh Apple atau Anthropic?",
      answer:
        "Bukan. “Dynamic Island” menggambarkan ide sebuah pill kecil yang terbuka menjadi kontrol. Lunar adalah proyek independen dan tidak berafiliasi dengan Apple atau Anthropic.",
      source: "README.md Good to know (Anthropic); site policy (Apple)",
    },
  ],

  changelog: [
    {
      version: "1.1.1",
      date: "2026-11-18",
      items: [
        "Musik di pulau: gambar lagu dan bar suara yang bergerak mengikuti apa yang Anda dengar.",
        "Gaya pulau: Pill, atau Notch di tepi atas yang terbuka menjadi panel lebar dengan tab.",
        "Terjemahan layar ke bahasa Inggris, Indonesia, atau Jepang dengan Ctrl+Alt+T, memakai kunci Azure gratis milik Anda.",
        "Warna yang lebih lembut untuk jendela Pengaturan dan kepala halaman Sistem yang lebih rapi.",
      ],
      source: "release notes v1.1.1",
    },
    {
      version: "1.0.7",
      date: "2026-11-12",
      items: [
        "Perekam suara bekerja dengan lebih banyak mikrofon, misalnya beberapa susunan mikrofon laptop.",
        "Pesan yang lebih jelas, dengan tombol ke pengaturan mikrofon, saat Windows menolak sebuah mikrofon.",
      ],
      source: "release notes v1.0.7",
    },
    {
      version: "1.0.6",
      date: "2026-11-11",
      items: [
        "Pomodoro: timer fokus 1 sampai 180 menit yang menyalakan Jangan Ganggu, dengan telur pixel-art.",
        "Perekam suara di halaman Catatan, dengan file MP3 dan garis suara di pulau yang tertutup.",
        "Pengecekan pembaruan harian yang menawarkan Instal sekarang atau Nanti dan memeriksa SHA-256 unduhannya.",
        "Perbaikan untuk mata, gambar di halaman Media, dan garis tepi tombol.",
      ],
      source: "release notes v1.0.6",
    },
    {
      version: "1.0.5",
      date: "2026-11-07",
      items: [
        "Kecerahan layar di halaman Sistem.",
        "Catatan: catatan teks yang tersimpan saat Anda mengetik, dengan Urungkan setelah menghapus.",
        "Tidak ikut terbagi saat berbagi layar, screenshot, dan rekaman.",
      ],
      source: "release notes v1.0.5",
    },
  ],
} satisfies SiteContent;
