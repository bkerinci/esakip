<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\PelaksanaanRenstra;
use App\Imports\PelaksanaanRenstraImport;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;

class PelaksanaanRenstraController extends Controller
{
    public function index()
    {
        $query = PelaksanaanRenstra::query();
        
        if (auth()->user()->role !== 'super_admin') {
            $query->where('opd_id', auth()->user()->opd_id);
        }
        
        $data = $query->orderBy('nomor', 'asc')->orderBy('created_at', 'asc')->get();

        return Inertia::render('Renja/FormPelaksanaanRenstra', [
            'formulir_data' => $data,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nomor' => 'nullable|integer',
            'renstra_pd' => 'nullable|string',
            'renja_pd' => 'nullable|string',
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

        PelaksanaanRenstra::create($validated);

        return redirect()->back()->with('success', 'Data berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $record = PelaksanaanRenstra::findOrFail($id);
        
        if (auth()->user()->role !== 'super_admin' && $record->opd_id !== auth()->user()->opd_id) {
            abort(403);
        }

        $validated = $request->validate([
            'nomor' => 'nullable|integer',
            'renstra_pd' => 'nullable|string',
            'renja_pd' => 'nullable|string',
            'kesesuaian' => 'nullable|string|in:Ya,Tidak',
            'evaluasi' => 'nullable|string',
            'tindak_lanjut' => 'nullable|string',
            'hasil_tindak_lanjut' => 'nullable|string',
        ]);

        $record->update($validated);

        return redirect()->back()->with('success', 'Data berhasil diperbarui.');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls'
        ]);

        $opd_id = auth()->user()->opd_id;
        if (!$opd_id && auth()->user()->role === 'super_admin') {
            $opd_id = \App\Models\Opd::first()->id ?? 1;
        }

        try {
            Excel::import(new PelaksanaanRenstraImport($opd_id), $request->file('file'));
            return redirect()->back()->with('success', 'Data Excel berhasil diimport!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['file' => 'Error import data: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $record = PelaksanaanRenstra::findOrFail($id);
        
        if (auth()->user()->role !== 'super_admin' && $record->opd_id !== auth()->user()->opd_id) {
            abort(403);
        }

        $record->delete();

        return redirect()->back()->with('success', 'Data berhasil dihapus.');
    }
}
