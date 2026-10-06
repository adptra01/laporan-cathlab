# Laporan Cathlab

Form laporan tindakan cathlab (RSUD H. Abdul Manap, Kota Jambi) plus halaman
dokumentasi, panduan interaktif, dan panduan integrasi SIMRS.

**Live:** https://adptra01.github.io/laporan-cathlab/

## Halaman

| Halaman | File | Fungsi |
|---|---|---|
| Halaman Depan | `index.html` | Pintu masuk, memilih versi form atau dokumentasi |
| Form Laporan | `form-input-lengkap.html` | Form lengkap (14 section): timeline vital, registry alat, komplikasi terstruktur, 3 template cetak, riwayat versi, integrasi SIMRS |
| Interactive Form Guide | `form-guide.html` | Tur Driver.js di atas form: highlight field, tooltip, validasi real-time, Next/Prev/Skip |
| Dokumentasi Form | `form-docs.html` | Referensi tiap field: tipe data, format, regex, validasi, contoh, error |
| Step-by-Step Walkthrough | `form-walkthrough.html` | Pengisian 7 step: progress, validasi per step, dan ringkasan |
| Integrasi SIMRS | `simrs-guide.html` | Master data pasien & dokter: endpoint, pemetaan field, konfigurasi, pengujian |

## Alat & Devices (Stent & Devices)

Tabel alat di section 10 mencatat semua perangkat yang dipakai saat tindakan.
Pilihan tipe mengikuti istilah standar cathlab/PCI:

| Kategori | Pilihan |
|---|---|
| Stent | Stent (DES), Stent (BMS), Stent (DCB), Stent Scaffold |
| Balloon | Balloon (PTCA/Dilatasi), Balloon Occlusion |
| Kawat | Guide Wire (Kawat Pandu) |
| Kateter | Kateter Diagnostik, Kateter Guiding (Pengarah), Kateter Extension (Bridging), Micro Catheter, Kateter IVUS/OCT |
| Lain | Rotational Burr (Atherectomy), Catheter Parking (Wire), Closure Device, Lain-lain |

Hanya device bertipe **Stent** yang otomatis menandai segmen pada diagram POST
sebagai "Stent"; balloon/wire/kateter tidak mengubah status segmen.

Nama segmen pada daftar pilihan dan laporan cetak **tanpa kode angka AHA**
(mis. “LAD mid”, bukan “7 LAD mid”). Kode AHA tetap dipakai sebagai kunci internal.

Tombol **✕** pada setiap baris tabel (akses, vital, obat, alat) menghapus baris
dengan konfirmasi; penanda segmen ikut dibersihkan.

## Tim Operator

Field yang tersedia: Dokter Operator, Asisten/Scrub, **Perawat Sirkuler 1**,
**Perawat Sirkuler 2**, Monitoring, dan Kolimator/Radiografer.

## Barcode (pengganti tanda tangan gambar)

Form gambar tanda tangan telah dihapus. Laporan sekarang memakai **barcode QR
persegi** yang dibuat sepenuhnya otomatis dari `No. RM + tanggal tindakan`
(mis. `CATHLAB-00051563-20260903`).

- **Tanpa form input.** Tidak ada kolom isian, tombol generate, maupun pilihan
  tipe — section 14 "Tembusan & Barcode" hanya berisi Tembusan dan data
  penanda tangan.
- **Otomatis.** Nilainya diturunkan langsung dari No. RM + tanggal tindakan
  setiap kali laporan dicetak, jadi selalu konsisten dengan data pasien.
- **Persegi.** Dipakai QR code (bukan barcode garis memanjang) supaya tetap
  mudah discan dan tidak memakan lebar halaman A4.
- Tercetak sebagai **SVG inline** 28×28 mm pada semua template (Lengkap,
  Ringkas, Epikrisis) sehingga tetap tajam pada resolusi printer apa pun.
- Nilai barcode juga dicetak di bawah QR agar dapat dibaca manusia bila
  pemindaian otomatis tidak tersedia.

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
js/lib/qrcode-generator.js   qrcode-generator 1.4.4 (QR SVG, MIT)
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
