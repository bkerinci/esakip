<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Peraturan extends Model
{
    protected $fillable = [
        'uraian',
        'nomor',
        'tahun',
        'file_path',
        'nama_file',
    ];
}
