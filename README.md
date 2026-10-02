# Laporan Cathlab

Form laporan tindakan cathlab (RSUD H. Abdul Manap, Kota Jambi) plus halaman
dokumentasi, panduan interaktif, dan panduan integrasi SIMRS.

**Live:** https://adptra01.github.io/laporan-cathlab/

## Halaman

| Halaman | File | Fungsi |
|---|---|---|
| Halaman Depan | `index.html` | Pintu masuk, memilih versi form atau dokumentasi |
| Form Simple | `form-input-simple.html` | Form ringkas: identitas, akses, vital, diagram koroner, stent, barcode, cetak A4 |
| Form Lengkap | `form-input-lengkap.html` | Form lengkap (14 section): timeline vital, registry obat & stent, komplikasi terstruktur, 3 template cetak, ekspor/impor JSON, riwayat, integrasi SIMRS |
| Interactive Form Guide | `form-guide.html` | Tur Driver.js di atas form asli: highlight field, tooltip, validasi real-time, Next/Prev/Skip |
| Dokumentasi Form | `form-docs.html` | Referensi tiap field: tipe data, format, regex, validasi, contoh, error |
| Step-by-Step Walkthrough | `form-walkthrough.html` | Pengisian 7 step: progress, validasi per step, ringkasan + JSON |
| Integrasi SIMRS | `simrs-guide.html` | Master data pasien & dokter: endpoint, pemetaan field, konfigurasi, pengujian |

## Barcode (pengganti tanda tangan gambar)

Form gambar tanda tangan telah dihapus. Sekarang laporan memakai **barcode
Code 128** yang dibuat otomatis dari `No. RM + tanggal tindakan`
(mis. `CATHLAB-00051563-20260903`).

- Bertubah otomatis selama belum diedit manual; tombol **Generate barcode**
  mengembalikan ke nilai otomatis.
- Tipe dapat diganti: CODE128 (default), CODE39, EAN13.
- Tercetak sebagai **SVG inline** pada semua template (Lengkap, Ringkas,
  Epikrisis) sehingga tetap tajam.
- Nilai yang tidak cocok dengan format barcode akan menampilkan pesan error dan
  dicetak sebagai teks biasa.

## Integrasi SIMRS

Form Lengkap mengambil master data dari SIMRS. Ringkasnya:

```
GET {BASE_URL}/MASTER/pasien/{no_rm}   → nama, No. Registrasi, tgl lahir, JK,
                                        alamat, telepon, penjamin, DPJP, ruang, kelas
GET {BASE_URL}/MASTER/dokter           → daftar dokter (datalist saran DPJP)
```

Aktifkan lewat console browser (tanpa mengubah file):

```js
localStorage.setItem('cathlab:simrs', JSON.stringify({
  BASE_URL: 'https://simrs.example.go.id/api/rest',
  TOKEN: 'TOKEN_ANDA',
  TIMEOUT_MS: 8000
}));
```

Bila `BASE_URL` kosong, form memakai data lokal (`PASIEN_DB`/`DOKTER_DB`) —
perilaku bawaan di GitHub Pages. Detail lengkap ada di `simrs-guide.html`.

## Berkas pendukung

```
js/form-schema.js     sumber tunggal definisi field + mesin validasi
js/docs-common.js     helper bersama (toast, guard error, akses iframe aman)
js/lib/driver.iife.js Driver.js v1 (vanilla JS, tanpa framework)
js/lib/JsBarcode.all.min.js  JsBarcode 3.11 (barcode SVG)
css/lib/driver.css    stylesheet Driver.js
css/docs.css          tema dokumentasi
.nojekyll             agar GitHub Pages menyajikan file apa adanya
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
