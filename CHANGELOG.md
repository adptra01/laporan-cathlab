# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/id/1.1.0/), Versi [SemVer](https://semver.org/lang/id/).

## [Unreleased]

### Revisi
- **Halaman depan disederhanakan** — `index.html` kini hanya berisi dua
  tujuan (Isi Laporan Tindakan + Dokumentasi Field) dengan hero rata kiri,
  alur 3 langkah, dan panel ringkasan isi form. Kartu Interactive Guide,
  Walkthrough, dan Integrasi SIMRS dihapus agar tidak membingungkan.
- **Form input dirapikan** — topbar dibuat sticky agar tombol aksi selalu
  terlihat saat menggulir form panjang; tautan Panduan SIMRS yang halamannya
  dihapus dicabut dari topbar (tur interaktif "Panduan" di dalam form tetap
  ada); tombol cetak melayang memakai ikon SVG, bukan emoji.
- **Blok tanda tangan dibetulkan** — QR barcode kini berada di antara jabatan
  dan nama dokter (tempat/tanggal → barcode → nama), bukan di bawah nama.
  Berlaku di kedua template cetak (Lengkap dan Epikrisis).
- **Diagram Koroner ditukar posisi (mirror)** — SISTEM KANAN (RCA/PDA/PLV)
  kini di sebelah kiri dengan flip horizontal (cermin `x' = 520 - x`),
  SISTEM KIRI (LM/LAD/LCX) pindah ke sebelah kanan. Label header ikut
  pindah posisi (`SISTEM KANAN` di x=150, `SISTEM KIRI` di x=400), teks
  label segmen tetap sama. Berlaku di form interaktif (`attachDiagram`)
  maupun cetak (`segSVG`).
- **Form versi ringkas/simple dihapus** — proyek kini memakai satu form utama
  (`form-input-lengkap.html`). Referensi, tautan navigasi, dan dokumentasi
  disinkronkan ulang.
- **Field Tim Operator** — menghapus `Operator 2`, `Fellow / Trainee`, dan
  `Resident / PPDS`; menambahkan `Perawat Sirkuler 2` sehingga ada dua
  perawat sirkuler (`perawat` dan `perawat2`).
- **Tombol ✕ (hapus baris) diperbaiki** — sebelumnya tombol hapus pada tabel
  akses, vital, obat, dan device tidak pernah bekerja karena atribut
  `data-delAk`/`data-delVt`/`data-delMd`/`data-delSt` otomatis menjadi
  lowercase oleh HTML sehingga `dataset.delSt` selalu `undefined`.
  Sekarang ditulis `data-del-ak`/`-vt`/`-md`/`-st`, diberi konfirmasi,
  penanda segmen ikut dibersihkan, dan kolom hapus dibuat sticky.
- **Stent & Devices → Alat & Devices** dengan 16 tipe alat:
  Stent (DES/BMS/DCB/Scaffold), Balloon (PTCA/Dilatasi), Balloon Occlusion,
  Guide Wire (Kawat Pandu), Kateter Diagnostik, Kateter Guiding (Pengarah),
  Kateter Extension (Bridging), Micro Catheter, Kateter IVUS/OCT,
  Rotational Burr (Atherectomy), Catheter Parking (Wire), Closure Device,
  dan Lain-lain. Hanya tipe **Stent** yang menandai segmen pada diagram.
- **Nama segmen tanpa kode angka** pada daftar pilihan dan laporan cetak
  (mis. “LAD mid”, bukan “7 LAD mid”). Kode AHA tetap dipakai sebagai kunci
  internal diagram.

### Barcode
- Bentuk diubah dari barcode garis (CODE128) menjadi **QR code persegi** agar
  tidak memanjang dan tetap mudah discan pada kertas A4.
- Dibuat **sepenuhnya otomatis** dari `No. RM` + tanggal tindakan
  (`CATHLAB-<No. RM>-<YYYYMMDD>`).
- **Form input barcode dihapus**: tidak ada lagi kolom isian, tombol
  “Generate barcode”, maupun pilihan tipe (CODE128/CODE39/EAN13). Section 14
  kembali menjadi “Tembusan & Barcode” dan hanya memuat Tembusan + data TTD.
