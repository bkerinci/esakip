<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RencanaAksi;
use App\Models\Opd;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\RencanaAksiImport;

class RencanaAksiController extends Controller
{
    public function index()
    {
        $query = RencanaAksi::query();
        
        if (!in_array(auth()->user()->role, ['super_admin', 'evaluator'])) {
            $query->where('opd_id', auth()->user()->opd_id);
        }
        
        $rencana_aksis = $query->latest()->get();

        return Inertia::render('Document/RencanaAksi', [
            'rencana_aksis' => $rencana_aksis,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nomor' => 'nullable|string',
            'sasaran' => 'nullable|string',
            'indikator_kinerja' => 'nullable|string',
            'tw_1' => 'nullable|string',
            'tw_2' => 'nullable|string',
            'tw_3' => 'nullable|string',
            'tw_4' => 'nullable|string',
            'aktifitas' => 'nullable|string',
            'penanggung_jawab' => 'nullable|string',
            'anggaran' => 'nullable|string',
        ]);

        $validated['opd_id'] = auth()->user()->opd_id;

        RencanaAksi::create($validated);

        return redirect()->back()->with('success', 'Data Rencana Aksi berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $rencanaAksi = RencanaAksi::findOrFail($id);
        
        if (auth()->user()->role !== 'super_admin' && $rencanaAksi->opd_id !== auth()->user()->opd_id) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'nomor' => 'nullable|string',
            'sasaran' => 'nullable|string',
            'indikator_kinerja' => 'nullable|string',
            'tw_1' => 'nullable|string',
            'tw_2' => 'nullable|string',
            'tw_3' => 'nullable|string',
            'tw_4' => 'nullable|string',
            'aktifitas' => 'nullable|string',
            'penanggung_jawab' => 'nullable|string',
            'anggaran' => 'nullable|string',
        ]);

        $rencanaAksi->update($validated);

        return redirect()->back()->with('success', 'Data Rencana Aksi berhasil diubah.');
    }

    public function destroy($id)
    {
        $rencanaAksi = RencanaAksi::findOrFail($id);
        
        if (auth()->user()->role !== 'super_admin' && $rencanaAksi->opd_id !== auth()->user()->opd_id) {
            abort(403, 'Unauthorized action.');
        }

        $rencanaAksi->delete();

        return redirect()->back()->with('success', 'Data Rencana Aksi berhasil dihapus.');
    }

    public function importExcel(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls|max:10240',
        ]);

        // Delete existing data for this OPD if they upload a new excel (optional)
        // RencanaAksi::where('opd_id', auth()->user()->opd_id)->delete();

        Excel::import(new RencanaAksiImport(auth()->user()->opd_id), $request->file('file'));

        return redirect()->back()->with('success', 'Data Rencana Aksi berhasil diimpor dari Excel.');
    }

    public function printPdf()
    {
        $query = RencanaAksi::query();
        
        if (!in_array(auth()->user()->role, ['super_admin', 'evaluator'])) {
            $query->where('opd_id', auth()->user()->opd_id);
        }
        
        $rencana_aksis = $query->latest()->get();
        $opd = Opd::find(auth()->user()->opd_id);

        return Inertia::render('Document/PrintRencanaAksi', [
            'rencana_aksis' => $rencana_aksis,
            'opd_name' => $opd ? $opd->nama : 'Semua OPD'
        ]);
    }
}
