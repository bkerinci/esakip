<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RencanaAksi extends Model
{
    use HasFactory;

    protected $fillable = [
        'opd_id',
        'nomor',
        'sasaran',
        'indikator_kinerja',
        'tw_1',
        'tw_2',
        'tw_3',
        'tw_4',
        'aktifitas',
        'penanggung_jawab',
        'anggaran',
    ];

    public function opd()
    {
        return $this->belongsTo(Opd::class);
    }
}
