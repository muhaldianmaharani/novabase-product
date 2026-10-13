# Catatan perubahan Card dan Template Website Editor

Wajib diperbarui setiap pekerjaan. Pisahkan perubahan yang sudah dilakukan dari usulan/handoff. Jangan menghapus histori. Jangan masukkan credential atau data pengguna.

## 2026-10-10 - Aturan dan scope branch

Status: SELESAI DOKUMENTASI.

Branch teramati: `feat/website-editor-frontend` melalui `.git/HEAD`.

| File | Perubahan | Alasan/dampak |
| --- | --- | --- |
| `AGENTS.md` | Menambahkan aturan pelaksana, batas Card/Template, kewajiban warning core dan changelog | Agar developer/agent berikutnya membaca batas kerja dari root repo |
| `docs/WEBSITE_EDITOR_DEVELOPMENT_SCOPE.md` | Mendokumentasikan analisis jalur aktif/legacy, daftar target, area dilindungi, handoff dan verifikasi | Mencegah pelebaran scope dan perubahan base code tanpa penugasan terpisah |
| `docs/WEBSITE_EDITOR_CHANGELOG.md` | Membuat rekam perubahan dan format untuk task berikutnya | Menyediakan jejak perubahan yang dapat direview |

Kode aplikasi, Card, Template, database, dependency dan konfigurasi tidak diubah pada pekerjaan ini.

Verifikasi: membaca struktur repo, sumber editor, registry backend, controller validasi, route, view publik, dan test page management; memastikan path dalam scope tersedia. Tidak menjalankan test runtime karena perubahan hanya dokumentasi. Git CLI tidak tersedia di PATH sesi ini sehingga status/diff Git tidak dapat diverifikasi; identitas branch dibaca dari `.git/HEAD`.

Warning/handoff: ID Template baru dan perluasan schema/jenis Card berpotensi memerlukan registrasi/validasi core. Ini temuan batas arsitektur, bukan permintaan core yang sedang dieksekusi. Belum ada task implementasi atau perubahan core yang diajukan.

## 2026-10-10 - Instalasi dependency dan runtime lokal

Status: SELESAI SETUP LOKAL.

Otorisasi: pemilik repo secara eksplisit meminta pemasangan seluruh dependency sesuai versi Laravel repo agar aplikasi dapat langsung dijalankan. Pengecualian ini khusus setup; scope fitur tetap Card/Template.

| File/area | Perubahan aktual | Alasan/dampak |
| --- | --- | --- |
| `composer.phar`, `vendor/` (diabaikan Git) | Composer 2.10.3 dan 111 package PHP termasuk dev dependency dipasang dari composer.lock | Laravel 12.69.3 berjalan dengan PHP XAMPP 8.2.12; tidak menjalankan composer update |
| `.local-tools/node/` (diabaikan Git) | Node.js 22.23.3 portable dan npm 10.9.9 | Runtime frontend lokal tanpa mengubah PATH Windows |
| `node_modules/`, `package-lock.json` | 87 package frontend dipasang, lockfile frontend dibuat | Instalasi frontend berikutnya dapat memakai npm ci |
| `public/build/` (diabaikan Git) | Build Vite 7.3.7 menghasilkan manifest dan aset | Entry frontend repo siap dipakai |
| `.env` (diabaikan Git) | Konfigurasi lokal dibuat, APP_KEY dihasilkan, APP_URL memakai http://127.0.0.1:8001, auto migration/seed dinonaktifkan | Aplikasi lokal siap tanpa perubahan database otomatis saat akses |
| Database MySQL `novabase` | Database yang sebelumnya tidak ada dibuat; 23 migration existing dan seeder dijalankan | Tabel, halaman Home dan akun default lokal tersedia |
| `public/storage` (diabaikan Git) | Storage link dibuat oleh artisan | Upload publik memakai struktur Laravel existing |
| `.gitignore` | Menambahkan pengecualian /.local-tools | Binary runtime lokal tidak ikut commit |
| `dev-shell.cmd` | Helper terminal dengan PATH PHP/Node/npm lokal | Menghindari kebijakan Windows yang memblokir script PowerShell |
| `docs/LOCAL_DEVELOPMENT_SETUP.md` | Panduan menjalankan, instalasi ulang, database dan verifikasi | Handoff setup ke developer berikutnya |
| `docs/WEBSITE_EDITOR_CHANGELOG.md` | Mencatat setup dan hasil aktual | Jejak pekerjaan |

