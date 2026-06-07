<?php

namespace App\Imports;

use App\Models\RencanaAksi;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithStartRow;

class RencanaAksiImport implements ToModel, WithStartRow
{
    private $opd_id;

    public function __construct($opd_id)
    {
        $this->opd_id = $opd_id;
    }

    public function startRow(): int
    {
        return 5; // Asumsi baris 1-4 adalah judul dan header
    }

    public function model(array $row)
    {
        // Skip jika baris kosong
        if (!isset($row[1]) || trim($row[1]) === '') {
            return null;
        }

        return new RencanaAksi([
            'opd_id'            => $this->opd_id,
            'nomor'             => $row[0] ?? null,
            'sasaran'           => $row[1] ?? null,
            'indikator_kinerja' => $row[2] ?? null,
            'tw_1'              => $row[3] ?? null,
            'tw_2'              => $row[4] ?? null,
            'tw_3'              => $row[5] ?? null,
            'tw_4'              => $row[6] ?? null,
            'aktifitas'         => $row[7] ?? null,
            'penanggung_jawab'  => $row[8] ?? null,
            'anggaran'          => $row[9] ?? null,
        ]);
    }
}
