<?php

namespace App\Repositories;

use App\Models\Opd;

class OpdRepository
{
    public function getAll()
    {
        return Opd::all();
    }

    public function getById($id)
    {
        return Opd::findOrFail($id);
    }
}
