<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Opd;
use App\Models\DocumentUpload;
use App\Models\Iku;
use App\Services\SipandaiAiService;

class SipandaiController extends Controller
{
    protected $aiService;

    public function __construct(SipandaiAiService $aiService)
    {
        $this->aiService = $aiService;
    }

    public function index()
    {
        $totalOpd = Opd::count() ?: 1;

        // 1. Radar Chart Data (Komponen SAKIP)
        $perencanaanCount = DocumentUpload::whereIn('jenis_dokumen', ['Renstra', 'Renja', 'Perjanjian Kinerja'])->count();
        $pelaporanCount = DocumentUpload::where('jenis_dokumen', 'LKjIP')->count();
        $pengukuranCount = Iku::count();

        $radarPerencanaan = min(100, ($perencanaanCount / ($totalOpd * 3)) * 100);
        $radarPengukuran = min(100, ($pengukuranCount / ($totalOpd * 5)) * 100); 
        $radarPelaporan = min(100, ($pelaporanCount / $totalOpd) * 100);
        
        $radarPerencanaan = $radarPerencanaan > 0 ? $radarPerencanaan : 10;
        $radarPengukuran = $radarPengukuran > 0 ? $radarPengukuran : 15;
        $radarPelaporan = $radarPelaporan > 0 ? $radarPelaporan : 5;

        // 2. Forecasting via SipandaiAiService
        $forecastData = $this->aiService->getForecastingData();
        $rataCapaian = array_sum($forecastData) / 4;

        // 3. Anomaly & Risk Analysis via SipandaiAiService
        $riskyOpds = collect($this->aiService->getOpdRiskAnalysis());
        $opdBerisikoTinggi = $riskyOpds->where('risiko', 'Tinggi')->count();
        
        $anomali = Iku::whereNull('target')->orWhereNull('realisasi')->count();

        // 4. Insights Generation
        $insights = [];
        if ($opdBerisikoTinggi > 0) {
            $insights[] = [
                'type' => 'warning',
                'color' => 'rose',
                'text' => "Terdapat {$opdBerisikoTinggi} OPD dengan risiko kinerja tinggi. Segera lakukan peninjauan."
            ];
        } else {
            $insights[] = [
                'type' => 'success',
                'color' => 'emerald',
                'text' => "Tidak ada OPD berisiko tinggi. Kinerja daerah stabil."
            ];
        }

        if ($anomali > 0) {
            $insights[] = [
                'type' => 'alert',
                'color' => 'amber',
                'text' => "Ditemukan {$anomali} anomali data indikator kinerja (IKU tidak memiliki target)."
            ];
        }

        if ($rataCapaian < 50) {
            $insights[] = [
                'type' => 'recommendation',
                'color' => 'indigo',
                'text' => "Rekomendasi AI: Berdasarkan tren forecasting, percepat penyerapan anggaran untuk mengejar sisa target."
            ];
        } else {
            $insights[] = [
                'type' => 'recommendation',
                'color' => 'indigo',
                'text' => "Rekomendasi AI: Tren prediksi akhir tahun positif. Pertahankan keselarasan pohon kinerja."
            ];
        }

        return Inertia::render('Sipandai/Index', [
            'analytics' => [
                'radar' => [
                    round($radarPerencanaan, 1),
                    round($radarPengukuran, 1),
                    round($radarPelaporan, 1),
                    65, 
                    round($rataCapaian, 1) 
                ],
                'forecasting' => $forecastData,
                'kpi' => [
                    'rata_rata_capaian' => round($rataCapaian, 1),
                    'opd_berisiko' => $opdBerisikoTinggi,
                    'anomali' => $anomali,
                ],
                'insights' => $insights,
                'opd_berisiko_list' => $riskyOpds->take(3)->values()->all() // ambil top 3 berisiko
            ],
            'opdsWithLhe' => Opd::with([
                'documents' => function($q) {
                    $q->whereIn('jenis_dokumen', [
                        'lhe', 'iku', 'perjanjian_kinerja', 'perjanjian_kinerja_perubahan', 
                        'dpa', 'rencana_aksi', 'renstra', 'lkjip', 'calk',
                        'renja_dokumen', 'renja_form_e70', 'renja_pelaksanaan_renstra', 'renja_form_e75'
                    ]);
                },
                'ikus',
                'pohonKinerja',
                'rencanaAksis'
            ])->get()
        ]);
    }

    public function storeLhe(Request $request)
    {
        $request->validate([
            'opd_id' => 'required|exists:opds,id',
            'tahun' => 'required|integer',
            'file' => 'required|mimes:pdf|max:5120',
        ]);

        $existingUpload = DocumentUpload::where('opd_id', $request->opd_id)
            ->where('jenis_dokumen', 'lhe')
            ->where('tahun', $request->tahun)
            ->first();

        if ($existingUpload) {
            return redirect()->back()->withErrors(['file' => 'Upload LHE hanya bisa dilakukan sekali setahun untuk OPD ini.']);
        }

        $opd = Opd::findOrFail($request->opd_id);
        $file = $request->file('file');
        
        $safeOpdName = preg_replace('/[^a-zA-Z0-9_\- ]/', '', $opd->nama);
        $safeOpdName = str_replace(' ', '_', $safeOpdName);
        $fileName = 'LHE_' . $safeOpdName . '_' . $request->tahun . '.' . $file->getClientOriginalExtension();
        
        $filePath = $file->storeAs('uploads/lhe', $fileName, 'public');

        DocumentUpload::create([
            'opd_id' => $opd->id,
            'jenis_dokumen' => 'lhe',
            'tahun' => $request->tahun,
            'file_path' => '/storage/' . $filePath,
            'nama_file' => $fileName,
        ]);

        return redirect()->back()->with('success', 'LHE berhasil diupload.');
    }

    public function destroyLhe($id)
    {
        $document = DocumentUpload::where('jenis_dokumen', 'lhe')->findOrFail($id);
        
        $relativePath = str_replace('/storage/', '', $document->file_path);
        if (\Illuminate\Support\Facades\Storage::disk('public')->exists($relativePath)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($relativePath);
        }
        
        $document->delete();

        return redirect()->back()->with('success', 'LHE berhasil dihapus.');
    }

    public function chat(Request $request)
    {
        $request->validate(['message' => 'required|string']);
        $response = $this->aiService->generateChatResponse($request->message);
        
        return response()->json(['reply' => $response]);
    }
}
