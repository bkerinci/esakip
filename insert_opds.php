<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$opds = [
    'Pemerintah Daerah',
    'Badan Kepegawaian dan Pengembangan Sumber Daya Manusia',
    'Badan Kesatuan Bangsa dan Politik',
    'Badan Penanggulangan Bencana Daerah',
    'Badan Pendapatan Daerah',
    'Badan Perencanaan Pembangunan , Riset dan Invosi Daerah',
    'Badan Keuangan dan Aset Daerah',
    'Dinas Kebudayaan Pariwisata Kepemudaan dan Olahraga',
    'Dinas Kesehatan',
    'Dinas Komunikasi Informatika dan Statistik',
    'Dinas Koperasi Usaha Kecil Menengah dan Tenaga Kerja',
    'Dinas Lingkungan Hidup',
    'Dinas Pekerjaan Umum dan Perumahan Rakyat',
    'Dinas Pemberdayaaan Perempuan, Perlindungan Anak Pengendalian Penduduk dan Keluarga Kependudukan',
    'Dinas Pemberdayaan Masyarakat dan Desa',
    'Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu',
    'Dinas Pendidikan',
    'Dinas Perhubungan',
    'Dinas Perdagangan dan Perindustrian',
    'Dinas Perpustakaan dan Kearsipan',
    'Dinas Kependudukan dan Pencatatan Sipil',
    'Dinas Pertanian, Ketahanan Pangan dan Perikanan',
    'Inspektorat',
    'Satuan Polisi Pamong Praja dan Pemadam Kebakaran',
    'Dinas Sosial',
    'Sekretariat Daerah',
    'Sekretariat DPRD',
    'UPT Laboratorium Kesehatan Daerah',
    'RSUD M.H. Thalib',
    'Kantor Camat Sungai Penuh',
    'Kantor Camat Kumun Debai',
];

foreach ($opds as $opd) {
    \App\Models\Opd::firstOrCreate(['nama' => $opd]);
}
echo "Done importing OPDs.\n";
