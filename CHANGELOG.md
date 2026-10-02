# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/id/1.1.0/), Versi [SemVer](https://semver.org/lang/id/).

## [Unreleased]

### Ditambahkan
- Halaman depan (`index.html`) sebagai pintu masuk pilihan form.
- `form-input-simple.html` — form laporan cathlab versi ringkas.
- `form-input-lengkap.html` — form laporan cathlab versi lengkap (14 section,
  timeline hemodinamik, registry obat & stent, komplikasi terstruktur, 3 template
  cetak, ekspor/impor JSON, riwayat versi).
- `form-guide.html` — tur interaktif memakai **Driver.js** di atas form asli
  (highlight field, tooltip kontekstual, validasi real-time, navigasi
  Next/Previous/Skip, progress).
- `form-docs.html` — dokumentasi field: tipe data, format diterima, pola regex,
  validasi, contoh input, tips, dan skenario error.
- `form-walkthrough.html` — pengisian bertahap 7 step, progress per step,
  validasi sebelum lanjut, ringkasan + ekspor JSON.
- `js/form-schema.js` sebagai sumber tunggal definisi field + mesin validasi
  (dipakai ketiga halaman dokumentasi).
- `js/docs-common.js`, `css/docs.css`, serta Driver.js di `js/lib` & `css/lib`.
- `.nojekyll` agar GitHub Pages menyajikan berkas statis apa adanya.

### Perbaikan
- Key `localStorage` form Lengkap diubah dari `cl2:cur` menjadi `cl2:lengkap`
  agar tidak bentrok dengan form Simple.
- Keselarasan konten: seluruh `data-k` pada kedua form kini terdokumentasi
  ( diverifikasi otomatis terhadap isi form).
