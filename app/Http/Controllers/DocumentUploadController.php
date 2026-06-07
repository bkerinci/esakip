<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\DocumentUpload;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class DocumentUploadController extends Controller
{
    private function getDocuments(string $type)
    {
        $query = DocumentUpload::where('jenis_dokumen', $type);
        
        if (!in_array(auth()->user()->role, ['super_admin', 'evaluator'])) {
            $query->where('opd_id', auth()->user()->opd_id);
        }
        
        return $query->with('opd')->latest()->get();
    }

    private function handleUpload(Request $request, string $type)
    {
        $request->validate([
            'tahun' => 'required|integer',
            'file' => 'required|mimes:pdf|max:10240', // max 10MB
        ]);

        // Batasi upload hanya sekali setahun untuk tipe dokumen ini per OPD
        $exists = DocumentUpload::where('opd_id', auth()->user()->opd_id)
            ->where('jenis_dokumen', $type)
            ->where('tahun', $request->tahun)
            ->exists();

        if ($exists) {
            return redirect()->back()->withErrors(['tahun' => 'Dokumen untuk tahun ' . $request->tahun . ' sudah pernah diunggah. Silakan hapus dokumen sebelumnya jika ingin memperbarui.'])->withInput();
        }

        $file = $request->file('file');
        
        $typeNames = [
            'perjanjian_kinerja' => 'Perjanjian Kinerja',
            'perjanjian_kinerja_perubahan' => 'Perjanjian Kinerja Perubahan',
            'lkjip' => 'LKjIP',
            'renstra' => 'Renstra',
            'rencana_aksi' => 'Rencana Aksi',
            'dpa' => 'DPA',
            'calk' => 'CALK',
            'renja_dokumen' => 'Renja Dokumen',
            'renja_form_e70' => 'Renja Form E70',
            'renja_pelaksanaan_renstra' => 'Renja Pelaksanaan Renstra',
            'renja_form_e75' => 'Renja Form E75',
        ];
        $menuName = $typeNames[$type] ?? 'Dokumen';
        $opd = \App\Models\Opd::find(auth()->user()->opd_id);
        $opdName = $opd ? $opd->nama : 'OPD';
        $tahun = $request->tahun;
        $tanggalBulan = date('dm');
        $extension = $file->getClientOriginalExtension();

        // Format: Menu_Nama OPD_tahun_tanggalbulanupload
        $formattedName = "{$menuName}_{$opdName}_{$tahun}_{$tanggalBulan}.{$extension}";

        // Replace slashes or special characters that might break the path
        $formattedName = str_replace(['/', '\\'], '-', $formattedName);

        $path = $file->storeAs('sakip_documents/' . $type, $formattedName, 'public');

        DocumentUpload::create([
            'opd_id' => auth()->user()->opd_id,
            'jenis_dokumen' => $type,
            'tahun' => $request->tahun,
            'file_path' => $path,
            'nama_file' => $formattedName,
        ]);

        return redirect()->back()->with('success', 'Dokumen berhasil diunggah.');
    }

    public function perjanjianKinerjaIndex()
    {
        return Inertia::render('Document/PerjanjianKinerja', [
            'documents' => $this->getDocuments('perjanjian_kinerja'),
            'documents_perubahan' => $this->getDocuments('perjanjian_kinerja_perubahan'),
        ]);
    }

    public function storePerjanjianKinerja(Request $request)
    {
        return $this->handleUpload($request, 'perjanjian_kinerja');
    }

    public function storePerjanjianKinerjaPerubahan(Request $request)
    {
        return $this->handleUpload($request, 'perjanjian_kinerja_perubahan');
    }

    public function lkjipIndex()
    {
        return Inertia::render('Document/Lkjip', [
            'documents' => $this->getDocuments('lkjip'),
        ]);
    }

    public function storeLkjip(Request $request)
    {
        return $this->handleUpload($request, 'lkjip');
    }

    public function renstraIndex()
    {
        return Inertia::render('Document/Renstra', [
            'documents' => $this->getDocuments('renstra'),
            'jenis' => 'Renstra'
        ]);
    }

    public function storeRenstra(Request $request)
    {
        return $this->handleUpload($request, 'renstra');
    }

    public function rencanaAksiIndex()
    {
        return Inertia::render('Document/RencanaAksi', [
            'documents' => $this->getDocuments('rencana_aksi'),
            'jenis' => 'Rencana Aksi'
        ]);
    }

    public function storeRencanaAksi(Request $request)
    {
        return $this->handleUpload($request, 'rencana_aksi');
    }

    public function dpaIndex()
    {
        return Inertia::render('Document/Dpa', [
            'documents' => $this->getDocuments('dpa'),
            'jenis' => 'DPA'
        ]);
    }

    public function storeDpa(Request $request)
    {
        return $this->handleUpload($request, 'dpa');
    }

    public function calkIndex()
    {
        return Inertia::render('Document/Calk', [
            'documents' => $this->getDocuments('calk'),
            'jenis' => 'Catatan Atas Laporan Keuangan (CALK)'
        ]);
    }

    public function storeCalk(Request $request)
    {
        return $this->handleUpload($request, 'calk');
    }

    public function genericRenjaIndex($type)
    {
        $types = [
            'dokumen' => 'Dokumen Renja',
            'form_e70' => 'Formulir E.70',
            'pelaksanaan_renstra' => 'Pelaksanaan Renstra',
            'form_e75' => 'Formulir E.75',
        ];

        if (!array_key_exists($type, $types)) abort(404);

        return Inertia::render('Document/GenericDocument', [
            'documents' => $this->getDocuments('renja_' . $type),
            'title' => $types[$type],
            'uploadRoute' => 'renja.generic.store',
            'uploadType' => $type
        ]);
    }

    public function genericRenjaStore(Request $request, $type)
    {
        $types = ['dokumen', 'form_e70', 'pelaksanaan_renstra', 'form_e75'];
        if (!in_array($type, $types)) abort(404);
        
        return $this->handleUpload($request, 'renja_' . $type);
    }

    public function download($id)
    {
        $document = DocumentUpload::findOrFail($id);

        if (!in_array(auth()->user()->role, ['super_admin', 'evaluator'])) {
            if ($document->opd_id !== auth()->user()->opd_id) {
                abort(403, 'Unauthorized action.');
            }
        }

        return Storage::disk('public')->download($document->file_path, $document->nama_file);
    }

    public function view($id)
    {
        $document = DocumentUpload::findOrFail($id);

        if (!in_array(auth()->user()->role, ['super_admin', 'evaluator'])) {
            if ($document->opd_id !== auth()->user()->opd_id) {
                abort(403, 'Unauthorized action.');
            }
        }

        $path = storage_path('app/public/' . $document->file_path);
        
        if (!file_exists($path)) {
            abort(404, 'File not found.');
        }

        return response()->file($path);
    }

    public function publicDownload($id)
    {
        $document = DocumentUpload::findOrFail($id);
        return Storage::disk('public')->download($document->file_path, $document->nama_file);
    }

    public function publicView($id)
    {
        $document = DocumentUpload::findOrFail($id);
        $path = storage_path('app/public/' . $document->file_path);
        
        if (!file_exists($path)) {
            abort(404, 'File not found.');
        }

        return response()->file($path);
    }

    public function destroy($id)
    {
        $document = DocumentUpload::findOrFail($id);

        if (auth()->user()->role !== 'super_admin') {
            if ($document->opd_id !== auth()->user()->opd_id) {
                abort(403, 'Unauthorized action.');
            }
        }

        if (Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }

        $document->delete();

        return redirect()->back()->with('success', 'Dokumen berhasil dihapus.');
    }
}
