<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Loggable;

class TargetKinerja extends Model
{
    use HasFactory, Loggable;

    protected $fillable = ['iku_id', 'tahun', 'target'];

    public function iku()
    {
        return $this->belongsTo(Iku::class);
    }

    public function realisasiKinerjas()
    {
        return $this->hasMany(RealisasiKinerja::class);
    }
}
