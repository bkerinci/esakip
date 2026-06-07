<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FormulirE75;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\FormulirE75Import;

class FormulirE75Controller extends Controller
{
    public function index()
    {
        $query = FormulirE75::query();
        
        if (auth()->user()->role !== 'super_admin') {
            $query->where('opd_id', auth()->user()->opd_id);
        }
        
        $data = $query->orderBy('tahun', 'desc')->orderBy('created_at', 'desc')->get();

        return Inertia::render('Renja/FormE75', [
            'formulir_data' => $data,
            'tahun_aktif' => date('Y'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tahun' => 'required|string',
            'kode' => 'nullable|string',
            'program' => 'nullable|string',
            'kegiatan' => 'nullable|string',
            'sub_kegiatan' => 'nullable|string',
            'indikator_kinerja_renja' => 'nullable|string',
            'indikator_kinerja_rka' => 'nullable|string',
            'rencana_lokasi_renja' => 'nullable|string',
            'rencana_lokasi_rka' => 'nullable|string',
            'rencana_target_renja' => 'nullable|string',
            'rencana_target_rka' => 'nullable|string',
            'rencana_dana_renja' => 'nullable|numeric',
            'rencana_dana_rka' => 'nullable|numeric',
            'prakiraan_maju_target_renja' => 'nullable|string',
            'prakiraan_maju_target_rka' => 'nullable|string',
            'prakiraan_maju_dana_renja' => 'nullable|numeric',
            'prakiraan_maju_dana_rka' => 'nullable|numeric',
            'kesesuaian' => 'nullable|string|in:Ya,Tidak',
            'evaluasi' => 'nullable|string',
            'tindak_lanjut' => 'nullable|string',
            'hasil_tindak_lanjut' => 'nullable|string',
        ]);

        $opd_id = auth()->user()->opd_id;
        if (!$opd_id && auth()->user()->role === 'super_admin') {
            $opd_id = \App\Models\Opd::first()->id ?? 1;
        }
        $validated['opd_id'] = $opd_id;
        $validated['user_id'] = auth()->id();

        foreach ($validated as $key => $value) {
            if (is_null($value) && str_contains($key, '_dana_')) {
                $validated[$key] = 0;
            }
        }

        FormulirE75::create($validated);

        return redirect()->back()->with('success', 'Data berhasil ditambahkan.');
    }

    public function import(Request $request)
    {
        $request->validate([
            'tahun' => 'required|string',
            'file' => 'required|mimes:xlsx,xls'
        ]);

        $opd_id = auth()->user()->opd_id;
        if (!$opd_id && auth()->user()->role === 'super_admin') {
            $opd_id = \App\Models\Opd::first()->id ?? 1;
        }

        try {
            Excel::import(new FormulirE75Import($request->tahun, $opd_id), $request->file('file'));
            return redirect()->back()->with('success', 'Data Excel berhasil di-import.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['file' => 'Gagal meng-import: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, $id)
    {
        $record = FormulirE75::findOrFail($id);
        
        if (auth()->user()->role !== 'super_admin' && $record->opd_id !== auth()->user()->opd_id) {
            abort(403);
        }

        $validated = $request->validate([
            'tahun' => 'required|string',
            'kode' => 'nullable|string',
            'program' => 'nullable|string',
            'kegiatan' => 'nullable|string',
            'sub_kegiatan' => 'nullable|string',
            'indikator_kinerja_renja' => 'nullable|string',
            'indikator_kinerja_rka' => 'nullable|string',
            'rencana_lokasi_renja' => 'nullable|string',
            'rencana_lokasi_rka' => 'nullable|string',
            'rencana_target_renja' => 'nullable|string',
            'rencana_target_rka' => 'nullable|string',
            'rencana_dana_renja' => 'nullable|numeric',
            'rencana_dana_rka' => 'nullable|numeric',
            'prakiraan_maju_target_renja' => 'nullable|string',
            'prakiraan_maju_target_rka' => 'nullable|string',
            'prakiraan_maju_dana_renja' => 'nullable|numeric',
            'prakiraan_maju_dana_rka' => 'nullable|numeric',
            'kesesuaian' => 'nullable|string|in:Ya,Tidak',
            'evaluasi' => 'nullable|string',
            'tindak_lanjut' => 'nullable|string',
            'hasil_tindak_lanjut' => 'nullable|string',
        ]);

        foreach ($validated as $key => $value) {
            if (is_null($value) && str_contains($key, '_dana_')) {
                $validated[$key] = 0;
            }
        }

        $record->update($validated);

        return redirect()->back()->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $record = FormulirE75::findOrFail($id);
        
        if (auth()->user()->role !== 'super_admin' && $record->opd_id !== auth()->user()->opd_id) {
            abort(403);
        }

        $record->delete();

        return redirect()->back()->with('success', 'Data berhasil dihapus.');
    }
}
