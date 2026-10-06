# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/id/1.1.0/), Versi [SemVer](https://semver.org/lang/id/).

## [Unreleased]

### Revisi
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
  ketiga template: Laporan Lengkap, Ringkas, dan Epikrisis.
- Ketergantungan JsBarcode diganti `qrcode-generator` 1.4.4 (MIT).
- **Perbaikan:** `Perawat Sirkuler 2` dan `Monitoring` sebelumnya tidak
  tercetak pada laporan. Ketiganya kini muncul di Laporan Lengkap, dan
  ringkas/epikrisis memakai helper `sirkulerHTML()` yang hanya menampilkan
  perawat sirkuler yang terisi.

### Ditambahkan
- Halaman depan (`index.html`) sebagai pintu masuk pilihan form.
- `form-input-simple.html` — form laporan cathlab versi ringkas.
- `form-input-lengkap.html` — form laporan cathlab versi lengkap (14 section,
  timeline hemodinamik, registry obat & stent, komplikasi terstruktur, 3 template
  cetak, ekspor/impor JSON, riwayat versi).
- `form-guide.html` — tur interaktif memakai **Driver.js** di atas form asli.
- `form-docs.html` — dokumentasi field lengkap dengan skenario error.
- `form-walkthrough.html` — pengisian bertahap 7 step dengan validasi per step.
- `simrs-guide.html` — panduan integrasi SIMRS (endpoint, pemetaan field,
  konfigurasi, pengujian koneksi, catatan keamanan).
- **Barcode laporan** (Code 128/39/EAN13) menggantikan gambar tanda tangan,
  dibuat otomatis dari No. RM + tanggal dan tercetak sebagai SVG inline.
- Integrasi master data **SIMRS**: `fetchPasien()` / `fetchDokter()`, konfigurasi
  `SIMRS_CONFIG`, pemetaan `FIELD_MAP`, normalisasi telepon & tanggal, timeout
  via `AbortController`, fallback data lokal, serta tombol **Uji koneksi**.
- `js/form-schema.js` sebagai sumber tunggal definisi field + mesin validasi.
- Driver.js dan JsBarcode di-vendor lokal (`js/lib`, `css/lib`) agar tidak
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
