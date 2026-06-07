<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PelaksanaanRenstra extends Model
{
    protected $fillable = [
        'opd_id',
        'nomor',
        'renstra_pd',
        'renja_pd',
        'kesesuaian',
        'evaluasi',
        'tindak_lanjut',
        'hasil_tindak_lanjut',
    ];

    public function opd()
    {
        return $this->belongsTo(\App\Models\Opd::class);
    }
}