Verifikasi aktual:

- Composer install selesai; package discovery berhasil; Laravel melaporkan 12.69.3.
- Composer check-platform-reqs: seluruh requirement lolos.
- Node melaporkan 22.23.3 dan npm 10.9.9; npm install selesai.
- npm run build berhasil, 58 modul diproses. Percobaan sandbox awal terkena spawn EPERM; pengulangan di luar sandbox berhasil tanpa mengubah config aplikasi.
- PageManagementTest: 5 test lolos, 16 assertion; database test memakai SQLite memory sesuai phpunit.xml.
- migrate:status: seluruh 23 migration berstatus Ran.
- HTTP server port 8001: Home 200, Login 200, editor tanpa login 302. Interaksi visual Card/Template di browser belum diuji karena tidak ada perubahan fitur.
- Installer Composer dan arsip Node diverifikasi terhadap checksum resmi.

Proses lokal: MySQL XAMPP dinyalakan dan Laravel dev server berjalan di 127.0.0.1:8001. Server percobaan port 8000 yang timeout sudah dihentikan. Setelah restart mesin, nyalakan MySQL melalui XAMPP dan jalankan dev server sesuai panduan.

Warning core: tidak ada perubahan source core, route, schema migration, dependency manifest, atau aturan validasi. Migrasi/seeder existing hanya dijalankan untuk database baru pada setup yang diminta. Pemeriksaan Git diff belum tersedia karena Git tidak terpasang di PATH sesi.

Rollback setup: hentikan proses server lokal milik setup; folder generated yang diabaikan Git dapat dibersihkan secara selektif. Jangan menghapus database atau `.env` setelah dipakai developer tanpa meninjau data dan membuat backup. Jangan gunakan reset repo yang menghapus pekerjaan lain.

## 2026-10-11 - Commit dan push wajib setiap task/prompt

Status: ATURAN SELESAI; hasil push dilaporkan pada respons akhir setelah verifikasi remote.

Permintaan: pemilik repo mengotorisasi commit dan push otomatis setiap selesai satu prompt agar developer junior tidak lupa menyimpan setiap perubahan.

| File | Perubahan | Dampak |
| --- | --- | --- |
| `AGENTS.md` | Mewajibkan commit/push per task, staging terpilih, verifikasi SHA remote, pelaporan kegagalan; mengganti larangan push lama dengan otorisasi eksplisit | Developer/agent tidak perlu meminta izin push lagi ke branch kerja origin |
| `docs/WEBSITE_EDITOR_DEVELOPMENT_SCOPE.md` | Menambahkan commit dan push sebagai kriteria selesai | Scope Card/Template dan perlindungan core tetap berlaku |
| `docs/WEBSITE_EDITOR_CHANGELOG.md` | Mencatat aturan baru dan menambahkan kolom pelaporan commit/push pada format entri | Handoff dapat membedakan commit lokal dan push berhasil |

Branch aktual menurut Git: `feat/web-editor-frontend`. Ini memperbarui referensi historis `feat/website-editor-frontend` dalam analisis awal. Tujuan origin: `muhaldianmaharani/novabase-product`; upstream bukan tujuan push otomatis.

Verifikasi: Git ditemukan pada instalasi GitHub Desktop; status dan diff ditinjau, git diff --check lolos. Perubahan setup sesi sebelumnya disimpan terpisah pada commit `cb51d45`. Perubahan task ini hanya dokumentasi; tidak membutuhkan pengulangan test runtime. SHA commit aturan dan hasil verifikasi SHA remote disampaikan di laporan akhir supaya tidak membuat commit tambahan hanya untuk mencatat SHA commit itu sendiri.

Warning core: tidak ada. Larangan force push dan push otomatis ke main/master/upstream tetap berlaku. Jika akses push gagal, commit lokal dipertahankan dan kendala dilaporkan.

## 2026-10-11 - Memperbaiki akses Apache localhost

Status: SELESAI KONFIGURASI LOKAL; hasil push dilaporkan pada respons akhir.

