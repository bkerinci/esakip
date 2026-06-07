<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Loggable;

class PohonKinerja extends Model
{
    use HasFactory, Loggable;

    protected $fillable = [
        'parent_id',
        'opd_id',
        'jenis_node',
        'deskripsi',
        'indikator',
        'target',
        'is_crosscutting',
    ];
}
