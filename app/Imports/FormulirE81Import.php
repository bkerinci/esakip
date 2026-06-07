<?php

namespace App\Imports;

use App\Models\FormulirE81;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithStartRow;

class FormulirE81Import implements ToModel, WithStartRow
{
    private $tahun;
    private $opd_id;

    public function __construct($tahun, $opd_id)
    {
        $this->tahun = $tahun;
        $this->opd_id = $opd_id;
    }

    /**
     * @return int
     */
    public function startRow(): int
    {
        return 3; // Start from row 3 assuming rows 1-2 are complex headers
    }

    public function model(array $row)
    {
        // Skip empty rows
        if (!isset($row[0]) && !isset($row[1])) {
            return null;
        }

        // Assuming standard column structure (0-indexed):
        // 0: Nomor
        // 1: Sasaran
        // 2: Program
        // 3: Kegiatan
        // 4: Sub Kegiatan
        // 5: Indikator Kinerja
        // 6: Satuan
        // 7: Target Renstra Fisik, 8: Target Renstra Keuangan
        // 9: Realisasi Tahun Lalu Fisik, 10: Realisasi Tahun Lalu Keuangan
        // 11: Target Tahun Berjalan Fisik, 12: Target Tahun Berjalan Keuangan
        // 13: TW1 Fisik, 14: TW1 Keuangan
        // 15: TW2 Fisik, 16: TW2 Keuangan
        // 17: TW3 Fisik, 18: TW3 Keuangan
        // 19: TW4 Fisik, 20: TW4 Keuangan
        // 21: Realisasi Capaian Evaluasi Fisik, 22: Realisasi Capaian Evaluasi Keuangan
        // 23: Realisasi Renstra s/d Tahun Berjalan Fisik, 24: Realisasi Renstra s/d Tahun Berjalan Keuangan
        // 25: Tingkat Capaian Renstra s/d Tahun Berjalan Fisik, 26: Tingkat Capaian Renstra s/d Tahun Berjalan Keuangan
        // 27: Unit Penanggung Jawab

        return new FormulirE81([
            'opd_id' => $this->opd_id,
            'tahun' => $this->tahun,
            'nomor' => $row[0] ?? null,
            'sasaran' => $row[1] ?? null,
            'program' => $row[2] ?? null,
            'kegiatan' => $row[3] ?? null,
            'sub_kegiatan' => $row[4] ?? null,
            'indikator_kinerja' => $row[5] ?? null,
            'satuan' => $row[6] ?? null,
            
            'target_renstra_akhir_kinerja' => is_numeric($row[7] ?? null) ? $row[7] : 0,
            'target_renstra_akhir_anggaran' => is_numeric($row[8] ?? null) ? $row[8] : 0,
            
            'realisasi_kinerja_tahun_lalu_kinerja' => is_numeric($row[9] ?? null) ? $row[9] : 0,
            'realisasi_kinerja_tahun_lalu_anggaran' => is_numeric($row[10] ?? null) ? $row[10] : 0,
            
            'target_kinerja_tahun_berjalan_kinerja' => is_numeric($row[11] ?? null) ? $row[11] : 0,
            'target_kinerja_tahun_berjalan_anggaran' => is_numeric($row[12] ?? null) ? $row[12] : 0,
            
            'realisasi_tw1_kinerja' => is_numeric($row[13] ?? null) ? $row[13] : 0,
            'realisasi_tw1_anggaran' => is_numeric($row[14] ?? null) ? $row[14] : 0,
            
            'realisasi_tw2_kinerja' => is_numeric($row[15] ?? null) ? $row[15] : 0,
            'realisasi_tw2_anggaran' => is_numeric($row[16] ?? null) ? $row[16] : 0,
            
            'realisasi_tw3_kinerja' => is_numeric($row[17] ?? null) ? $row[17] : 0,
            'realisasi_tw3_anggaran' => is_numeric($row[18] ?? null) ? $row[18] : 0,
            
            'realisasi_tw4_kinerja' => is_numeric($row[19] ?? null) ? $row[19] : 0,
            'realisasi_tw4_anggaran' => is_numeric($row[20] ?? null) ? $row[20] : 0,
            
            'realisasi_capaian_tahun_dievaluasi_kinerja' => is_numeric($row[21] ?? null) ? $row[21] : 0,
            'realisasi_capaian_tahun_dievaluasi_anggaran' => is_numeric($row[22] ?? null) ? $row[22] : 0,
            
            'realisasi_kinerja_renstra_tahun_berjalan_kinerja' => is_numeric($row[23] ?? null) ? $row[23] : 0,
            'realisasi_kinerja_renstra_tahun_berjalan_anggaran' => is_numeric($row[24] ?? null) ? $row[24] : 0,
            
            'tingkat_capaian_renstra_tahun_berjalan_kinerja' => is_numeric($row[25] ?? null) ? $row[25] : 0,
            'tingkat_capaian_renstra_tahun_berjalan_anggaran' => is_numeric($row[26] ?? null) ? $row[26] : 0,
            
            'unit_penanggung_jawab' => $row[27] ?? null,
        ]);
    }
}
