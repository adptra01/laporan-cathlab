# Laporan Cathlab

Form laporan tindakan cathlab (RSUD H. Abdul Manap, Kota Jambi) plus halaman
dokumentasi & panduan interaktif.

## Halaman

| Halaman | File | Fungsi |
|---|---|---|
| Halaman Depan | `index.html` | Pintu masuk, memilih versi form atau dokumentasi |
| Form Simple | `form-input-simple.html` | Form ringkas (6 section), diagram koroner, stent, cetak A4 |
| Form Lengkap | `form-input-lengkap.html` | Form lengkap (14 section): vital timeline, obat, komplikasi, 3 template cetak, ekspor/impor JSON |
| Interactive Form Guide | `form-guide.html` | Tur Driver.js di atas form asli: highlight field, tooltip, validasi real-time, Next/Prev/Skip |
| Dokumentasi Form | `form-docs.html` | Referensi tiap field: tipe data, format, regex, validasi, contoh, skenario error |
| Walkthrough | `form-walkthrough.html` | Pengisian bertahap 7 step dengan progress, validasi per step, ringkasan + JSON |

## Berkas pendukung

```
js/form-schema.js   sumber tunggal definisi field + mesin validasi
js/docs-common.js   helper bersama (toast, guard error, akses iframe aman)
js/lib/driver.iife.js  Driver.js v1 (vanilla JS, tanpa framework)
css/lib/driver.css     stylesheet Driver.js
css/docs.css           tema dokumentasi
.nojekyll              agar GitHub Pages menyajikan file apa adanya
```

## Menjalankan secara lokal

```bash
python3 -m http.server 8000
# buka http://localhost:8000/
```

> Tur pada `form-guide.html` butuh akses ke isi iframe. Browser memblokir ini
> saat halaman dibuka langsung lewat `file://`, jadi gunakan server lokal
> (atau GitHub Pages).

## GitHub Pages

Repo ini statis dan siap di-host di GitHub Pages (branch `main`, folder `/`).
Semua aset memakai path relatif, sehingga tetap bekerja di subpath seperti
`https://<user>.github.io/laporan-cathlab/`.

## Menyunting dokumentasi

Semua field didokumentasikan dari `js/form-schema.js`. Menambah/mengubah
field cukup dilakukan di satu file tersebut; ketiga halaman dokumentasi
ikut menyesuaikan. Pastikan nama kunci (`data-k` pada form) sama persis.
