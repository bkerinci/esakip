<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormulirE81 extends Model
{
    protected $fillable = [
        'opd_id',
        'tahun',
        'nomor',
        'sasaran',
        'program',
        'kegiatan',
        'sub_kegiatan',
        'indikator_kinerja',
        'satuan',
        'target_renstra_akhir_kinerja',
        'target_renstra_akhir_anggaran',
        'realisasi_kinerja_tahun_lalu_kinerja',
        'realisasi_kinerja_tahun_lalu_anggaran',
        'target_kinerja_tahun_berjalan_kinerja',
        'target_kinerja_tahun_berjalan_anggaran',
        'realisasi_tw1_kinerja',
        'realisasi_tw1_anggaran',
        'realisasi_tw2_kinerja',
        'realisasi_tw2_anggaran',
        'realisasi_tw3_kinerja',
        'realisasi_tw3_anggaran',
        'realisasi_tw4_kinerja',
        'realisasi_tw4_anggaran',
        'realisasi_capaian_tahun_dievaluasi_kinerja',
        'realisasi_capaian_tahun_dievaluasi_anggaran',
        'realisasi_kinerja_renstra_tahun_berjalan_kinerja',
        'realisasi_kinerja_renstra_tahun_berjalan_anggaran',
        'tingkat_capaian_renstra_tahun_berjalan_kinerja',
        'tingkat_capaian_renstra_tahun_berjalan_anggaran',
        'unit_penanggung_jawab',
    ];
}