Otorisasi: pemilik repo secara eksplisit mengizinkan perubahan setting Apache yang sudah dijelaskan. Scope fitur Card/Template tetap berlaku.

| File/area | Perubahan | Dampak |
| --- | --- | --- |
| `C:/xampp3/apache/conf/extra/httpd-xampp.conf` (di luar repo) | Menambahkan Directory khusus novabase-product dengan AllowOverride All dan Require all granted | Memperbolehkan Options dan rewrite .htaccess pada folder repo; memperbaiki HTTP 500 |
| `docs/LOCAL_DEVELOPMENT_SETUP.md` | Menambahkan blok config yang diterapkan, lokasi backup dan cara rollback | Konfigurasi lokal dapat direproduksi junior; file Apache tidak ikut commit |
| `docs/WEBSITE_EDITOR_CHANGELOG.md` | Mencatat hasil dan otorisasi perubahan | Jejak pekerjaan |

Backup: `C:/xampp3/apache/conf/extra/httpd-xampp.conf.novabase-20261011-001236.bak`.

Verifikasi aktual: Apache syntax OK; setelah Apache dinyalakan ulang dan MySQL yang tidak aktif dinyalakan kembali, localhost Home 200, Login 200, editor tanpa login 302, aset CSS 200, dan akses .env 403. Tidak ada perubahan source core, .htaccess, .env, migration atau data aplikasi. Test runtime tidak diulang karena perubahan khusus konfigurasi server dan sudah diperiksa lewat HTTP. Perintah restart service awal tidak berlaku karena Apache bukan service Apache2.4; Apache kemudian dijalankan sebagai proses XAMPP biasa.

Commit/push: branch kerja `feat/web-editor-frontend`, target origin; SHA dan hasil push dilaporkan setelah percobaan aktual. Konfigurasi Apache di luar repo hanya dicatat, tidak dimasukkan sebagai file mesin ke Git.

## 2026-10-13 - Template Pop Balance

Status: IMPLEMENTASI DAN TEST INTEGRASI SELESAI; pemeriksaan visual browser belum dilakukan. Hasil push dilaporkan pada respons akhir.

Permintaan: satu template yang menarik bagi Gen Z, tetap nyaman dibaca milenial. Arah desain dipilih sebagai keputusan visual untuk task ini, bukan klaim hasil riset preferensi generasi.

WARNING: PERUBAHAN BASE CODE NOVABASE DIPERLUKAN. Kebutuhan ini sudah diotorisasi secara eksplisit oleh pemilik repo melalui jawaban “Ya, izinkan registrasi template ini saja”. Perubahan core dibatasi satu entri `template-pop-balance` pada `BlockRegistry::templates()`, tanpa perubahan validator, state, route, database atau permission.

| File/bagian | Perubahan aktual | Alasan/dampak |
| --- | --- | --- |
| `app/Core/PageBuilder/BlockRegistry.php`, templates | Menambahkan ID dan metadata Pop Balance | Pilihan keenam dikirim server dan diterima validator existing |
| `public/js/page-builder/editor/templates.js`, fallbackTemplates | Menambahkan metadata fallback ID yang sama | Konsisten ketika definisi server tidak tersedia; default tetap Studio Clean |
| `public/css/page-builder/templates.css` | Tema scoped .website-theme.template-pop-balance | Ivory/violet/lime, heading ekspresif, copy lega, Card membulat, fokus keyboard dan reduced motion |
| `public/css/page-builder/editor.css` | Swatch Pop Balance | Preview warna pada pemilih template |
| `tests/Feature/PageManagementTest.php` | Test save tema baru dan konten Card tetap tersimpan | Memeriksa integrasi registrasi, save dan pembacaan ulang |
| Dokumen scope dan changelog | Pengecualian core serta rekam perubahan | Handoff dan batas scope jelas |

Template tidak mengganti konten pengguna atau template existing. Style dibatasi tema baru; aksen lime digunakan sebagai dekorasi/badge dengan teks gelap. Tidak menambahkan aset, font eksternal atau dependency.

