<?php

namespace App\Http\Controllers;

use App\Models\Peraturan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PeraturanController extends Controller
{
    public function publicIndex()
    {
        $peraturan = Peraturan::orderBy('tahun', 'desc')->get();
        return Inertia::render('Public/Peraturan', [
            'peraturan' => $peraturan
        ]);
    }

    public function index()
    {
        $peraturan = Peraturan::orderBy('tahun', 'desc')->get();
        return Inertia::render('Peraturan/Index', [
            'peraturan' => $peraturan
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'uraian' => 'required|string',
            'nomor' => 'required|string',
            'tahun' => 'required|integer',
            'file' => 'required|mimes:pdf|max:10240', // 10MB max
        ]);

        $file = $request->file('file');
        $namaFile = $file->getClientOriginalName();
        $filePath = $file->storeAs('sakip_documents/peraturan', time() . '_' . $namaFile, 'public');

        Peraturan::create([
            'uraian' => $request->uraian,
            'nomor' => $request->nomor,
            'tahun' => $request->tahun,
            'file_path' => $filePath,
            'nama_file' => $namaFile,
        ]);

        return redirect()->back()->with('success', 'Peraturan berhasil diunggah.');
    }

    public function view($id)
    {
        $peraturan = Peraturan::findOrFail($id);
        
        if (!Storage::disk('public')->exists($peraturan->file_path)) {
            abort(404);
        }

        $path = Storage::disk('public')->path($peraturan->file_path);
        return response()->file($path);
    }

    public function download($id)
    {
        $peraturan = Peraturan::findOrFail($id);

        if (!Storage::disk('public')->exists($peraturan->file_path)) {
            return redirect()->back()->with('error', 'File tidak ditemukan.');
        }

        return Storage::disk('public')->download($peraturan->file_path, $peraturan->nama_file);
    }

    public function destroy($id)
    {
        $peraturan = Peraturan::findOrFail($id);

        if (Storage::disk('public')->exists($peraturan->file_path)) {
            Storage::disk('public')->delete($peraturan->file_path);
        }

        $peraturan->delete();

        return redirect()->back()->with('success', 'Peraturan berhasil dihapus.');
    }
}
