<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormulirE75 extends Model
{
    protected $table = 'formulir_e75s';

    protected $fillable = [
        'user_id', 'opd_id', 'tahun', 'kode', 'program', 'kegiatan', 'sub_kegiatan',
        'indikator_kinerja_renja', 'indikator_kinerja_rka',
        'rencana_lokasi_renja', 'rencana_lokasi_rka',
        'rencana_target_renja', 'rencana_target_rka',
        'rencana_dana_renja', 'rencana_dana_rka',
        'prakiraan_maju_target_renja', 'prakiraan_maju_target_rka',
        'prakiraan_maju_dana_renja', 'prakiraan_maju_dana_rka',
        'kesesuaian', 'evaluasi', 'tindak_lanjut', 'hasil_tindak_lanjut'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function opd()
    {
        return $this->belongsTo(Opd::class);
    }
}
