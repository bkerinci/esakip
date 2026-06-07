<?php

namespace App\Imports;

use App\Models\FormulirE75;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithStartRow;

class FormulirE75Import implements ToModel, WithStartRow
{
    private $tahun;
    private $opd_id;

    public function __construct($tahun, $opd_id)
    {
        $this->tahun = $tahun;
        $this->opd_id = $opd_id;
    }

    public function startRow(): int
    {
        return 4; // Excel header for E.75 takes 3 rows
    }

    public function model(array $row)
    {
        // Skip empty rows
        if (!isset($row[0]) && !isset($row[1])) {
            return null;
        }

        return new FormulirE75([
            'opd_id' => $this->opd_id,
            'user_id' => auth()->id() ?? 1, // fallback if needed
            'tahun' => $this->tahun,
            'kode' => $row[0] ?? null,
            'program' => $row[1] ?? null,
            'kegiatan' => $row[2] ?? null,
            'sub_kegiatan' => $row[3] ?? null,
            
            'indikator_kinerja_renja' => $row[4] ?? null,
            'indikator_kinerja_rka' => $row[5] ?? null,
            
            'rencana_lokasi_renja' => $row[6] ?? null,
            'rencana_lokasi_rka' => $row[7] ?? null,
            
            'rencana_target_renja' => $row[8] ?? null,
            'rencana_target_rka' => $row[9] ?? null,
            
            'rencana_dana_renja' => is_numeric($row[10] ?? null) ? $row[10] : 0,
            'rencana_dana_rka' => is_numeric($row[11] ?? null) ? $row[11] : 0,
            
            'prakiraan_maju_target_renja' => $row[12] ?? null,
            'prakiraan_maju_target_rka' => $row[13] ?? null,
            
            'prakiraan_maju_dana_renja' => is_numeric($row[14] ?? null) ? $row[14] : 0,
            'prakiraan_maju_dana_rka' => is_numeric($row[15] ?? null) ? $row[15] : 0,
            
            'kesesuaian' => in_array($row[16] ?? null, ['Ya', 'Tidak']) ? $row[16] : null,
            'evaluasi' => $row[17] ?? null,
            'tindak_lanjut' => $row[18] ?? null,
            'hasil_tindak_lanjut' => $row[19] ?? null,
        ]);
    }
}