Verifikasi aktual: PHP registry dan JavaScript templates.js lolos syntax; kedua stylesheet lolos parse PostCSS; enam pasangan warna teks/latar utama memiliki rasio kontras 6.96–14.28 (di atas 4.5). PageManagementTest lolos: 6 test, 23 assertion, termasuk tema baru muncul di data editor, diterima save, dan konten Card terbaca kembali. Git diff --check lolos. Pemeriksaan visual browser desktop/mobile belum dilakukan; breakpoint mobile dan reduced motion sudah disediakan tetapi bukan klaim hasil uji browser. Tidak menjalankan migration/seeder pada database aplikasi; seeding test hanya melalui SQLite memory test suite.

Handoff: pilih Pop Balance pada Design templates, simpan, reload dan bandingkan canvas/publik pada desktop dan mobile. Jika CSS lama masih terlihat, hard refresh browser. Rollback hanya file/hunk task ini, jangan menghapus konten website.

Commit/push: target origin/feat/web-editor-frontend; SHA dan hasil aktual dilaporkan pada respons akhir.

## 2026-10-13 - Section Kegiatan Berjalan

Status: IMPLEMENTASI DAN PEMERIKSAAN SELESAI; hasil push dicantumkan di respons akhir.

Referensi: https://muhaldianmaharani.github.io/portofolio-terbaru/ dan sumber `js/activities-v2.js`, dibaca dari halaman publik. Referensi menampilkan card aktivitas dengan dokumentasi foto, judul, ringkasan dan catatan waktu. Implementasi mengadaptasi pola card tersebut, menambahkan carousel dan popup sesuai permintaan; tidak menyalin foto atau konten pribadi referensi.

WARNING: PERUBAHAN BASE CODE NOVABASE DIPERLUKAN. Pemilik repo memberi izin eksplisit “Ya, izinkan khusus fitur Kegiatan” untuk registrasi block dan frontend editor/publik. Perubahan core hanya definisi `activities` beserta default yang sekaligus menjadi kontrak validasi existing. Tidak mengubah validator, route, database, auth, permission, tenant, atau API save.

| File/bagian | Perubahan aktual | Dampak |
| --- | --- | --- |
| `app/Core/PageBuilder/BlockRegistry.php`, definitions | Block Kegiatan Berjalan dengan title, text, items berisi image/title/summary/description | Tersedia di palette dan diterima save existing |
| `public/js/page-builder/editor/blockRegistry.js`, `blockFactory.js` | Fallback label dan default activities | Pembuatan block konsisten tanpa definisi server |
| `public/js/page-builder/editor/activities.js` | Renderer card/carousel/dialog dan binding interaksi yang dipakai bersama | Geser sentuh/scroll, panah, keyboard, popup, tutup/Escape dan fokus kembali |
| `public/js/page-builder/editor/siteRenderer.js` | Dispatch khusus type activities | Canvas dan publik menggunakan markup yang sama |
| `public/js/page-builder/editor/editor.js` | Binding Kegiatan, tambah/hapus/urutkan item, pilihan prompt activities | Jumlah 0–100 sesuai batas validator; kontrol editor tidak mengubah API save |
| `public/js/page-builder/editor/inspectorRenderer.js` | Field foto URL/upload, judul, ringkasan dan textarea detail; kontrol item | Semua isi dapat diedit, item ditambah/dihapus/diurutkan |
| `public/js/page-builder/editor/public-renderer.js` | Binding Kegiatan setelah setiap render | Carousel/popup berfungsi juga setelah navigasi halaman publik |
| `public/css/page-builder/templates.css` | Style Kegiatan mengikuti token tema existing dan breakpoint | Tiga card desktop, dua tablet, satu card dengan petunjuk card berikutnya di mobile; popup responsif |
| `public/css/page-builder/editor.css` | Style fieldset inspector Kegiatan | Pemisahan kontrol tiap item |
| `tests/Feature/PageManagementTest.php` | Integrasi create/edit/reorder/remove dan URL foto berbahaya | Memeriksa persistensi konten dan batas keamanan existing |
| Dokumen scope/changelog | Izin terbatas dan hasil implementasi | Handoff junior |

Kontrak: `type: activities`, `data: {title, text, items: [{image, title, summary, description}]}`. Jumlah item maksimal 100; teks mengikuti batas existing 5000 karakter/field. Foto opsional; input kosong menjadi null oleh Laravel dan ditampilkan sebagai placeholder. Deskripsi ditampilkan sebagai teks escaped dengan newline; tidak menerima HTML mentah. Tidak ada migrasi atau dependency tambahan.

