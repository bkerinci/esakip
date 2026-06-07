<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentUpload extends Model
{
    protected $fillable = [
        'opd_id',
        'jenis_dokumen',
        'tahun',
        'file_path',
        'nama_file',
    ];

    public function opd()
    {
        return $this->belongsTo(Opd::class, 'opd_id');
    }
}
