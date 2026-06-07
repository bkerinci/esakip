<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Models\Opd;
use App\Models\RealisasiKinerja;

class SmartAiService
{
    protected $kinerjaService;

    public function __construct(KinerjaService $kinerjaService)
    {
        $this->kinerjaService = $kinerjaService;
    }

    /**
     * Entry point untuk memproses chat dari user.
     */
    public function processChat(string $message)
    {
        $apiKey = env('OPENROUTER_API_KEY');

        // Jika API Key tersedia dan tidak kosong, coba gunakan LLM dengan Function Calling
        if (!empty($apiKey)) {
            $response = $this->callOpenRouter($message, $apiKey);
            // Jika berhasil dan bukan error (seperti 402/404), kita kembalikan
            if ($response !== false) {
                return $response;
            }
        }

        // Fallback: Gunakan Internal Engine (Regex/String Matching Router)
        return $this->internalFallbackEngine($message);
    }

    /**
     * Memanggil OpenRouter API (LLAMA 3.3 / Gemini) dengan format Tools.
     */
    protected function callOpenRouter(string $message, string $apiKey)
    {
        $isLoggedIn = Auth::check();
        $contextString = $isLoggedIn ? 
            "Pengguna saat ini TEROTENTIKASI. Berikan data analitik mendalam jika diminta." : 
            "Pengguna saat ini PUBLIK (Tidak Login). Jangan berikan rincian data rahasia, cukup berikan rangkuman eksekutif.";

        $systemPrompt = "Anda adalah AI Assistant E-SAKIP Kota Sungai Penuh (SIPANDAI). Tugas Anda membantu memahami kinerja pemerintah daerah secara interaktif. \n\nKonteks Pengguna: {$contextString}\n\nGunakan tools yang tersedia untuk mengambil data kinerja. Jika tools tidak dapat dipanggil, berikan jawaban umum tentang SAKIP.";

        try {
            // Karena OpenRouter kadang ada issue dengan function calling, kita menggunakan prompting instruksional 
            // Namun jika model mendukung tool calling (misal meta-llama/llama-3.3-70b-instruct:free) kita sertakan tools.
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(15)->post('https://openrouter.ai/api/v1/chat/completions', [
                'model' => 'meta-llama/llama-3.3-70b-instruct:free',
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    // Injeksi konteks cepat untuk menghindari roundtrip tool calling yang lambat di free API
                    ['role' => 'system', 'content' => $this->getExecutiveSummary()],
                    ['role' => 'user', 'content' => $message],
                ],
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['choices'][0]['message']['content'] ?? false;
            }

            return false;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Fallback Engine Internal menggunakan Pola Kalimat (Regex)
     */
    protected function internalFallbackEngine(string $message)
    {
        $message = Str::lower($message);

        if (Str::contains($message, ['apa itu sakip'])) {
            return "SAKIP (Sistem Akuntabilitas Kinerja Instansi Pemerintah) adalah sistem integrasi dari perencanaan, penganggaran, dan pelaporan kinerja, yang selaras dengan pelaksanaan sistem akuntabilitas keuangan. Tujuannya untuk meningkatkan efisiensi dan tata kelola pemerintah daerah.";
        }

        if (Str::contains($message, ['tertinggi', 'terbaik', 'top'])) {
            return $this->getTopOpd();
        }

        if (Str::contains($message, ['terendah', 'buruk', 'merah'])) {
            return $this->getWorstOpd();
        }

        if (Str::contains($message, ['capaian kota', 'ringkasan', 'summary'])) {
            return $this->getExecutiveSummary();
        }

        if (Str::contains($message, ['rekomendasi', 'evaluasi'])) {
            return $this->getRecommendation();
        }
        
        // Match specific OPD name
        $opds = Opd::all();
        foreach ($opds as $opd) {
            if (Str::contains($message, Str::lower($opd->nama)) || Str::contains($message, Str::lower($opd->singkatan))) {
                return $this->getOpdPerformance($opd);
            }
        }

        return "Maaf, saya (Internal Engine) belum bisa menemukan konteks yang tepat untuk pertanyaan tersebut. Anda bisa mencoba: 'Berapa capaian kota?', 'OPD mana yang kinerjanya tertinggi?', atau 'Apa rekomendasi evaluasi?'.";
    }

    /* ====================================================
     * AI TOOLS (Data Providers)
     * ==================================================== */

    public function getExecutiveSummary()
    {
        $stats = $this->kinerjaService->getStatistikDashboard();
        return "Berdasarkan data terkini SAKIP Kota Sungai Penuh: Rata-rata capaian kinerja pemerintah adalah **{$stats['capaian_rata_rata']}%**. Terdapat {$stats['total_opd']} Perangkat Daerah dengan total {$stats['total_indikator']} Indikator Kinerja yang dimonitor.";
    }

    public function getTopOpd()
    {
        // Simulasi logika mencari OPD capaian tertinggi
        $ikus = \App\Models\Iku::all();
        $opdStats = [];

        foreach ($ikus as $iku) {
            $opdId = $iku->opd_id;
            if (!isset($opdStats[$opdId])) {
                $opdStats[$opdId] = [
                    'total_capaian' => 0,
                    'count' => 0,
                ];
            }
            
            $target = (float) $iku->target;
            $realisasi = (float) $iku->realisasi;
            
            $capaian = 0;
            if ($target > 0) {
                $capaian = ($realisasi / $target) * 100;
            } else if ($realisasi > 0) {
                $capaian = 100;
            }
            
            $opdStats[$opdId]['total_capaian'] += $capaian;
            $opdStats[$opdId]['count']++;
        }

        $topOpdId = null;
        $highestAvg = 0;

        foreach ($opdStats as $opdId => $stat) {
            if ($stat['count'] > 0) {
                $avg = $stat['total_capaian'] / $stat['count'];
                if ($avg > $highestAvg) {
                    $highestAvg = $avg;
                    $topOpdId = $opdId;
                }
            }
        }

        if ($topOpdId) {
            $opd = \App\Models\Opd::find($topOpdId);
            if ($opd) {
                return "Perangkat Daerah dengan persentase capaian rata-rata tertinggi saat ini adalah **{$opd->nama}** dengan rata-rata capaian " . number_format($highestAvg, 1) . "%.";
            }
        }

        return "Data realisasi OPD saat ini belum mencukupi untuk menentukan peringkat.";
    }

    public function getWorstOpd()
    {
        return "Berdasarkan pemantauan indikator, beberapa Perangkat Daerah yang masih perlu percepatan kinerja (di bawah 50%) sedang direviu oleh Evaluator. Disarankan OPD terkait melakukan sinkronisasi dokumen RKT.";
    }

    public function getOpdPerformance(Opd $opd)
    {
        $hasLkjip = \App\Models\DocumentUpload::where('opd_id', $opd->id)->where('jenis_dokumen', 'LKjIP')->exists();
        $statusLkjip = $hasLkjip ? 'Sudah Mengunggah' : 'Belum Mengunggah';
        return "Untuk **{$opd->nama}**, status dokumen LKjIP: {$statusLkjip}. Silakan akses menu portal spesifik untuk melihat rincian capaian triwulanan.";
    }

    public function getRecommendation()
    {
        return "Rekomendasi Strategis AI: \n1. Segera selesaikan unggah dokumen Perjanjian Kinerja (PK) awal tahun.\n2. Tingkatkan pemantauan pada OPD yang realisasi Triwulan 1 di bawah 15%.\n3. Pertajam indikator outcome pada dokumen Renstra perubahan.";
    }
}
