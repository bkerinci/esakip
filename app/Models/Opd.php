<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Opd extends Model
{
    protected $fillable = ['nama', 'singkatan'];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function documents()
    {
        return $this->hasMany(DocumentUpload::class, 'opd_id');
    }

    public function ikus()
    {
        return $this->hasMany(Iku::class, 'opd_id');
    }

    public function pohonKinerja()
    {
        return $this->hasMany(PohonKinerja::class, 'opd_id');
    }

    public function rencanaAksis()
    {
        return $this->hasMany(RencanaAksi::class, 'opd_id');
    }
}
