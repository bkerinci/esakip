<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FormulirE81;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\FormulirE81Import;

class FormulirE81Controller extends Controller
{
    public function index()
    {
        $query = FormulirE81::query();
        
        if (auth()->user()->role !== 'super_admin') {
            $query->where('opd_id', auth()->user()->opd_id);
        }
        
        // Group by tahun (similar to RealisasiAnggaran) if needed, but since it's a table we can just fetch all or filter by year in React
        $data = $query->orderBy('tahun', 'desc')->orderBy('created_at', 'desc')->get();

        return Inertia::render('Renja/FormE81', [
            'formulir_data' => $data,
            'tahun_aktif' => date('Y'),
        ]);
    }

    public function store(Request $request)
    {
        // For manual input
        $validated = $request->validate([
            'tahun' => 'required|integer',
            'nomor' => 'nullable|string',
            'sasaran' => 'nullable|string',
            'program' => 'nullable|string',
            'kegiatan' => 'nullable|string',
            'sub_kegiatan' => 'nullable|string',
            'indikator_kinerja' => 'nullable|string',
            'satuan' => 'nullable|string',
            'target_renstra_akhir_kinerja' => 'nullable|numeric',
            'target_renstra_akhir_anggaran' => 'nullable|numeric',
            'realisasi_kinerja_tahun_lalu_kinerja' => 'nullable|numeric',
            'realisasi_kinerja_tahun_lalu_anggaran' => 'nullable|numeric',
            'target_kinerja_tahun_berjalan_kinerja' => 'nullable|numeric',
            'target_kinerja_tahun_berjalan_anggaran' => 'nullable|numeric',
            'realisasi_tw1_kinerja' => 'nullable|numeric',
            'realisasi_tw1_anggaran' => 'nullable|numeric',
            'realisasi_tw2_kinerja' => 'nullable|numeric',
            'realisasi_tw2_anggaran' => 'nullable|numeric',
            'realisasi_tw3_kinerja' => 'nullable|numeric',
            'realisasi_tw3_anggaran' => 'nullable|numeric',
            'realisasi_tw4_kinerja' => 'nullable|numeric',
            'realisasi_tw4_anggaran' => 'nullable|numeric',
            'realisasi_capaian_tahun_dievaluasi_kinerja' => 'nullable|numeric',
            'realisasi_capaian_tahun_dievaluasi_anggaran' => 'nullable|numeric',
            'realisasi_kinerja_renstra_tahun_berjalan_kinerja' => 'nullable|numeric',
            'realisasi_kinerja_renstra_tahun_berjalan_anggaran' => 'nullable|numeric',
            'tingkat_capaian_renstra_tahun_berjalan_kinerja' => 'nullable|numeric',
            'tingkat_capaian_renstra_tahun_berjalan_anggaran' => 'nullable|numeric',
            'unit_penanggung_jawab' => 'nullable|string',
        ]);

        $opd_id = auth()->user()->opd_id;
        if (!$opd_id && auth()->user()->role === 'super_admin') {
            $opd_id = \App\Models\Opd::first()->id ?? 1; // Fallback for super admin testing
        }

        $validated['opd_id'] = $opd_id;

        // Default all null numerics to 0 to prevent issues
        foreach ($validated as $key => $value) {
            if (is_null($value) && str_contains($key, '_kinerja') || str_contains($key, '_anggaran')) {
                $validated[$key] = 0;
            }
        }

        FormulirE81::create($validated);

        return redirect()->back()->with('success', 'Data berhasil ditambahkan.');
    }

    public function import(Request $request)
    {
        $request->validate([
            'tahun' => 'required|integer',
            'file' => 'required|mimes:xlsx,xls'
        ]);

        $opd_id = auth()->user()->opd_id;
        if (!$opd_id && auth()->user()->role === 'super_admin') {
            $opd_id = \App\Models\Opd::first()->id ?? 1; // Fallback for super admin testing
        }

        try {
            Excel::import(new FormulirE81Import($request->tahun, $opd_id), $request->file('file'));
            return redirect()->back()->with('success', 'Data Excel berhasil di-import.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['file' => 'Gagal meng-import: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, $id)
    {
        $record = FormulirE81::findOrFail($id);
        
        if (auth()->user()->role !== 'super_admin' && $record->opd_id !== auth()->user()->opd_id) {
            abort(403);
        }

        $validated = $request->validate([
            'tahun' => 'required|integer',
            'nomor' => 'nullable|string',
            'sasaran' => 'nullable|string',
            'program' => 'nullable|string',
            'kegiatan' => 'nullable|string',
            'sub_kegiatan' => 'nullable|string',
            'indikator_kinerja' => 'nullable|string',
            'satuan' => 'nullable|string',
            'target_renstra_akhir_kinerja' => 'nullable|numeric',
            'target_renstra_akhir_anggaran' => 'nullable|numeric',
            'realisasi_kinerja_tahun_lalu_kinerja' => 'nullable|numeric',
            'realisasi_kinerja_tahun_lalu_anggaran' => 'nullable|numeric',
            'target_kinerja_tahun_berjalan_kinerja' => 'nullable|numeric',
            'target_kinerja_tahun_berjalan_anggaran' => 'nullable|numeric',
            'realisasi_tw1_kinerja' => 'nullable|numeric',
            'realisasi_tw1_anggaran' => 'nullable|numeric',
            'realisasi_tw2_kinerja' => 'nullable|numeric',
            'realisasi_tw2_anggaran' => 'nullable|numeric',
            'realisasi_tw3_kinerja' => 'nullable|numeric',
            'realisasi_tw3_anggaran' => 'nullable|numeric',
            'realisasi_tw4_kinerja' => 'nullable|numeric',
            'realisasi_tw4_anggaran' => 'nullable|numeric',
            'realisasi_capaian_tahun_dievaluasi_kinerja' => 'nullable|numeric',
            'realisasi_capaian_tahun_dievaluasi_anggaran' => 'nullable|numeric',
            'realisasi_kinerja_renstra_tahun_berjalan_kinerja' => 'nullable|numeric',
            'realisasi_kinerja_renstra_tahun_berjalan_anggaran' => 'nullable|numeric',
            'tingkat_capaian_renstra_tahun_berjalan_kinerja' => 'nullable|numeric',
            'tingkat_capaian_renstra_tahun_berjalan_anggaran' => 'nullable|numeric',
            'unit_penanggung_jawab' => 'nullable|string',
        ]);

        foreach ($validated as $key => $value) {
            if (is_null($value) && (str_contains($key, '_kinerja') || str_contains($key, '_anggaran'))) {
                $validated[$key] = 0;
            }
        }

        $record->update($validated);

        return redirect()->back()->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $record = FormulirE81::findOrFail($id);
        
        if (auth()->user()->role !== 'super_admin' && $record->opd_id !== auth()->user()->opd_id) {
            abort(403);
        }

        $record->delete();

        return redirect()->back()->with('success', 'Data berhasil dihapus.');
    }
}
