<?php

namespace App\Imports;

use App\Models\RealisasiAnggaran;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class RealisasiAnggaranImport implements ToModel, WithHeadingRow
{
    protected $opd_id;

    public function __construct($opd_id)
    {
        $this->opd_id = $opd_id;
    }

    public function model(array $row)
    {
        // Skip empty rows
        if (!isset($row['program']) && !isset($row['kegiatan']) && !isset($row['sub_kegiatan'])) {
            return null;
        }

        return new RealisasiAnggaran([
            'opd_id' => $this->opd_id,
            'tahun' => $row['tahun'] ?? date('Y'),
            'triwulan' => $row['triwulan'] ?? 1,
            'program' => $row['program'] ?? '-',
            'kegiatan' => $row['kegiatan'] ?? '-',
            'sub_kegiatan' => $row['sub_kegiatan'] ?? '-',
            'pegawai_anggaran' => $row['pegawai_anggaran'] ?? 0,
            'pegawai_realisasi_keuangan' => $row['pegawai_realisasi_keuangan'] ?? 0,
            'pegawai_realisasi_fisik' => $row['pegawai_realisasi_fisik'] ?? 0,
            'barang_jasa_anggaran' => $row['barang_jasa_anggaran'] ?? 0,
            'barang_jasa_realisasi_keuangan' => $row['barang_jasa_realisasi_keuangan'] ?? 0,
            'barang_jasa_realisasi_fisik' => $row['barang_jasa_realisasi_fisik'] ?? 0,
            'modal_anggaran' => $row['modal_anggaran'] ?? 0,
            'modal_realisasi_keuangan' => $row['modal_realisasi_keuangan'] ?? 0,
            'modal_realisasi_fisik' => $row['modal_realisasi_fisik'] ?? 0,
            'hibah_anggaran' => $row['hibah_anggaran'] ?? 0,
            'hibah_realisasi_keuangan' => $row['hibah_realisasi_keuangan'] ?? 0,
            'hibah_realisasi_fisik' => $row['hibah_realisasi_fisik'] ?? 0,
        ]);
    }
}
