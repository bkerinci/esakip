<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Iku;
use Inertia\Inertia;

class IkuController extends Controller
{
    public function index()
    {
        $ikuQuery = Iku::query();
        $docQuery = \App\Models\DocumentUpload::where('jenis_dokumen', 'iku');

        if (!in_array(auth()->user()->role, ['super_admin', 'evaluator'])) {
            $ikuQuery->where('opd_id', auth()->user()->opd_id);
            $docQuery->where('opd_id', auth()->user()->opd_id);
        }

        $ikus = $ikuQuery->with('opd')->latest()->get();
        $documents = $docQuery->with('opd')->latest()->get();

        return Inertia::render('Iku/Index', [
            'ikus' => $ikus,
            'documents' => $documents,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'sasaran_strategis' => 'required|string',
            'indikator_kinerja' => 'required|string',
            'satuan' => 'required|string',
            'definisi_operasional' => 'nullable|string',
            'baseline' => 'nullable|string',
            'target' => 'required|string',
            'realisasi' => 'nullable|string',
        ]);

        Iku::create([
            'opd_id' => auth()->user()->opd_id,
            'sasaran_strategis' => $request->sasaran_strategis,
            'indikator_kinerja' => $request->indikator_kinerja,
            'satuan' => $request->satuan,
            'definisi_operasional' => $request->definisi_operasional,
            'baseline' => $request->baseline,
            'target' => $request->target,
            'realisasi' => $request->realisasi,
        ]);

        return redirect()->back()->with('success', 'IKU berhasil ditambahkan.');
    }

    public function destroy($id)
    {
        $iku = Iku::findOrFail($id);
        
        if (auth()->user()->role !== 'super_admin' && $iku->opd_id !== auth()->user()->opd_id) {
            abort(403, 'Unauthorized action.');
        }

        $iku->delete();

        return redirect()->back()->with('success', 'IKU berhasil dihapus.');
    }

    public function storeDocument(Request $request)
    {
        $request->validate([
            'tahun' => 'required|integer',
            'file' => 'required|mimes:pdf|max:10240',
        ]);

        $exists = \App\Models\DocumentUpload::where('opd_id', auth()->user()->opd_id)
            ->where('jenis_dokumen', 'iku')
            ->where('tahun', $request->tahun)
            ->exists();

        if ($exists) {
            return redirect()->back()->withErrors(['tahun' => 'Dokumen IKU untuk tahun ' . $request->tahun . ' sudah pernah diunggah. Silakan hapus dokumen sebelumnya jika ingin memperbarui.'])->withInput();
        }

        $file = $request->file('file');
        
        $menuName = 'IKU';
        $opd = \App\Models\Opd::find(auth()->user()->opd_id);
        $opdName = $opd ? $opd->nama : 'OPD';
        $tahun = $request->tahun;
        $tanggalBulan = date('dm');
        $extension = $file->getClientOriginalExtension();

        $formattedName = "{$menuName}_{$opdName}_{$tahun}_{$tanggalBulan}.{$extension}";
        $formattedName = str_replace(['/', '\\'], '-', $formattedName);

        $path = $file->storeAs('sakip_documents/iku', $formattedName, 'public');

        \App\Models\DocumentUpload::create([
            'opd_id' => auth()->user()->opd_id,
            'jenis_dokumen' => 'iku',
            'tahun' => $request->tahun,
            'file_path' => $path,
            'nama_file' => $formattedName,
        ]);

        return redirect()->back()->with('success', 'Dokumen IKU berhasil diunggah.');
    }
}
