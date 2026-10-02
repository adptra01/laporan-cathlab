/* =========================================================
   CATHLAB FORM SCHEMA  —  single source of truth
   Dipakai oleh: form-guide.html, form-docs.html, form-walkthrough.html
   Selaras dengan: form-input-simple.html & form-input-lengkap.html
   ========================================================= */
(function (global) {
  'use strict';

  /* ---------- validator dasar ---------- */
  var V = {
    required: function (v) {
      return (v !== null && v !== undefined && String(v).trim() !== '') ? null : 'Wajib diisi';
    },
    text: function (v, o) {
      o = o || {};
      var s = String(v == null ? '' : v).trim();
      var res = V.required(s);
      if (res) return res;
      if (o.pattern && !new RegExp(o.pattern).test(s)) return o.patternMsg || 'Format tidak sesuai';
      if (o.min && s.length < o.min) return 'Minimal ' + o.min + ' karakter';
      if (o.max && s.length > o.max) return 'Maksimal ' + o.max + ' karakter';
      return null;
    },
    number: function (v, o) {
      o = o || {};
      var s = String(v == null ? '' : v).trim();
      var res = V.required(s);
      if (res) return res;
      if (!/^-?\d+([.,]\d+)?$/.test(s)) return 'Hanya angka yang diperbolehkan';
      var n = parseFloat(s.replace(',', '.'));
      if (o.min != null && n < o.min) return 'Nilai minimal ' + o.min;
      if (o.max != null && n > o.max) return 'Nilai maksimal ' + o.max;
      return null;
    },
    date: function (v, o) {
      o = o || {};
      var s = String(v == null ? '' : v).trim();
      var res = V.required(s);
      if (res) return res;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return 'Format tanggal tidak valid (YYYY-MM-DD)';
      var d = new Date(s + 'T00:00:00');
      if (isNaN(d.getTime())) return 'Tanggal tidak valid';
      if (o.notFuture) {
        var today = new Date(); today.setHours(23, 59, 59, 999);
        if (d.getTime() > today.getTime()) return 'Tanggal tidak boleh di masa depan';
      }
      return null;
    },
    time: function (v) {
      var s = String(v == null ? '' : v).trim();
      var res = V.required(s);
      if (res) return res;
      if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(s)) return 'Format waktu harus HH:MM (24 jam)';
      return null;
    },
    oneOf: function (v, list, o) {
      o = o || {};
      var s = String(v == null ? '' : v).trim();
      if (!o.optional) { var res = V.required(s); if (res) return res; }
      if (s === '') return null;
      if (list.indexOf(s) < 0) return 'Pilihan tidak valid';
      return null;
    }
  };

  /* ---------- shortcut tipe ---------- */
  function T(k, label, extra) { return merge({ k: k, label: label, type: 'text' }, extra); }
  function N(k, label, min, max, extra) { return merge({ k: k, label: label, type: 'number', min: min, max: max }, extra); }
  function D(k, label, extra) { return merge({ k: k, label: label, type: 'date' }, extra); }
  function TM(k, label, extra) { return merge({ k: k, label: label, type: 'time' }, extra); }
  function SEL(k, label, options, extra) { return merge({ k: k, label: label, type: 'select', options: options }, extra); }
  function TA(k, label, extra) { return merge({ k: k, label: label, type: 'textarea' }, extra); }
  function merge(a, b) { var o = {}, x; for (x in a) o[x] = a[x]; for (x in b) if (b[x] != null) o[x] = b[x]; return o; }

  var YN = ['Ya', 'Tidak', 'Tidak Perlu'];

  /* =========================================================
     SECTIONS
     f: ['S','L'] = ada di Simple / Lengkap
     ========================================================= */
  var SECTIONS = [
    {
      id: 's1', n: 1, title: 'Pasien & Identitas',
      simpleTitle: '1. Pasien & Tindakan', lengkapTitle: '1. Identitas Pasien',
      desc: 'Identitas dasar pasien sebagai kunci rekam medis. Pada form Lengkap, kolom No. RM dipakai untuk auto-load data pasien dari SIMRS (tekan Enter).',
      fields: [
        T('rm', 'No. RM *', { required: true, pattern: '^[0-9]{4,12}$', patternMsg: 'No. RM harus 4–12 digit angka', min: 4, max: 12, example: '00051563', f: ['S', 'L'], tips: 'Tanpa nol di depan akan gagal. Gunakan No. RM resmi dari rekam medis.', errors: ['Kosong → "No. RM harus diisi" (wajib)', 'Mengandung huruf → "No. RM harus 4–12 digit angka"', 'Lebih dari 12 digit → "Maksimal 12 karakter"'] }),
        T('nama', 'Nama Lengkap *', { required: true, min: 3, max: 80, example: 'DARMAWAN', f: ['S', 'L'], onlyL: true, tips: 'Di form Lengkap kolom ini terisi otomatis setelah No. RM di-enter.', errors: ['Kosong → "Wajib diisi"', '<Kurang 3 karakter → "Minimal 3 karakter"'] }),
        T('reg', 'No. Registrasi', { required: true, min: 6, max: 20, pattern: '^[0-9A-Za-z\\-\\/]+$', patternMsg: 'Hanya angka, huruf, tanda hubung, atau garis miring', example: '2609030130', f: ['S', 'L'], tips: 'Nomor registrasi kunjungan, biasanya berbeda per kunjungan.', errors: ['Kosong (form Lengkap) → "Wajib diisi"', 'Mengandung simbol → format ditolak'] }),
        D('lahir', 'Tanggal Lahir', { example: '1982-07-01', f: ['S', 'L'], tips: 'Format ISO YYYY-MM-DD. Mengubah tanggal lahir otomatis menghitung Umur.', errors: ['Tanggal tidak ada → "Wajib diisi"', 'Format salah → "Format tanggal tidak valid (YYYY-MM-DD)"'] }),
        SEL('jk', 'Jenis Kelamin', ['', 'Laki-laki', 'Perempuan'], { f: ['S', 'L'], example: 'Laki-laki', tips: 'Kosong berarti belum diisi — pilih salah satu.', errors: ['Nilai di luar daftar → "Pilihan tidak valid"'] }),
        T('umur', 'Umur', { example: '44 tahun', f: ['S', 'L'], auto: true, tips: 'Diisi otomatis dari tanggal lahir. Pada form Lengkap bersifat read-only.', errors: [] }),
        SEL('penjamin', 'Penjamin', ['Umum', 'BPJS Kesehatan', 'Asuransi Lain', 'Perusahaan'], { f: ['L'], default: 'BPJS Kesehatan', example: 'BPJS Kesehatan', tips: 'Hanya ada di form Lengkap.', errors: [] }),
        T('dpjpMasuk', 'DPJP Masuk', { max: 60, example: 'dr. Puspita Sari Bustanul, Sp.JP', f: ['L'], tips: 'Ada datalist: nama yang pernah diketik tersimpan sebagai saran.', errors: ['Lebih dari 60 karakter → "Maksimal 60 karakter"'] }),
        T('dpjp', 'DPJP', { max: 60, example: 'dr. Puspita Sari Bustanul, Sp.JP', f: ['S'], tips: 'Nama dokter penanggung jawab pasien / konsultan jantung.', errors: [] }),
        T('alamat', 'Alamat', { max: 200, example: 'Jl. Merdeka No. 45, Jambi', f: ['L'], onlyL: true, tips: 'Read-only di form Lengkap (dari SIMRS).', errors: [] }),
        T('telp', 'No. Telepon', { pattern: '^0\\d{8,13}$', patternMsg: 'Nomor telepon Indonesia diawali 0, 9–14 digit', example: '081234567890', f: ['L'], onlyL: true, tips: 'Untuk kasus pasien rawat inap / ihrem bila perlu dihubungi.', errors: ['Tidak diawali 0 → ditolak format', 'Lebih dari 14 digit → ditolak'] })
      ]
    },
    {
      id: 's2', n: 2, title: 'Jadwal & Jenis Tindakan',
      simpleTitle: '1. Pasien & Tindakan (lanjutan)', lengkapTitle: '2. Admisi & Jadwal',
      desc: 'Waktu pelaksanaan tindakan dan jenis pemeriksaan. Jenis pemeriksaan menentukan apakah diagram koroner tampil satu fase (CAG) atau dua fase (PCI/PPCI, Rotablator, Lain-lain).',
      fields: [
        D('tglMasuk', 'Tanggal Masuk', { example: '2026-09-03', f: ['L'], tips: 'Tanggal pasien masuk RS, boleh lebih dulu dari tanggal tindakan.', errors: ['Tanggal di masa depan → "Tanggal tidak boleh di masa depan"'] }),
        D('masuk', 'Tgl masuk', { example: '2026-09-03', f: ['S'], simpleKey: true, tips: 'Hanya ada di form Simple. Ditampilkan pada tabel identitas di laporan cetak.', errors: ['Format bukan YYYY-MM-DD → ditolak'] }),
        D('tgl', 'Tanggal Tindakan *', { required: true, example: '2026-09-03', f: ['S', 'L'], tips: 'Wajib diisi — dasar kop laporan cetak.', errors: ['Kosong → "Wajib diisi"', 'Tanggal tidak pernah ada → ditolak'] }),
        TM('mulai', 'Jam Mulai', { required: true, example: '23:21', f: ['S', 'L'], tips: 'Format 24 jam HH:MM. Melewati tengah malam tetap valid, mis. 23:21 → 00:20.', errors: ['Kosong (Lengkap) → "Wajib diisi"', '"25:00" → "Format waktu harus HH:MM (24 jam)"'] }),
        TM('selesai', 'Jam Selesai', { example: '00:20', f: ['S', 'L'], tips: 'Boleh lebih kecil dari Jam Mulai bila tindakan melewati tengah malam.', errors: ['Format salah → ditolak'] }),
        D('tglSelesai', 'Tgl Selesai', { example: '2026-09-04', f: ['L'], tips: 'Kosong = otomatis mengikuti tanggal tindakan (khusus tindakan lintas hari).', errors: [] }),
        T('anestesi', 'Lama Anestesi', { max: 30, example: '45 menit', f: ['S', 'L'], tips: 'Tulis satuan eksplisit, mis. "45 menit".', errors: ['Lebih dari 30 karakter → "Maksimal 30 karakter"'] }),
        SEL('kelas', 'Kelas Perawatan', ['', 'VIP', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'ICU', 'HCU'], { f: ['L'], example: 'VIP', tips: 'Tidak memengaruhi perhitungan stent/kontras.', errors: [] }),
        SEL('ruang', 'Ruang / CathLab', ['Cathlab 1', 'Cathlab 2'], { f: ['S', 'L'], default: 'Cathlab 1', example: 'Cathlab 1', tips: 'Muncul di header pratinjau & kop cetak.', errors: [] }),
        SEL('jenis', 'Jenis Pemeriksaan *', ['CAG', 'PCI / PPCI', 'Angiografi', 'FFR', 'IVUS / OCT', 'Rotablator', 'Lain-lain'], { required: true, default: 'PCI / PPCI', example: 'PCI / PPCI', f: ['S', 'L'], tips: 'CAG/Angiografi/FFR/IVUS → 1 diagram. PCI/PPCI, Rotablator, Lain-lain → 2 diagram (PRE & POST). "Lain-lain" memunculkan 2 kolom judul bebas.', errors: ['Kosong → "Wajib diisi"'] }),
        T('labelPre', 'Judul Diagram 1', { max: 40, example: 'PRE PCI', f: ['S', 'L'], depends: 'jenis', tips: 'Hanya tampil bila jenis dua fase. Defaults: "PRE PCI" / "PRE ROTABLATOR".', errors: ['Lebih dari 40 karakter → "Maksimal 40 karakter"'] }),
        T('labelPost', 'Judul Diagram 2', { max: 40, example: 'POST PCI', f: ['S', 'L'], depends: 'jenis', tips: 'Kosong = otomatis "POST".', errors: [] })
      ]
    },
    {
      id: 's3', n: 3, title: 'Klinis & Indikasi',
      simpleTitle: '1. Pasien & Tindakan (diagnosis)', lengkapTitle: '4. Indikasi & Klinis',
      desc: 'Diagnosis, keluhan, dan klasifikasi klinis. Diagnosis pre adalah salah satu field wajib pada form Lengkap.',
      fields: [
        T('pre', 'Diagnosis Pre Tindakan *', { required: true, min: 5, max: 200, example: 'Stemi Anterior Onset 7 Jam', f: ['S'], simpleKey: true, tips: 'Tulis diagnosis singkat sesuai terminology Acceptance (mis. STEMI anterior, NSTEMI).', errors: ['Kosong → "Wajib diisi"', '< 5 karakter → "Minimal 5 karakter"'] }),
        T('diagnosaPre', 'Diagnosis Pre Tindakan *', { required: true, min: 5, max: 200, example: 'STEMI Anterior Onset 7 Jam', f: ['L'], simpleKey: true, tips: 'Dipakai di tabel detail dan Epikrisis.', errors: ['Kosong → "Wajib diisi"'] }),
        T('post', 'Diagnosis Post Tindakan', { max: 200, example: 'STEMI Anterior Onset 7 Jam, Post PPCI 1 DES mid LAD, CAD 1VD', f: ['S'], tips: 'Boleh dikosongkan bila tidak ada perubahan.', errors: [] }),
        TA('indikasi', 'Indikasi Tindakan', { max: 500, example: 'Nyeri dada tipikal, elevasi ST V1–V4', f: ['L'], tips: 'Alasan klinis tindakan (mis. onset STEMI < 12 jam).', errors: [] }),
        T('keluhan', 'Keluhan Utama', { max: 150, example: 'Nyeri dada sejak 7 jam SMRS', f: ['L'], tips: 'Keluhan saat pasien datang (SMRS = sejak masuk ruang sakit).', errors: [] }),
        T('riwayat', 'Riwayat Penyakit', { max: 300, example: 'Hipertensi, DM tipe 2', f: ['L'], tips: 'Komorbid yang relevan dengan tindakan.', errors: [] }),
        TA('obatRutin', 'Obat Rutin', { max: 300, example: 'Amlodipin 10 mg, Metformin 500 mg', f: ['L'], tips: 'Obat home care sebelum admisi.', errors: [] }),
        T('alergi', 'Alergi', { max: 150, default: '-', example: 'Penicillin', f: ['L'], tips: 'Default "-". Wajib diisi jika riwayat alergi bahan kontras.', errors: [] }),
        SEL('killip', 'Killip Class', ['', 'I', 'II', 'III', 'IV'], { f: ['L'], example: 'I', tips: 'Kelas Killip pada sindrom koroner akut.', errors: [] }),
        SEL('ccs', 'CCS Angina Class', ['', 'I', 'II', 'III', 'IV'], { f: ['L'], tips: 'Canadian Cardiovascular Society angina grading.', errors: [] })
      ]
    },
    {
      id: 's4', n: 4, title: 'Pra-Tindakan & Penunjang',
      lengkapTitle: '5. Pra-Tindakan',
      desc: 'Persetujuan, premedikasi, profilaksis, dan hasil pemeriksaan penunjang sebelum tindakan.',
      fields: [
        SEL('consent', 'Informed Consent', ['Ya', 'Tidak', 'Pending'], { f: ['L'], default: 'Ya', example: 'Ya', tips: 'Status persetujuan tindakan. Tidak ada tanda tangan digital di form ini.', errors: [] }),
        SEL('puasa', 'Puasa', YN, { f: ['L'], default: 'Ya', example: 'Ya', tips: 'Puasa 6–8 jam bila kontrast/anesia; pada STEMI bisa "Tidak Perlu".', errors: [] }),
        T('premedikasi', 'Premedikasi', { max: 200, example: 'Aspilet 160 mg, Clopidogrel 300 mg', f: ['L'], tips: 'Bila premedikasi diberikan, catat juga di tabel Obat.', errors: [] }),
        T('profilaksis', 'Profilaksis', { max: 150, example: 'Cefazolin 1 g IV', f: ['L'], tips: 'Antibiotik profilaksis sesuai protokol RS.', errors: [] }),
        N('labHb', 'Hb (g/dL)', 3, 22, { step: 0.1, f: ['L'], example: '13.5', tips: 'Anemia < 8 menjadi pertimbangan transfusi.', errors: ['Di luar 3–22 → "Nilai minimal/maksimal"', 'Teks → "Hanya angka yang diperbolehkan"'] }),
        N('labPlt', 'Trombosit (×10³/µL)', 5, 1000, { f: ['L'], example: '250', tips: '< 50 menjadi bahan pertimbangan antiplatelet.', errors: ['Di luar 5–1000 → ditolak'] }),
        N('labINR', 'INR', 0.5, 9, { step: 0.1, f: ['L'], example: '1.1', tips: '> 1.5 perlu koreksi sebelum antikoagulan.', errors: ['Di luar 0.5–9 → ditolak'] }),
        N('labKreat', 'Kreatinin (mg/dL)', 0.1, 20, { step: 0.1, f: ['L'], example: '1.0', tips: 'Dasar penilaian risiko nefropati kontras.', errors: [] }),
        N('labGDS', 'GDS (mg/dL)', 20, 600, { f: ['L'], example: '145', tips: 'Kadar glukosa darah sesaat.', errors: [] }),
        T('labTrop', 'Troponin I/T', { max: 40, example: '2.5', f: ['L'], tips: 'Boleh berupa angka maupun deskripsi kualitatif ("positif").', errors: [] }),
        TA('egk', 'EKG', { max: 500, example: 'Sinus takikardia, elevasi ST V1–V4', f: ['L'], tips: 'Ringkasan temuan EKG pre-prosedur.', errors: [] }),
        TA('echo', 'Ekokardiografi', { max: 500, example: 'EF 45%, hipokinetik anteroseptal', f: ['L'], tips: 'Fokus pada EF dan pergerakan/kinetik dinding.', errors: [] }),
        T('thorax', 'Foto Thorax', { max: 200, example: 'Kardiomegali ringan', f: ['L'], tips: 'Temuan radiologi toraks.', errors: [] })
      ]
    },
    {
      id: 's5', n: 5, title: 'Tim Operator',
      simpleTitle: '2. Tim, Akses & Vital', lengkapTitle: '3. Tim Operator & Peran',
      desc: 'Nama petugas yang terlibat. Pada form Lengkap, nama yang pernah diketik otomatis tersimpan sebagai saran (roster lokal).',
      fields: [
        T('op', 'Dokter Operator *', { required: true, min: 3, max: 60, example: 'dr. Puspita Sari Bustanul, Sp.JP', f: ['S'], tips: 'Nama dokter yang melakukan tindakan.', errors: ['Kosong → "Wajib diisi"'] }),
        T('operator', 'Dokter Operator *', { required: true, min: 3, max: 60, example: 'dr. Puspita Sari Bustanul, Sp.JP', f: ['L'], tips: 'Sama dengan kolom "Dokter Operator" di form Simple.', errors: ['Kosong → "Wajib diisi"'] }),
        T('operator2', 'Operator 2', { max: 60, example: 'dr. Andi, Sp.JP', f: ['L'], tips: 'Dokter kedua bila tindakan dilakukan bersama.', errors: [] }),
        T('fellow', 'Fellow / Trainee', { max: 60, f: ['L'], tips: 'Peserta didik yang acompañar.', errors: [] }),
        T('resident', 'Resident / PPDS', { max: 60, f: ['L'], tips: 'Residen yang melakukan sebagian tindakan.', errors: [] }),
        T('asisten', 'Asisten / Scrub', { max: 60, example: 'Ginda Sorip Naposo, Amd.Kep', f: ['S', 'L'], tips: 'Perawat scrub di meja steril.', errors: [] }),
        T('perawat', 'Perawat Sirkuler', { max: 60, example: 'ADE, Am.Kep', f: ['S', 'L'], tips: 'Perawat sirkuler di luar field steril.', errors: [] }),
        T('monitoring', 'Monitoring', { max: 60, f: ['L'], tips: 'Petugas monitor hemodinamik.', errors: [] }),
        T('kolim', 'Kolimator / Radiografer', { max: 60, example: 'Marlengga', f: ['S', 'L'], tips: 'Peng operator cathlab / radiografer pencatat.', errors: [] })
      ]
    },
    {
      id: 's6', n: 6, title: 'Akses Vaskular',
      simpleTitle: '2. Tim, Akses & Vital (akses)', lengkapTitle: '6. Akses Vaskular',
      desc: 'Lokasi puncture. Form Simple memakai tombol pilihan (chips) satu akses; form Lengkap memakai tabel yang mendukung beberapa lokasi akses sekaligus.',
      special: true, specialKey: 'akses',
      fields: [
        { k: 'akses', label: 'Tempat masuk *', type: 'choice', required: true, f: ['S'], options: ['Radialis kanan', 'Radialis kiri', 'Brachialis', 'Femoral kanan', 'Femoral kiri'], example: 'Radialis kanan', tips: 'Klik tombol untuk memilih. Tombol aktif berubah warna aksen (hijau tua).', errors: ['Belum ada tombol aktif → field dianggap kosong pada narasi otomatis'] },
        { k: 'aksesTbl', label: 'Tabel Akses (multi-site)', type: 'table', f: ['L'], columns: ['Site', 'Sheath (F)', 'Lokasi Detail', 'Anestesi Lokal', 'Komplikasi Lokal'], example: 'Radialis kanan | 6 | arteri radialis dextra | Lidokain 2% | -', tips: 'Tombol "+ Tambah Akses" menambah baris baru; ✕ menghapus baris.', errors: ['Sheath bukan angka → "Hanya angka yang diperbolehkan"', 'Minimal satu baris untuk laporan bermakna (indikator warn di nav)'] },
        N('sheath', 'Sheath (F)', 3, 12, { f: ['S'], simpleKey: true, example: '6', tips: 'Ukuran sheath arteri masuk. Hanya ada di form Simple (form Lengkap memakai kolom sheath per baris akses).', errors: ['Di luar 3–12F → ditolak', 'Bukan angka → "Hanya angka yang diperbolehkan"'] }),
        T('kat_diag', 'Kateter Diagnostik', { max: 60, example: 'TIG 3.5/5F', f: ['S'], simpleKey: true, tips: 'Nama & ukuran kateter diagnostik. Hanya ada di form Simple.', errors: [] }),
        T('kat_guide', 'Guiding Catheter', { max: 60, example: 'EBU 3.5/6F', f: ['S'], simpleKey: true, tips: 'Nama & ukuran guiding catheter. Hanya ada di form Simple.', errors: [] })
      ]
    },
    {
      id: 's7', n: 7, title: 'Hemodinamik & Vital',
      simpleTitle: '2. Tim, Akses & Vital (vital)', lengkapTitle: '7. Hemodinamik & Vital',
      desc: 'Tanda-tanda vital selama tindakan. Form Lengkap menyimpan timeline pengukuran (waktu, TD, HR, RR, SpO₂, suhu); nilai terakhir otomatis disalin ke ringkasan.',
      special: true, specialKey: 'vitalTl',
      fields: [
        T('td', 'TD (mmHg)', { max: 20, example: '130/70', f: ['S'], tips: 'Format "sistol/diastol", mis. 130/70. Pada form Lengkap tidak ada kolom manual — nilai diambil dari baris TERAKHIR tabel timeline vital.', errors: ['Bukan pola X/Y → "Format tidak sesuai"'] }),
        T('hr', 'HR (bpm)', { max: 10, example: '76', f: ['S'], tips: 'Nilai positif, mis. 76. Form Lengkap: otomatis dari timeline vital.', errors: ['Teks → "Hanya angka yang diperbolehkan"'] }),
        T('rr', 'RR (x/mnt)', { max: 10, example: '26', f: ['S'], tips: 'Frekuensi napas per menit. Form Lengkap: otomatis dari timeline vital.', errors: [] }),
        T('suhu', 'Suhu (°C)', { max: 10, example: '36.6', f: ['S'], tips: 'Gunakan titik desimal. Form Lengkap: otomatis dari timeline vital.', errors: ['"36,6" → "Hanya angka yang diperbolehkan"'] }),
        T('spo2', 'SpO₂ (%)', { max: 10, example: '98', f: ['L'], virtual: true, tips: 'Tidak ada kolom input manual di kedua form — terisi otomatis dari baris timeline vital terakhir, lalu dicetak pada tabel tanda vital laporan.', errors: [] }),
        T('urine', 'Urine Total (cc)', { max: 10, example: '100', f: ['S', 'L'], tips: 'Total urine selama tindakan, penting untuk 평가 kontrast.', errors: [] }),
        SEL('dom', 'Dominansi Koroner', ['Right', 'Left', 'Co-dominant'], { f: ['L'], default: 'Right', example: 'Right', tips: 'Memengaruhi narasi angiografi otomatis.', errors: [] }),
        SEL('timiPre', 'TIMI Flow Awal', ['', '0', '1', '2', '3'], { f: ['L'], example: '1', tips: 'TIMI flow sebelum intervensi.', errors: [] }),
        SEL('timiPost', 'TIMI Flow Akhir', ['', '0', '1', '2', '3'], { f: ['L'], example: '3', tips: 'TIMI flow setelah stenting.', errors: [] })
      ]
    },
    {
      id: 's8', n: 8, title: 'Kontras & Obat',
      simpleTitle: '2. Tim, Akses & Vital (kontras/obat)', lengkapTitle: '8. Obat & Media Kontras',
      desc: 'Media kontras dan obat yang diberikan. Form Lengkap mencatat obat per waktu dengan template cepat (Heparin, NTG, Tirofiban, Aspilet, Clopidogrel).',
      fields: [
        T('kontras', 'Jenis Kontras', { max: 60, default: 'Hexiol', example: 'Hexiol', f: ['S', 'L'], tips: 'Nama dagang jenis kontras, mis. Hexiol / Ultravist.', errors: [] }),
        N('kontras_vol', 'Volume Kontras (cc)', 0, 1000, { f: ['S'], simpleKey: true, example: '150', tips: 'Total volume kontras yang masuk.', errors: ['Di luar 0–1000 → ditolak', 'Teks → "Hanya angka yang diperbolehkan"'] }),
        N('kontrasVol', 'Volume Kontras (cc) *', 0, 1000, { f: ['L'], example: '150', tips: 'Wajib terisi di form Lengkap (indikator merah pada nav bila kosong).', errors: ['Kosong → "Wajib diisi"'] }),
        N('radiasi', 'Total Radiasi (mGy)', 0, 50000, { f: ['S', 'L'], example: '413', tips: 'Dose area terukur di cathlab.', errors: [] }),
        N('darah', 'Total Perdarahan (cc)', 0, 5000, { f: ['S', 'L'], example: '30', tips: 'Perkiraan kehilangan darah selama tindakan.', errors: [] }),
        N('hep', 'Heparin IA (IU)', 0, 50000, { f: ['S'], example: '3300', tips: 'Dosis antikoagulan intra-arteri.', errors: [] }),
        N('ntg', 'NTG IA (mcg)', 0, 10000, { f: ['S'], example: '300', tips: 'Nitroglycerin intra-arteri.', errors: [] }),
        { k: 'medsTbl', label: 'Tabel Obat (tercatat per waktu)', type: 'table', f: ['L'], columns: ['Waktu', 'Nama Obat', 'Dosis', 'Rute', 'Keterangan'], example: '23:22 | Heparin | 3300 IU | IA | -', tips: 'Tombol template mengisi nama, rute default; waktu terisi jam saat ini.', errors: ['Nama obat kosong → baris tidak terbaca di narasi otomatis'] }
      ]
    },
    {
      id: 's9', n: 9, title: 'Diagram Koroner',
      simpleTitle: '3. Diagram Koroner', lengkapTitle: '9. Diagram Koroner (AHA 16-Segmen)',
      desc: 'Klik segmen pada diagram untuk menandai status. Simple: 16 segmen. Lengkap: AHA 16-segmen bernomor (1–16, 16a, 16b) plus tombol Semua Normal / Bersihkan / Salin PRE→POST.',
      special: true, specialKey: 'diagram',
      fields: [
        { k: 'diagram', label: 'Diagram Segmen', type: 'diagram', required: true, f: ['S', 'L'], options: ['Normal', 'Stenosis', 'Stent', 'Trombus', 'Oklusi total'], example: 'LAD mid → Stenosis 95–99% (catatan: thrombus gr IV, TIMI 1–2)', tips: 'Modal: pilih Status → isi Derajat Stenosis (%) bila Stenosis → isi Catatan → Terapkan. "Hapus" membersihkan segmen.', errors: ['Status tidak dipilih → "Pilih status segmen dulu."', 'Stenosis tanpa angka → field p kosong, tabel cetak menampilkan "-"'] }
      ],
      segmentsSimple: ['LM', 'LAD prox', 'LAD mid', 'LAD distal', 'D1', 'D2', 'LCX prox', 'LCX mid', 'LCX distal', 'OM1', 'OM2', 'RCA prox', 'RCA mid', 'RCA distal', 'PDA', 'PLV'],
      segmentsLengkap: [
        ['1', 'RCA prox'], ['2', 'RCA mid'], ['3', 'RCA distal'], ['4', 'PDA'], ['16', 'PLV'], ['16a', 'RPD'], ['16b', 'RPLV'],
        ['5', 'LM'], ['6', 'LAD prox'], ['7', 'LAD mid'], ['8', 'LAD dist'], ['9', 'D1'], ['10', 'D2'],
        ['11', 'LCX prox'], ['12', 'OM1'], ['13', 'LCX mid'], ['14', 'OM2'], ['15', 'LCX dist']
      ]
    },
    {
      id: 's10', n: 10, title: 'Stent & Perangkat',
      simpleTitle: '4. Stent / Perangkat', lengkapTitle: '10. Stent & Devices',
      desc: 'Registry stent. Setiap stent otomatis menandai segmen pada diagram POST sebagai "Stent" (form Lengkap memakai kode AHA, mis. "7 LAD mid").',
      special: true, specialKey: 'stent',
      fields: [
        { k: 'stent', label: 'Data Stent', type: 'table', f: ['S', 'L'], columns: ['Segmen', 'Tipe', 'Merek', 'Dia (mm)', 'Panjang (mm)', 'Tekanan (atm)', 'Post atm', 'No. Lot*', 'Exp.*', 'Direct*'], example: '7 LAD mid | DES | Eternia | 3.0 | 24 | 10 | 12 | ETN2024A | (kosong) | ✓', tips: 'Kolom bertanda * hanya ada di form Lengkap (lot, masa berlaku, direct stenting).', errors: ['Dia/Panjang bukan angka → tabel tampil apa adanya, kolom cetak tetap "-"', 'Segmen tidak ada di daftar → "Pilihan tidak valid"'] }
      ]
    },
    {
      id: 's11', n: 11, title: 'Komplikasi',
      lengkapTitle: '11. Komplikasi & Adverse Events',
      desc: 'Klasifikasi komplikasi per kategori (Akses, Kardiak, Serebrovaskular, Renal, Alergi, Lain). Hanya ada di form Lengkap.',
      special: true, specialKey: 'kompl',
      fields: [
        { k: 'komplikasi', label: 'Status Komplikasi', type: 'select', f: ['L'], options: ['Tidak ada', 'Ada', 'Mungkin ada'], default: 'Tidak ada', example: 'Tidak ada', tips: 'Bila "Ada", narasi otomatis akan menampilkan daftar komplikasi terpilih.', errors: [] },
        { k: 'komplikasiList', label: 'Daftar Komplikasi (chips)', type: 'chips', f: ['L'], options: ['Hematoma', 'Pseudoaneurisma', 'No-reflow', 'Perforasi koroner', 'Stroke iskemik', 'AKI', 'Reaksi kontras berat', 'Mual/muntah'], example: 'Akses::Hematoma, Kardiak::No-reflow', tips: 'Klik chip untuk centang; bisa lebih dari satu.', errors: [] },
        TA('komplikasiCatatan', 'Catatan Komplikasi', { max: 400, example: 'Hematoma kecil di lokasi Radialis kanan, resolves spontan', f: ['L'], tips: 'Diisi manual bila perlu penjelasan tambahan.', errors: [] })
      ]
    },
    {
      id: 's12', n: 12, title: 'Post-Tindakan & Narasi',
      simpleTitle: '5. Narasi & Kesimpulan', lengkapTitle: '12–13. Post-Tindakan, Narasi & Kesimpulan',
      desc: 'Rencana pasca tindakan, narasi otomatis, dan kesimpulan. Narasi disusun ulang otomatis setiap ada perubahan data (kecuali diedit manual).',
      fields: [
        SEL('disposisi', 'Disposisi', ['Rawat inap', 'Rawat jalan', 'Rujuk', 'ICU', 'HCU', 'Pulang atas permintaan sendiri'], { f: ['L'], default: 'Rawat inap', example: 'Rawat inap', tips: 'Status keluar pasien setelah cathlab.', errors: [] }),
        T('followUp', 'Follow-up', { max: 120, example: 'Kontrol 2 minggu di poliklinik jantung', f: ['L'], tips: 'Rencana kontrol berikutnya.', errors: [] }),
        TA('obatPulang', 'Obat Pulang', { max: 600, example: 'Aspilet 80 mg 1×1\nClopidogrel 75 mg 1×1\nAtorvastatin 40 mg 1×1', f: ['L'], tips: 'Satu obat per baris; dicetak apa adanya di laporan.', errors: [] }),
        TA('edukasi', 'Edukasi Pasien', { max: 600, example: 'Diet rendah garam dan lemak, aktivitas bertahap', f: ['L'], tips: 'Edukasi gaya hidup / tanda bahaya.', errors: [] }),
        TA('narasi', 'Narasi Tindakan', { max: 4000, f: ['S', 'L'], auto: true, example: '1. Tindakan antiseptik di daerah radialis kanan. 2. Dilakukan anestesi …', tips: 'Auto-generated. Tombol "Susun ulang narasi otomatis" mengembalikan narasi ke versi otomatis; label "(narasi diedit manual)" muncul bila diedit.', errors: [] }),
        T('kesimpulan', 'Kesimpulan *', { required: true, min: 3, max: 300, f: ['S', 'L'], example: 'CAD 1VD, post PPCI 1 DES di mid LAD', tips: 'Tombol "Auto" menghitung CAD xVD dari segmen dengan stenosis ≥50% / CTO / trombus / stent.', errors: ['Kosong → "Wajib diisi"', '< 3 karakter → "Minimal 3 karakter"'] })
      ]
    },
    {
      id: 's13', n: 13, title: 'Tembusan & Tanda Tangan',
      simpleTitle: '6. Tanda Tangan', lengkapTitle: '14. Tembusan & TTD',
      desc: 'Distribusi laporan dan tanda tangan DPJP. Tanda tangan berupa gambar (PNG/JPG) yang disimpan di browser — tidak diunggah ke server.',
      fields: [
        D('ttd_tgl', 'Tanggal TTD', { f: ['S'], simpleKey: true, example: '2026-09-04', tips: 'Default = hari ini.', errors: ['Tanggal tidak valid → ditolak'] }),
        D('ttdTgl', 'Tanggal TTD', { f: ['L'], example: '2026-09-04', tips: 'Default = hari ini.', errors: [] }),
        T('ttd_nama', 'Nama DPJP Jantung', { max: 60, f: ['S'], simpleKey: true, example: 'dr. Puspita', tips: 'Dicetak di bawah area tanda tangan.', errors: [] }),
        T('ttdNama', 'Nama DPJP Jantung', { required: true, max: 60, f: ['L'], example: 'dr. Puspita Sari Bustanul, Sp.JP', tips: 'Wajib terisi di form Lengkap.', errors: ['Kosong → "Wajib diisi"'] }),
        { k: 'ttdf', label: 'Gambar Tanda Tangan', type: 'file', f: ['S'], example: 'ttd.png (disarankan transparan)', tips: 'PNG dengan latar transparan menghasilkan hasil cetak terbaik.', errors: ['File bukan gambar → input ditolak browser'] },
        { k: 'tem', label: 'Tembusan', type: 'chips', f: ['L'], options: ['Rekam Medis', 'BPJS', 'Cathlab', 'Operator', 'Pasien'], default: 'Rekam Medis, BPJS, Cathlab, Operator', tips: 'Centang tujuan distribusi; tercetak di footer laporan.', errors: [] }
      ]
    }
  ];

  /* =========================================================
     API
     ========================================================= */
  function validate(field, value) {
    try {
      if (!field) return { ok: true };

      // Nilai kosong: hanya field wajib yang dianggap error.
      // Batas min/max/pola/regex hanya berlaku bila ada isian.
      var empty = (value === null || value === undefined || String(value).trim() === '');
      if (empty) return field.required ? { ok: false, msg: 'Wajib diisi' } : { ok: true };

      if (field.type === 'number') return wrap(V.number(value, field));
      if (field.type === 'date') return wrap(V.date(value, field));
      if (field.type === 'time') return wrap(V.time(value));
      if (field.type === 'select') return wrap(V.oneOf(value, field.options || [], { optional: true }));
      if (field.pattern || field.min || field.max) return wrap(V.text(value, field));
      return { ok: true };
    } catch (e) {
      return { ok: false, msg: 'Validasi gagal: ' + e.message };
    }
  }
  function wrap(res) { return res ? { ok: false, msg: res } : { ok: true }; }

  function fieldByKey(key, form) {
    var code = (form === 'simple') ? 'S' : (form === 'lengkap' ? 'L' : null);
    for (var i = 0; i < SECTIONS.length; i++) {
      var fs = SECTIONS[i].fields;
      for (var j = 0; j < fs.length; j++) {
        if (fs[j].k === key && (!code || !fs[j].f || fs[j].f.indexOf(code) >= 0)) return { field: fs[j], section: SECTIONS[i] };
      }
    }
    return null;
  }
  function sectionsFor(form) {
    var code = (form === 'simple') ? 'S' : 'L';
    return SECTIONS.filter(function (s) {
      return s.fields.some(function (f) { return !f.f || f.f.indexOf(code) >= 0; });
    });
  }

  global.CathlabSchema = {
    V: V, SECTIONS: SECTIONS, validate: validate,
    fieldByKey: fieldByKey, sectionsFor: sectionsFor
  };
})(window);