<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Loggable;

class Iku extends Model
{
    use HasFactory, Loggable;

    protected $fillable = [
        'opd_id',
        'sasaran_strategis',
        'indikator_kinerja',
        'satuan',
        'definisi_operasional',
        'baseline',
        'target',
        'realisasi',
    ];

    public function opd()
    {
        return $this->belongsTo(Opd::class, 'opd_id');
    }
}
