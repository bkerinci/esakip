<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Loggable;

class RealisasiKinerja extends Model
{
    use HasFactory, Loggable;

    protected $fillable = ['target_kinerja_id', 'triwulan', 'realisasi', 'penjelasan', 'status_capaian'];

    public function targetKinerja()
    {
        return $this->belongsTo(TargetKinerja::class);
    }
}