- Barcode hanya dirender pada hasil cetak/pratinjau (28×28 mm, SVG inline) di
  kedua template: Laporan Lengkap dan Epikrisis.
- Ketergantungan JsBarcode diganti `qrcode-generator` 1.4.4 (MIT).
- **Perbaikan:** `Perawat Sirkuler 2` dan `Monitoring` sebelumnya tidak
  tercetak pada laporan. Ketiganya kini muncul di Laporan Lengkap, dan
  epikrisis memakai helper `sirkulerHTML()` yang hanya menampilkan
  perawat sirkuler yang terisi.

### Dihapus
- **Template cetak Ringkas 1 Halaman** — opsi template pada pratinjau cetak
  kini hanya Laporan Lengkap dan Epikrisis; fungsi `printSummary()` dihapus.
- **Halaman panduan terpisah** — `form-guide.html`, `form-walkthrough.html`,
  dan `simrs-guide.html` dihapus beserta tautannya dari halaman depan,
  navigasi dokumentasi, dan topbar form. Tur interaktif di dalam form
  ("Panduan") dan auto-load SIMRS via No. RM tetap berfungsi.
- **Fungsi Ekspor & Impor JSON** dari form utama: tombol `Ekspor` dan
  `Impor`, input file `#impf`, handler `FileReader`, fungsi `exportJSON()`,
  dan pintasan `Ctrl+E`. Tombol `Salin JSON` dan `Unduh .json` juga dihapus
  dari ringkasan walkthrough. Penyimpanan tetap memakai auto-save `localStorage`
  dengan riwayat versi (maks. 20 snapshot per RM).

### Ditambahkan
- Halaman depan (`index.html`) sebagai pintu masuk pilihan form.
- `form-input-lengkap.html` — form laporan cathlab utama (14 section,
  timeline hemodinamik, registry alat, komplikasi terstruktur, 3 template
  cetak, riwayat versi, integrasi SIMRS).
- `form-docs.html` — dokumentasi field lengkap dengan skenario error.
- **Barcode laporan** (QR otomatis) menggantikan gambar tanda tangan,
  dibuat dari No. RM + tanggal dan tercetak sebagai SVG inline.
- Integrasi master data **SIMRS**: `fetchPasien()` / `fetchDokter()`, konfigurasi
  `SIMRS_CONFIG`, pemetaan `FIELD_MAP`, normalisasi telepon & tanggal, timeout
  via `AbortController`, fallback data lokal, serta tombol **Uji koneksi**.
- `js/form-schema.js` sebagai sumber tunggal definisi field + mesin validasi.
- Driver.js dan qrcode-generator di-vendor lokal (`js/lib`, `css/lib`) agar tidak
  bergantung pada CDN.
- `.nojekyll` agar GitHub Pages menyajikan berkas statis apa adanya.

### Diubah
- Judul section tanda tangan menjadi "Barcode Laporan" / "Tembusan & Barcode".
- Datalist DPJP diisi otomatis dari master dokter SIMRS.
- Field `td`, `hr`, `rr`, `suhu` pada form Lengkap ditandai otomatis dari
  timeline vital (tidak ada kolom manual).
- Normalisasi tanggal lahir mendukung `YYYY-MM-DD` maupun `DD/MM/YYYY`.

### Dihapus
- Form upload gambar tanda tangan pada kedua form (sekarang barcode).
- Key `localStorage` form Lengkap `cl2:cur` → `cl2:lengkap` agar tidak bentrok
  dengan form Simple.

### Perbaikan
- Filter form pada tur memakai kode schema (`S`/`L`), bukan nama panjang.
- Field opsional yang kosong tidak lagi dianggap tidak valid (hanya wajib).
- Indeks pada hook Driver.js bisa basi → diganti `step.data.key`.
- Field kompleks (diagram/tabel) dideteksi dari tipe di schema.
- Barcode dirender ke elemen `<svg>` (JsBarcode hanya menerima SVG, bukan DIV)
  dan fallback ke teks bila format tidak cocok.

### Catatan
- Data master SIMRS hanya dibaca; form tidak pernah menulis ke SIMRS.
- Token API sebaiknya melalui proxy/backend, bukan disimpan di repo publik.
