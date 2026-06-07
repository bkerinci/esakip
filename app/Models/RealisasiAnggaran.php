<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\Loggable;

class RealisasiAnggaran extends Model
{
    use HasFactory, Loggable;

    protected $guarded = ['id'];

    public function opd()
    {
        return $this->belongsTo(Opd::class);
    }
}