Verifikasi aktual:

- PHP syntax registry lolos; tujuh modul JavaScript baru/diubah lolos node --check; CSS lolos parse PostCSS.
- PageManagementTest: 7 test lolos, 32 assertion. Termasuk kegiatan tersimpan, isi panjang terbaca ulang, urutan berubah, penghapusan sampai kosong, dan javascript URL ditolak 422. Test memakai database SQLite memory, bukan data website.
- Pemeriksaan renderer Node: escaping title/description, penolakan URL gambar javascript pada render, label dialog, mode edit dan empty state lolos.
- Chrome headless fixture memakai modul/CSS nyata: carousel overflow/next, popup terbuka/tertutup, fokus di dialog/kembali ke pemicu, detail lengkap, dan tidak ada horizontal overflow halaman lolos pada desktop (viewport 1418px), viewport kecil 512px, serta emulasi mobile tepat 375px melalui CDP.
- Pengujian awal menemukan kolom grid menyusut sehingga carousel tidak scroll; diperbaiki dengan lebar kolom tetap relatif container, lalu pemeriksaan browser diulang dan lolos.
- Belum menguji alur login/save lewat browser pada website nyata atau seluruh kombinasi enam tema. Save/reload backend sudah diperiksa oleh feature test; browser fixture hanya memverifikasi komponen/interaksi.

Pemakaian: Add section → Kegiatan Berjalan; pilih section untuk mengedit item di Inspector. Tambah kegiatan, atur foto, judul, ringkasan/detail, urutkan dengan panah, atau Hapus kegiatan. Save lalu periksa Preview dan halaman publik. Detail dibuka lewat Lihat kegiatan, ditutup tombol tutup, Escape, atau klik backdrop. Tidak ada autoplay agar pembaca mengontrol perpindahan.

Rollback: jangan mencabut registrasi activities sebelum mengonversi/menghapus block activities yang sudah tersimpan secara sengaja; pencabutan dapat membuat data existing ditolak saat save. Kembalikan hunk task saja setelah meninjau data dan perubahan developer lain.

Commit/push: target origin/feat/web-editor-frontend; SHA dan hasil aktual pada respons akhir. File fixture/profil browser hanya di TEMP dan tidak ikut commit.

## 2026-10-13 - Klik kartu Kegiatan langsung membuka popup

Status: SELESAI; hasil push pada respons akhir.

Permintaan: hapus tombol Lihat kegiatan, buka detail dengan klik kartu kegiatan.

| File | Perubahan | Dampak |
| --- | --- | --- |
| `public/js/page-builder/editor/activities.js` | Memindahkan pemicu popup ke seluruh article, menghapus tombol detail, menambahkan role/tabindex dan Enter/Space | Foto, judul, ringkasan dan area kartu membuka popup pada preview/publik; teks contenteditable di editor tetap dapat diedit |
| `public/css/page-builder/templates.css` | Cursor kartu, border hover, fokus keyboard dan cursor teks edit; menghapus style tombol detail | Affordance interaktif tanpa tombol tambahan |
| `docs/WEBSITE_EDITOR_CHANGELOG.md` | Catatan perilaku dan verifikasi | Menggantikan instruksi tombol Lihat kegiatan pada entri sebelumnya |

Verifikasi: node --check lolos. Chrome headless memakai fixture modul/CSS nyata lolos untuk Enter, Space, klik judul kartu pada mode publik, popup buka/tutup, fokus kembali, scroll carousel dan tanpa overflow halaman di viewport desktop 1418px. Pemeriksaan visual browser pada website/login nyata dan uji mobile ulang belum dilakukan; layout/breakpoint carousel tidak berubah. Tidak mengulang feature test backend karena kontrak data dan save tidak berubah. Core NovaBase tidak diubah.

Pemakaian: klik kartu langsung pada Preview/publik. Dalam mode Edit, klik foto/area kartu untuk detail; klik judul/ringkasan untuk mengedit. Tutup popup dengan tombol tutup, Escape, atau backdrop seperti sebelumnya.

Commit/push: branch `feat/web-editor-frontend`, target origin; SHA dan hasil aktual pada respons akhir. Rollback hanya hunk kedua file frontend dan catatan task ini.

