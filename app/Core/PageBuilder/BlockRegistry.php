<?php

namespace App\Core\PageBuilder;

class BlockRegistry
{
    public static function templates(): array
    {
        return [
            'template-studio' => ['name' => 'Studio Clean', 'description' => 'Modern SaaS, crisp white'],
            'template-bold' => ['name' => 'Bold Launch', 'description' => 'High contrast campaign'],
            'template-editorial' => ['name' => 'Editorial Luxe', 'description' => 'Premium magazine style'],
            'template-neon' => ['name' => 'Neon Night', 'description' => 'Energetic dark tech'],
            'template-earth' => ['name' => 'Earth Calm', 'description' => 'Warm, natural and organic'],
            'template-pop-balance' => ['name' => 'Pop Balance', 'description' => 'Playful violet, warm ivory, easy reading'],
        ];
    }

    public static function definitions(): array
    {
        $imageA = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80';
        $imageB = 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80';
        $imageC = 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80';
        $imageD = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80';

        return [
            'hero' => [
                'label' => 'Hero',
                'defaults' => ['kicker' => 'Section baru', 'title' => 'Judul hero siap diedit langsung', 'text' => 'Tulis pesan utama brand atau produk di sini.', 'buttonLabel' => 'Call to action', 'buttonUrl' => 'https://example.com', 'image' => $imageB],
                'initial' => ['kicker' => 'Template 1', 'title' => 'Bangun halaman bisnis dari preview yang langsung bisa diedit', 'text' => 'Klik tulisan di halaman untuk mengubah copy. Tambah section dari panel kiri, lalu atur gambar dan layout dari inspector.', 'buttonLabel' => 'Mulai sekarang', 'buttonUrl' => 'https://example.com', 'image' => $imageA],
            ],
            'church-hub' => [
                'label' => 'Layanan & Informasi Gereja',
                'icon' => 'bi-grid-1x2',
                'defaults' => [
                    'servicesTitle' => 'Layanan & Aktivitas Jemaat',
                    'newsTitle' => 'Informasi & Kegiatan Gereja',
                    'services' => [
                        ['icon' => 'bi-clock', 'title' => 'Jadwal Ibadah', 'description' => 'Informasi jadwal dan waktu ibadah gereja.', 'details' => 'Ibadah Minggu pukul 07.00 dan 10.00. Hadir lebih awal untuk mempersiapkan hati bersama keluarga. Jadwal ini merupakan contoh dan dapat disesuaikan oleh admin gereja.', 'link' => '', 'enabled' => '1'],
                        ['icon' => 'bi-people', 'title' => 'Persekutuan Pemuda', 'description' => 'Informasi komunitas dan kegiatan pemuda.', 'details' => 'Persekutuan pemuda setiap Sabtu pukul 17.00: pujian, diskusi firman, dan kebersamaan. Terbuka bagi pemuda yang ingin bertumbuh dan melayani. Jadwal contoh dapat diedit.', 'link' => '', 'enabled' => '1'],
                        ['icon' => 'bi-balloon', 'title' => 'Sekolah Minggu', 'description' => 'Informasi pelayanan anak.', 'details' => 'Anak-anak belajar firman Tuhan melalui cerita, pujian, dan kegiatan kreatif setiap Minggu pukul 09.00. Orang tua dapat menghubungi tim pelayanan anak untuk informasi kelas. Jadwal contoh dapat diedit.', 'link' => '', 'enabled' => '1'],
                        ['icon' => 'bi-heart', 'title' => 'Pelayanan Doa', 'description' => 'Informasi dan akses permohonan doa.', 'details' => 'Tim pelayanan doa mendampingi jemaat dalam pergumulan dan ucapan syukur. Hubungi sekretariat gereja untuk menyampaikan permohonan secara pribadi. Admin dapat menambahkan tautan kanal pelayanan doa resmi.', 'link' => '', 'enabled' => '1'],
                        ['icon' => 'bi-book', 'title' => 'Renungan Harian', 'description' => 'Akses ke renungan dan refleksi firman Tuhan.', 'details' => 'Luangkan waktu untuk membaca firman, merenungkan kebaikan Tuhan, dan berdoa bagi sesama. Admin dapat mengganti detail ini dengan renungan hari ini atau memasukkan tautan halaman renungan gereja.', 'link' => '', 'enabled' => '1'],
                        ['icon' => 'bi-gift', 'title' => 'Persembahan', 'description' => 'Informasi mengenai persembahan dan dukungan pelayanan.', 'details' => 'Persembahan mendukung pelayanan jemaat dan kepedulian kepada sesama. Untuk informasi saluran persembahan resmi, silakan menghubungi sekretariat gereja. Tidak ada rekening atau pembayaran contoh yang diaktifkan.', 'link' => '', 'enabled' => '1'],
                    ],
                    'news' => [
                        ['category' => 'Pengumuman', 'title' => 'Jadwal Ibadah Minggu', 'description' => 'Informasi jadwal ibadah dan rangkaian pelayanan minggu ini.', 'date' => '2026-10-18', 'actionLabel' => 'Baca selengkapnya', 'link' => '', 'details' => 'Minggu, 18 Oktober 2026: ibadah pukul 07.00 dan 10.00, dilanjutkan persekutuan jemaat. Jadwal ini adalah contoh untuk presentasi dan dapat diperbarui oleh admin.', 'enabled' => '1'],
                        ['category' => 'Kegiatan', 'title' => 'Persekutuan Pemuda', 'description' => 'Mari bertumbuh bersama dalam iman, persekutuan, dan pelayanan.', 'date' => '2026-10-17', 'actionLabel' => 'Lihat kegiatan', 'link' => '', 'details' => 'Sabtu, 17 Oktober 2026 pukul 17.00: pujian bersama, refleksi firman, dan diskusi kelompok. Undang teman untuk ikut mengenal komunitas pemuda. Jadwal contoh dapat diedit.', 'enabled' => '1'],
                        ['category' => 'Informasi', 'title' => 'Pelayanan Sosial Gereja', 'description' => 'Informasi kegiatan pelayanan dan kepedulian gereja terhadap masyarakat.', 'date' => '2026-10-24', 'actionLabel' => 'Baca informasi', 'link' => '', 'details' => 'Sabtu, 24 Oktober 2026: jemaat diajak membantu persiapan paket kebutuhan pokok dan kunjungan kasih. Hubungi tim diakonia untuk informasi partisipasi. Jadwal dan bentuk kegiatan adalah contoh yang dapat disesuaikan.', 'enabled' => '1'],
                    ],
                ],
            ],
            'activities' => [
                'label' => 'Kegiatan Berjalan',
                'icon' => 'bi-calendar-event',
                'defaults' => [
                    'title' => 'Kegiatan yang sedang berjalan',
                    'text' => 'Kenali program dan aktivitas terbaru kami.',
                    'items' => [[
                        'image' => '', 'title' => 'Kegiatan baru',
                        'summary' => 'Ringkasan singkat kegiatan untuk pengunjung.',
                        'description' => "Ceritakan kegiatan secara lengkap di sini.\n\nTambahkan tujuan, jadwal, lokasi, dan informasi peserta.",
                    ]],
                ],
            ],
            'cards' => ['label' => 'Card Grid', 'defaults' => ['title' => 'Fitur unggulan', 'text' => 'Susun beberapa poin penting dalam format kartu yang mudah dibaca.', 'items' => [['icon' => 'bi-lightning-charge', 'title' => 'Cepat', 'text' => 'Konten bisa diperbarui dari canvas.', 'link' => 'https://example.com/cepat'], ['icon' => 'bi-palette', 'title' => 'Fleksibel', 'text' => 'Cocok untuk banyak template website.', 'link' => 'https://example.com/fleksibel'], ['icon' => 'bi-shield-check', 'title' => 'Rapi', 'text' => 'State tersimpan sebagai JSON sederhana.', 'link' => 'https://example.com/rapi']]]],
            'split' => ['label' => 'Gambar + Teks', 'defaults' => ['title' => 'Ceritakan nilai produk dengan visual yang kuat', 'text' => 'Section ini cocok untuk profil usaha, layanan, atau highlight produk dengan satu gambar besar.', 'buttonLabel' => 'Pelajari detail', 'buttonUrl' => 'https://example.com/detail', 'image' => $imageC, 'imagePosition' => 'left']],
            'gallery' => ['label' => 'Gallery', 'defaults' => ['title' => 'Gallery project', 'text' => 'Tambahkan gambar dari URL atau upload file lokal untuk kebutuhan preview POC.', 'images' => [$imageA, $imageC, $imageD, $imageB]]],
            'video' => ['label' => 'Video YouTube', 'defaults' => ['title' => 'Tampilkan video YouTube', 'text' => 'Masukkan link YouTube dari inspector untuk menampilkan video profil, demo produk, atau konten edukasi.', 'videoUrl' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ']],
            'logos' => ['label' => 'Logo List', 'defaults' => ['title' => 'Dipercaya oleh partner pilihan', 'text' => 'Logo dapat diarahkan ke website partner atau halaman portofolio.', 'logos' => [['name' => 'Acme', 'image' => 'https://dummyimage.com/240x100/f8fafc/111827&text=Acme', 'link' => 'https://example.com/acme'], ['name' => 'Northstar', 'image' => 'https://dummyimage.com/240x100/f8fafc/111827&text=Northstar', 'link' => 'https://example.com/northstar'], ['name' => 'Orbit', 'image' => 'https://dummyimage.com/240x100/f8fafc/111827&text=Orbit', 'link' => 'https://example.com/orbit'], ['name' => 'Lumina', 'image' => 'https://dummyimage.com/240x100/f8fafc/111827&text=Lumina', 'link' => 'https://example.com/lumina']]]],
            'testimonials' => ['label' => 'Testimonial', 'defaults' => ['title' => 'Apa kata pelanggan', 'text' => 'Gunakan section ini untuk menampilkan review, studi kasus singkat, atau kutipan client.', 'items' => [['name' => 'Alya Rahman', 'role' => 'Founder', 'quote' => 'Website kami jadi lebih mudah dikelola tanpa menunggu developer untuk perubahan kecil.', 'link' => 'https://example.com/case-study-1'], ['name' => 'Bima Putra', 'role' => 'Marketing Lead', 'quote' => 'Preview langsung membantu tim konten mengambil keputusan visual lebih cepat.', 'link' => 'https://example.com/case-study-2']]]],
            'pricing' => ['label' => 'Pricing', 'defaults' => ['title' => 'Paket layanan', 'text' => 'Cocok untuk landing page, katalog, membership, atau layanan berlangganan.', 'plans' => [['name' => 'Starter', 'price' => 'Rp499rb', 'text' => 'Untuk validasi awal.', 'buttonLabel' => 'Pilih Starter', 'link' => 'https://example.com/starter'], ['name' => 'Growth', 'price' => 'Rp1,5jt', 'text' => 'Untuk bisnis yang mulai scale.', 'buttonLabel' => 'Pilih Growth', 'link' => 'https://example.com/growth'], ['name' => 'Custom', 'price' => 'Custom', 'text' => 'Untuk kebutuhan integrasi khusus.', 'buttonLabel' => 'Diskusi Dulu', 'link' => 'https://example.com/custom']]]],
            'cta' => ['label' => 'CTA', 'defaults' => ['title' => 'Siap membuat halaman berikutnya?', 'text' => 'Gunakan section ini untuk mengarahkan pengunjung ke aksi utama.', 'buttonLabel' => 'Hubungi kami', 'buttonUrl' => 'https://example.com/contact']],
        ];
    }

    public static function defaults(string $type): array
    {
        return self::definitions()[$type]['defaults'] ?? throw new \InvalidArgumentException('Unknown page block type.');
    }
}
