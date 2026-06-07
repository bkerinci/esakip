<?php

namespace App\Imports;

use App\Models\PelaksanaanRenstra;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithStartRow;

class PelaksanaanRenstraImport implements ToModel, WithStartRow
{
    protected $opd_id;

    public function __construct($opd_id)
    {
        $this->opd_id = $opd_id;
    }

    public function model(array $row)
    {
        // Skip empty rows
        if (!isset($row[0]) && !isset($row[1])) {
            return null;
        }

        return new PelaksanaanRenstra([
            'opd_id' => $this->opd_id,
            'nomor' => isset($row[0]) ? (int)$row[0] : null,
            'renstra_pd' => $row[1] ?? null,
            'renja_pd' => $row[2] ?? null,
            'kesesuaian' => $row[3] ?? null,
            'evaluasi' => $row[4] ?? null,
            'tindak_lanjut' => $row[5] ?? null,
            'hasil_tindak_lanjut' => $row[6] ?? null,
        ]);
    }

    public function startRow(): int
    {
        return 4; // Assuming row 1, 2, 3 are headers
    }
}
