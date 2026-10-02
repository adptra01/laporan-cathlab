/* =========================================================
   Dokumentasi Cathlab — shared helpers
   ========================================================= */
(function (global) {
  'use strict';

  var D = {};

  D.$ = function (s, r) { return (r || document).querySelector(s); };
  D.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  D.esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };

  /* Toast dengan error handling */
  D.toast = function (msg, kind) {
    try {
      var t = document.getElementById('toast');
      if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
      t.textContent = msg;
      t.className = 'show' + (kind ? ' ' + kind : '');
      clearTimeout(D._tt);
      D._tt = setTimeout(function () { t.className = ''; }, 3200);
    } catch (e) {
      /* gagal silently — toast bukan fungsi kritis */
    }
  };

  /* Parser URL query (?form=simple|lengkap) */
  D.formFromQuery = function () {
    try {
      var m = location.search.match(/[?&]form=(simple|lengkap)/i);
      return m ? m[1].toLowerCase() : 'lengkap';
    } catch (e) { return 'lengkap'; }
  };
  D.formFile = function (form) { return form === 'simple' ? 'form-input-simple.html' : 'form-input-lengkap.html'; };

  /* Guard: bungkus agar error tidak mematikan halaman */
  D.guard = function (fn, label) {
    return function () {
      try { return fn.apply(this, arguments); }
      catch (e) {
        console.error('[cathlab-docs] error pada ' + (label || 'handler') + ':', e);
        D.toast('Terjadi kesalahan pada ' + (label || 'aplikasi') + '. Lihat console untuk detail.', 'err');
      }
    };
  };

  /* Iframe aman (file:// memblokir akses lintas dokumen) */
  D.safeFrame = function (frame) {
    try {
      var doc = frame.contentDocument;
      if (!doc || !doc.body) throw new Error('iframe document tidak dapat diakses');
      var probe = doc.createElement('div');
      doc.body.appendChild(probe);
      doc.body.removeChild(probe);
      return { ok: true, doc: doc, win: frame.contentWindow };
    } catch (e) {
      return { ok: false, error: e };
    }
  };

  /* Konversi nilai form (nomor → string) */
  D.val = function (el) {
    if (!el) return '';
    if (el.type === 'checkbox') return el.checked ? el.checked : '';
    return el.value == null ? '' : String(el.value);
  };

  global.Docs = D;
})(window);