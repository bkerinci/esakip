<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Opd;

class OpdSeeder extends Seeder
{
    public function run(): void
    {
        $opds = [
            ['nama' => 'Sekretariat Daerah', 'singkatan' => 'Setda'],
            ['nama' => 'Sekretariat DPRD', 'singkatan' => 'Setwan'],
            ['nama' => 'Dinas Pendidikan', 'singkatan' => 'Disdik'],
            ['nama' => 'Dinas Kesehatan', 'singkatan' => 'Dinkes'],
            ['nama' => 'Dinas Pekerjaan Umum dan Penataan Ruang', 'singkatan' => 'PUPR'],
            ['nama' => 'Dinas Perumahan, Kawasan Permukiman dan Pertanahan', 'singkatan' => 'Disperkim'],
            ['nama' => 'Satuan Polisi Pamong Praja', 'singkatan' => 'Satpol PP'],
            ['nama' => 'Dinas Sosial', 'singkatan' => 'Dinsos'],
            ['nama' => 'Dinas Lingkungan Hidup', 'singkatan' => 'DLH'],
            ['nama' => 'Dinas Komunikasi, Informatika dan Statistik', 'singkatan' => 'Diskominfotik'],
            ['nama' => 'Badan Perencanaan Pembangunan Daerah', 'singkatan' => 'Bappeda'],
            ['nama' => 'Badan Keuangan Daerah', 'singkatan' => 'Bakeuda'],
            ['nama' => 'Inspektorat Daerah', 'singkatan' => 'Inspektorat'],
        ];

        foreach ($opds as $opd) {
            Opd::create($opd);
        }
    }
}
