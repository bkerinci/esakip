<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormulirE70 extends Model
{
    protected $table = 'formulir_e70s';

    protected $fillable = [
        'opd_id',
        'nomor',
        'jenis_kegiatan',
        'kesesuaian',
        'faktor_penyebab',
        'tindak_lanjut',
    ];

    public function opd()
    {
        return $this->belongsTo(Opd::class);
    }
}