## 2026-10-13 - Foto nyata bawaan untuk demo website gereja

Status: SELESAI FRONTEND; hasil push pada respons akhir.

Permintaan: foto default nyata dan relevan untuk presentasi website gereja, terutama Hero dan Kegiatan, serta section bergambar lainnya.

| File/area | Perubahan | Dampak |
| --- | --- | --- |
| `public/images/website-demo/*.jpg` dan `SOURCES.md` | Empat foto Unsplash nyata beserta sumber/credit: worship, fellowship, bible, church | Aset lokal untuk ibadah, persekutuan dan interior/Alkitab; bukan dokumentasi gereja klien |
| `public/js/page-builder/editor/churchDemoImages.js` | Helper path lokal berdasarkan URL module dan pemilihan gambar default | Mendukung root/subfolder tanpa hardcode host; clone data untuk menjaga state |
| `public/js/page-builder/editor/blockFactory.js` | Menggunakan foto gereja saat membuat Hero, Gambar + Teks, Gallery dan Kegiatan, baik definisi server maupun fallback | Section baru langsung memiliki contoh gambar; default backend tidak diubah |
| `public/js/page-builder/editor/editor.js` | Tambah item Kegiatan/Gallery menggunakan foto lokal bergantian | Item tambahan tidak mulai dari foto kosong/kantor |
| `public/js/page-builder/editor/siteRenderer.js`, `activities.js` | Foto stok kantor bawaan yang dikenali diganti pada tampilan; Kegiatan kosong memakai foto demo | Section lama dengan stok bawaan ikut relevan tanpa menulis ulang database |
| `public/js/page-builder/editor/inspectorRenderer.js` | Menampilkan URL foto efektif yang sama dengan canvas | Foto demo dapat diganti URL/upload melalui kontrol existing |
| Dokumen scope/changelog | Mencatat batas dan verifikasi task | Handoff junior |

Perubahan tidak menimpa foto custom, konten teks, jumlah item atau urutan. Render hanya mengganti URL stok kantor bawaan yang dikenali secara spesifik dan foto Kegiatan kosong; data tersimpan tidak dimigrasi. Mengosongkan foto Kegiatan berarti kembali ke contoh bawaan. Section tanpa field foto (Card Grid/CTA/dll.) dan logo identitas tidak ditambah foto secara paksa. URL aset lokal mengikuti subfolder saat dibuat; bila memindahkan konten antar lokasi instalasi/subfolder, URL gambar tersimpan perlu ditinjau sebagaimana aset lokal lainnya.

Warning core: tidak diperlukan perubahan base code; defaults server tetap digunakan lalu nilai foto contoh disesuaikan di frontend menggunakan field yang sudah diterima validator. Tidak mengubah backend, route, schema, .env, dependency atau data aplikasi.

Verifikasi: keenam modul JS baru/diubah lolos node --check; empat JPEG valid dan diperiksa visual; pemeriksaan Node lolos untuk default Hero/Kegiatan/Gallery dari server, mapping stok lama, foto custom tetap, serta source/state tidak termutasi. Chrome headless fixture memuat keempat foto lokal (naturalWidth > 0) dan lolos pemeriksaan klik kartu/keyboard, popup, fokus dan scroll carousel pada desktop 1418px. Git diff --check lolos. Test backend tidak diulang karena kontrak save tidak berubah. Alur website nyata, deployment subfolder lain dan pemeriksaan mobile ulang belum dilakukan.

Pemakaian: hard refresh editor/publik. Hero/Gambar + Teks/Gallery yang masih memakai stok kantor bawaan menampilkan foto gereja; Kegiatan kosong mendapat contoh foto. Semua foto tetap bisa diganti di Inspector. Foto asli pengguna yang sudah terpasang dipertahankan. Asset/credit selengkapnya di `public/images/website-demo/SOURCES.md`.

Commit/push: branch feat/web-editor-frontend, target origin; hasil aktual dan SHA pada respons akhir. Rollback hunk task dan aset demo setelah memastikan tidak ada konten tersimpan yang memakai path aset tersebut.

## 2026-10-13 - Section dua panel Layanan & Informasi Gereja

