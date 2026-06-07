<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicController extends Controller
{
    protected $kinerjaService;
    protected $opdRepository;

    public function __construct(\App\Services\KinerjaService $kinerjaService, \App\Repositories\OpdRepository $opdRepository)
    {
        $this->kinerjaService = $kinerjaService;
        $this->opdRepository = $opdRepository;
    }

    public function index()
    {
        $statistik = $this->kinerjaService->getStatistikDashboard();
        return Inertia::render('Public/Home', [
            'statistik' => $statistik
        ]);
    }

    public function sakipPublik()
    {
        $dataOpd = $this->opdRepository->getAll();
        $ikus = \App\Models\Iku::with('opd')->get();
        $e81s = \App\Models\FormulirE81::all();
        
        return Inertia::render('Public/SakipPublik', [
            'dataOpd' => $dataOpd,
            'ikus' => $ikus,
            'e81s' => $e81s
        ]);
    }

    public function perencanaan()
    {
        // Data master dokumen perencanaan publik
        $dokumen = [
            ['id' => 1, 'nama' => 'Rencana Pembangunan Jangka Menengah Daerah (RPJMD)', 'tahun' => '2021-2026', 'link' => '#', 'icon' => '📘'],
            ['id' => 2, 'nama' => 'Rencana Strategis (RENSTRA) Perangkat Daerah', 'tahun' => '2021-2026', 'link' => '#', 'icon' => '📗'],
            ['id' => 3, 'nama' => 'Indikator Kinerja Utama (IKU) Pemerintah Daerah', 'tahun' => date('Y'), 'link' => '#', 'icon' => '🎯'],
            ['id' => 4, 'nama' => 'Rencana Kerja Pemerintah Daerah (RKPD)', 'tahun' => date('Y'), 'link' => '#', 'icon' => '🗓️'],
            ['id' => 5, 'nama' => 'Perjanjian Kinerja (PK) Walikota', 'tahun' => date('Y'), 'link' => '#', 'icon' => '🤝'],
        ];

        // Get OPDs with their specific documents
        $opds = \App\Models\Opd::with(['documents' => function ($query) {
            $query->whereIn('jenis_dokumen', ['renstra', 'perjanjian_kinerja', 'iku']);
        }])->get();

        return Inertia::render('Public/Perencanaan', [
            'dokumen' => $dokumen,
            'opds' => $opds
        ]);
    }

    public function pelaporan()
    {
        // Data master dokumen pelaporan publik
        $dokumen = [
            ['id' => 1, 'nama' => 'Laporan Kinerja Instansi Pemerintah (LKJIP) Pemerintah Daerah', 'tahun' => date('Y') - 1, 'link' => '#', 'icon' => '📊'],
            ['id' => 2, 'nama' => 'Catatan Atas Laporan Keuangan (CALK) Pemerintah Daerah', 'tahun' => date('Y') - 1, 'link' => '#', 'icon' => '📔'],
        ];

        // Get OPDs with their specific documents
        $opds = \App\Models\Opd::with(['documents' => function ($query) {
            $query->whereIn('jenis_dokumen', ['lkjip', 'calk']);
        }])->get();

        return Inertia::render('Public/Pelaporan', [
            'dokumen' => $dokumen,
            'opds' => $opds
        ]);
    }

    public function evaluasi()
    {
        // Data master dokumen evaluasi publik
        $dokumen = [
            ['id' => 1, 'nama' => 'Laporan Hasil Evaluasi (LHE) SAKIP', 'tahun' => date('Y'), 'link' => '#', 'icon' => '📈'],
        ];

        // Get OPDs with their specific documents
        $opds = \App\Models\Opd::with(['documents' => function ($query) {
            $query->whereIn('jenis_dokumen', ['lhe']);
        }])->get();

        return Inertia::render('Public/Evaluasi', [
            'dokumen' => $dokumen,
            'opds' => $opds
        ]);
    }

    public function detailOpd($id)
    {
        $opd = \App\Models\Opd::findOrFail($id);
        
        return Inertia::render('Public/DetailOpd', [
            'opd' => $opd
        ]);
    }

    public function storeFeedback(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'pesan' => 'required|string',
        ]);

        \App\Models\Feedback::create($request->all());

        return redirect()->back()->with('success', 'Terima kasih! Pesan Anda telah kami terima.');
    }
}
