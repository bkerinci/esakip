<?php

namespace App\Http\Controllers;

use App\Models\RealisasiAnggaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RealisasiAnggaranController extends Controller
{
    public function index(Request $request)
    {
        $tahun = $request->get('tahun', date('Y'));
        
        $opd_id = auth()->user()->opd_id;
        $opd_nama = 'E-SAKIP Juara';

        if (!$opd_id) {
            $firstOpd = \App\Models\Opd::first();
            $opd_id = $firstOpd ? $firstOpd->id : null;
            $opd_nama = $firstOpd ? $firstOpd->nama : 'Super Admin';
        } else {
            $opd = \App\Models\Opd::find($opd_id);
            $opd_nama = $opd ? $opd->nama : 'Instansi';
        }

        $realisasi = RealisasiAnggaran::where('opd_id', $opd_id)
            ->where('tahun', $tahun)
            ->orderBy('triwulan', 'asc')
            ->orderBy('program', 'asc')
            ->orderBy('kegiatan', 'asc')
            ->orderBy('sub_kegiatan', 'asc')
            ->get();

        return Inertia::render('RealisasiAnggaran/Index', [
            'realisasi' => $realisasi,
            'tahun_aktif' => $tahun,
            'opd_nama' => $opd_nama
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'tahun' => 'required|integer',
            'triwulan' => 'required|integer|in:1,2,3,4',
            'program' => 'required|string',
            'kegiatan' => 'required|string',
            'sub_kegiatan' => 'required|string',
            
            'pegawai_anggaran' => 'required|numeric',
            'pegawai_realisasi_keuangan' => 'required|numeric',
            'pegawai_realisasi_fisik' => 'required|numeric|min:0|max:100',
            
            'barang_jasa_anggaran' => 'required|numeric',
            'barang_jasa_realisasi_keuangan' => 'required|numeric',
            'barang_jasa_realisasi_fisik' => 'required|numeric|min:0|max:100',
            
            'modal_anggaran' => 'required|numeric',
            'modal_realisasi_keuangan' => 'required|numeric',
            'modal_realisasi_fisik' => 'required|numeric|min:0|max:100',
            
            'hibah_anggaran' => 'required|numeric',
            'hibah_realisasi_keuangan' => 'required|numeric',
            'hibah_realisasi_fisik' => 'required|numeric|min:0|max:100',
        ]);

        $opd_id = auth()->user()->opd_id;
        if (!$opd_id) {
            // Fallback for Super Admin testing
            $firstOpd = \App\Models\Opd::first();
            $opd_id = $firstOpd ? $firstOpd->id : null;
        }
        $data['opd_id'] = $opd_id;

        RealisasiAnggaran::create($data);

        return redirect()->back()->with('success', 'Data realisasi berhasil ditambahkan.');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:10240',
        ]);

        $opd_id = auth()->user()->opd_id;
        if (!$opd_id) {
            $firstOpd = \App\Models\Opd::first();
            $opd_id = $firstOpd ? $firstOpd->id : null;
        }

        try {
            \Maatwebsite\Excel\Facades\Excel::import(new \App\Imports\RealisasiAnggaranImport($opd_id), $request->file('file'));
            return redirect()->back()->with('success', 'Data realisasi berhasil diimpor dari Excel.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['file' => 'Gagal mengimpor file: ' . $e->getMessage()]);
        }
    }
}