Status: IMPLEMENTASI DAN VERIFIKASI SECTION SELESAI. Dua kegagalan suite umum yang terbukti juga ada sebelum registrasi baru dicatat di bawah; hasil push pada respons akhir.

Scope: satu block `church-hub`, kiri Layanan & Aktivitas Jemaat, kanan Informasi & Kegiatan Gereja. Menggunakan Add Section, factory, inspector, state JSON, Save, renderer editor/publik dan duplikasi existing; tidak membuat sistem penyimpanan lain.

WARNING: PERUBAHAN BASE CODE NOVABASE DIPERLUKAN. Pemilik memberi izin eksplisit “Ya, izinkan registrasi khusus section ini”. Core hanya mendapat satu definisi block/default/schema baru. Tidak mengubah validator, endpoint, migration, permission, auth atau tenant.

| File/bagian | Perubahan aktual | Dampak |
| --- | --- | --- |
| `app/Core/PageBuilder/BlockRegistry.php` | Definisi church-hub, enam layanan dan tiga informasi dengan tanggal contoh 17/18/24 Oktober 2026 | Data default nyata dikirim server, diterima validator repeatable existing dan dipakai factory |
| `public/js/page-builder/editor/churchHub.js` | Default fallback, clone/fill field yang absen, renderer dua panel, URL aman dan detail popup | Tidak menimpa kustomisasi atau array kosong; mengikuti token tema aktif; detail default punya perilaku |
| `public/js/page-builder/editor/blockRegistry.js`, `blockFactory.js` | Pilihan palette/fallback dan pembuatan data baru yang di-clone | Add Section langsung menampilkan konten; setiap instance punya data independen |
| `public/js/page-builder/editor/siteRenderer.js` | Dispatch church-hub ke renderer bersama | Edit, Preview dan halaman publik memakai data yang sama |
| `public/js/page-builder/editor/inspectorRenderer.js` | Edit judul panel, ikon/kategori, judul, deskripsi, tanggal, label/URL tautan, detail popup, visibilitas; add/remove/reorder | Admin bebas mengelola jumlah/urutan/status item tiap panel |
| `public/js/page-builder/editor/editor.js` | Handler item khusus church-hub dan inisialisasi field absen saat edit | Menggunakan alur input/change/Save existing; tidak mengganti data yang sudah ada |
| `public/css/page-builder/templates.css`, `editor.css` | Dua panel responsif, kartu/ikon, tiga badge berbeda, inspector | Warna mengikuti tema; container query mengikuti lebar canvas mobile preview |
| `tests/Feature/ChurchHubSectionTest.php` | Test defaults, save/readback/customize/hide/reorder/add/delete/duplicate, isolasi dua gereja dan URL/field tidak valid | Memeriksa persistensi dan kontrak existing tanpa melemahkan test lain |
| Scope dan changelog | Batas izin, hasil verifikasi dan handoff | Dokumentasi pelaksana berikutnya |

Data: `{servicesTitle, newsTitle, services:[{icon,title,description,details,link,enabled}], news:[{category,title,description,date,actionLabel,link,details,enabled}]}`. Maksimal 100 item per daftar, teks maksimum 5000 sesuai validator existing. Status disimpan sebagai string `1`/`0`, bukan boolean baru. Field teks tautan bernama `actionLabel` agar tidak salah dikenali validator URL existing. Desain informasi berupa kartu teks tanpa field gambar; tidak menambahkan schema gambar yang tidak dipakai.

Default enam layanan: Jadwal Ibadah, Persekutuan Pemuda, Sekolah Minggu, Pelayanan Doa, Renungan Harian, Persembahan. Default tiga informasi: Jadwal Ibadah Minggu (Pengumuman), Persekutuan Pemuda (Kegiatan), Pelayanan Sosial Gereja (Informasi). Tanggal/jadwal adalah contoh yang dapat diedit, bukan jadwal resmi klien. Tidak mengaktifkan formulir doa, pembayaran atau rekening contoh.

Default hanya di-clone saat pembuatan block baru atau untuk field root yang benar-benar absen. Nilai custom, teks kosong, hidden items dan array kosong dipertahankan. Render tidak memutasi state. Duplikasi existing memakai structuredClone dan ID block baru sehingga dialog/data terpisah. Save menyimpan ke halaman scoped tenant existing; tidak menulis default global. Link terisi membuka alamat yang diatur admin; link kosong membuka dialog detail berisi konten relevan memakai binder dialog existing. Mendukung HTTP/HTTPS, alamat lokal/anchor, mailto dan tel; URL tidak aman tidak dirender sebagai link.

