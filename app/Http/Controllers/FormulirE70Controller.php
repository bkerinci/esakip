<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\FormulirE70;
use Inertia\Inertia;

class FormulirE70Controller extends Controller
{
    public function index()
    {
        $query = FormulirE70::query();
        
        if (auth()->user()->role !== 'super_admin') {
            $query->where('opd_id', auth()->user()->opd_id);
        }
        
        // Sort by nomor or created_at
        $data = $query->orderBy('nomor', 'asc')->orderBy('created_at', 'asc')->get();

        return Inertia::render('Renja/FormE70', [
            'formulir_data' => $data,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nomor' => 'nullable|integer',
            'jenis_kegiatan' => 'nullable|string',
            'kesesuaian' => 'nullable|string|in:Ada,Tidak Ada',
            'faktor_penyebab' => 'nullable|string',
            'tindak_lanjut' => 'nullable|string',
        ]);

        $opd_id = auth()->user()->opd_id;
        if (!$opd_id && auth()->user()->role === 'super_admin') {
            $opd_id = \App\Models\Opd::first()->id ?? 1;
        }
        $validated['opd_id'] = $opd_id;

        FormulirE70::create($validated);

        return redirect()->back()->with('success', 'Data berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $record = FormulirE70::findOrFail($id);
        
        if (auth()->user()->role !== 'super_admin' && $record->opd_id !== auth()->user()->opd_id) {
            abort(403);
        }

        $validated = $request->validate([
            'nomor' => 'nullable|integer',
            'jenis_kegiatan' => 'nullable|string',
            'kesesuaian' => 'nullable|string|in:Ada,Tidak Ada',
            'faktor_penyebab' => 'nullable|string',
            'tindak_lanjut' => 'nullable|string',
        ]);

        $record->update($validated);

        return redirect()->back()->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $record = FormulirE70::findOrFail($id);
        
        if (auth()->user()->role !== 'super_admin' && $record->opd_id !== auth()->user()->opd_id) {
            abort(403);
        }

        $record->delete();

        return redirect()->back()->with('success', 'Data berhasil dihapus.');
    }
}