Verifikasi aktual:

- PHP syntax registry dan enam modul JS baru/diubah lolos; PostCSS parse kedua stylesheet dan git diff --check lolos.
- ChurchHubSectionTest + PageManagementTest: 10 test, 57 assertion, semua lolos. Termasuk default enam/tiga, save/kustomisasi/readback, duplikasi, reorder, hide, add/delete sampai kosong, tenant A tidak mengubah B/default global, serta penolakan URL javascript dan field asing.
- Node: default/fallback, independensi dua instance, pelestarian array/teks kosong, hidden item, escaping, URL web/lokal/mailto/tel, render tidak memutasi state, serta edit field/list yang sebelumnya absen tanpa menimpa judul custom lolos.
- Chrome nyata terhadap Laravel port 8013 dan SQLite sementara: login admin test, Add Section enam/tiga, ubah judul/deskripsi/ikon/tanggal/URL, add/remove/reorder/hide, klik Save, reload dengan isi tetap, duplikasi dan edit salinan tanpa mengubah asli, Preview tanpa contenteditable, popup default, render publik, serta mobile 375px satu kolom tanpa horizontal overflow lolos.
- Suite penuh: 33 test, 139 assertion, 31 lolos / 2 gagal. ExampleTest membuka Home pada SQLite memory tanpa RefreshDatabase sehingga tabel site_pages tidak ada; RoleAccessTest mengharapkan admin/dashboard tetapi mendapat app/dashboard (test tidak seed role records). Keduanya direproduksi dengan registry dari HEAD sebelum perubahan melalui PHP auto_prepend_file di TEMP: 6 test baseline, 10 assertion, dua kegagalan yang sama. Backend lain tidak berubah. Tidak memperbaiki auth/test di luar scope.

Izin test database: automatic approval review awal menolak migration/seeder karena aturan AGENTS.md. Pemilik kemudian secara eksplisit mengizinkan migration/seeder hanya di SQLite sementara/TEMP dan server test 8013. Pengujian berhasil setelah izin tersebut; database MySQL website dan .env tidak diubah. Fixture, SQLite, screenshot dan profil Chrome tidak di-commit. Server test dihentikan setelah pengujian.

Pemakaian: Add Section → Layanan & Informasi Gereja. Klik section untuk membuka Inspector; edit masing-masing daftar dan pilih visibilitas aktif/nonaktif. Tautan kosong membuka detail; isi tautan resmi untuk navigasi langsung. Save dan reload mempertahankan isi. Hard refresh bila browser masih memakai modul lama.

Rollback: jangan mencabut definisi church-hub ketika masih ada block jenis ini tersimpan tanpa meninjau/menangani kontennya terlebih dahulu. Kembalikan hunk task saja, tanpa menghapus data gereja atau pekerjaan developer lain. Commit/push target origin/feat/web-editor-frontend; SHA dan hasil aktual pada respons akhir.

## Format entri pekerjaan berikutnya

```markdown
## YYYY-MM-DD - Judul task Card/Template

Status: SELESAI / PARSIAL / PENDING CORE
Pelaksana:
Branch dan referensi commit (jika tersedia):
Commit/push: branch tujuan, hasil push, SHA lokal/remote (boleh dirujuk ke laporan akhir).
Permintaan/tujuan:

| File dan bagian/fungsi | Perubahan aktual sebelum -> sesudah | Alasan/dampak |
| --- | --- | --- |
| ... | ... | ... |

Kontrak data/ID: tetap / detail kebutuhan handoff.
Dampak editor, preview, publik, dan data existing:
Pemeriksaan aktual dan hasil:
Pemeriksaan belum dijalankan dan alasannya:
Warning core/temuan di luar scope: tidak ada / rincian dengan format scope.
Handoff: kebutuhan, penanggung jawab yang dituju, dependensi, kriteria penerimaan.
Bagian belum selesai:
Cara rollback perubahan task ini tanpa menimpa pekerjaan lain:
```
