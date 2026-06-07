<?php

namespace App\Services;

use App\Models\RealisasiKinerja;
use App\Models\Iku;
use App\Models\Opd;
use App\Models\DocumentUpload;
use Illuminate\Support\Str;

class SipandaiAiService
{
    /**
     * Algoritma Forecasting menggunakan regresi linear sederhana
     * Memprediksi triwulan 4 berdasarkan data triwulan 1, 2, dan 3.
     */
    public function getForecastingData()
    {
        // Ambil rata-rata per triwulan
        $t1 = (float) RealisasiKinerja::where('triwulan', 1)->avg('realisasi');
        $t2 = (float) RealisasiKinerja::where('triwulan', 2)->avg('realisasi');
        $t3 = (float) RealisasiKinerja::where('triwulan', 3)->avg('realisasi');
        
        // Default values jika data belum cukup (fallback)
        if ($t1 == 0 && $t2 == 0 && $t3 == 0) {
            return [0, 0, 0, 0];
        }

        // Siapkan array X dan Y untuk regresi
        // Y = mx + c
        $x = [];
        $y = [];

        if ($t1 > 0) { $x[] = 1; $y[] = $t1; }
        if ($t2 > 0) { $x[] = 2; $y[] = $t2; }
        if ($t3 > 0) { $x[] = 3; $y[] = $t3; }

        $n = count($x);
        
        // Jika hanya 1 triwulan yang ada, tidak bisa regresi, prediksi stagnan
        if ($n < 2) {
            $t4 = count($y) > 0 ? $y[0] : 0;
            return [
                round($t1, 1),
                round($t2, 1),
                round($t3, 1),
                round($t4, 1)
            ];
        }

        // Kalkulasi Regresi Linear
        $sumX = array_sum($x);
        $sumY = array_sum($y);
        $sumXY = 0;
        $sumXX = 0;

        for ($i = 0; $i < $n; $i++) {
            $sumXY += ($x[$i] * $y[$i]);
            $sumXX += ($x[$i] * $x[$i]);
        }

        // m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
        $denominator = ($n * $sumXX) - ($sumX * $sumX);
        $m = $denominator != 0 ? (($n * $sumXY) - ($sumX * $sumY)) / $denominator : 0;
        
        // c = (sumY - m * sumX) / n
        $c = ($sumY - ($m * $sumX)) / $n;

        // Prediksi T4
        $t4 = ($m * 4) + $c;

        // Cap maksimal di 100% dan minimal 0%
        $t4 = max(0, min(100, $t4));

        return [
            round($t1, 1),
            round($t2, 1),
            round($t3, 1),
            round($t4, 1)
        ];
    }

    /**
     * Anomaly Detection: Analisis anomali seluruh OPD
     */
    public function getOpdRiskAnalysis()
    {
        $opds = Opd::all();
        $riskyOpds = [];

        foreach ($opds as $opd) {
            $riskScore = 0;
            $alasan = [];

            // 1. Cek kelengkapan dokumen (Renstra & LKjIP)
            $hasRenstra = DocumentUpload::where('opd_id', $opd->id)->whereIn('jenis_dokumen', ['Renstra'])->exists();
            $hasLkjip = DocumentUpload::where('opd_id', $opd->id)->where('jenis_dokumen', 'LKjIP')->exists();

            if (!$hasRenstra) {
                $riskScore += 40;
                $alasan[] = "Belum unggah RENSTRA.";
            }
            if (!$hasLkjip) {
                $riskScore += 40;
                $alasan[] = "Belum unggah LKjIP.";
            }

            // 2. Cek anomali IKU
            $ikus = Iku::where('opd_id', $opd->id)->get();
            if ($ikus->isEmpty()) {
                $riskScore += 30;
                $alasan[] = "Belum mendefinisikan satupun Indikator Kinerja Utama (IKU).";
            } else {
                $ikuAnomalies = 0;
                foreach ($ikus as $iku) {
                    if (empty($iku->target)) {
                        $ikuAnomalies++;
                    }
                }
                if ($ikuAnomalies > 0) {
                    $riskScore += 20;
                    $alasan[] = "Terdapat {$ikuAnomalies} IKU yang tidak memiliki target capaian terukur.";
                }
            }

            // Klasifikasi Risiko
            if ($riskScore >= 60) {
                $risiko = 'Tinggi';
            } elseif ($riskScore >= 30) {
                $risiko = 'Sedang';
            } else {
                $risiko = 'Rendah';
            }

            if ($risiko !== 'Rendah') {
                $riskyOpds[] = [
                    'nama' => $opd->nama,
                    'risiko' => $risiko,
                    'alasan' => implode(" ", $alasan)
                ];
            }
        }

        // Sort descending by risk (Tinggi first)
        usort($riskyOpds, function($a, $b) {
            $weights = ['Tinggi' => 2, 'Sedang' => 1, 'Rendah' => 0];
            return $weights[$b['risiko']] <=> $weights[$a['risiko']];
        });

        return $riskyOpds;
    }

    /**
     * AI Chat Assistant Internal (Rule & Keyword Engine)
     */
    public function generateChatResponse(string $message)
    {
        $message = Str::lower($message);
        
        // Cek jika menanyakan rekomendasi / risiko dinas tertentu
        if (Str::contains($message, ['dinas', 'badan', 'opd', 'rekomendasi'])) {
            $opds = Opd::all();
            $matchedOpd = null;

            foreach ($opds as $opd) {
                if (Str::contains($message, Str::lower($opd->nama)) || Str::contains($message, Str::lower($opd->singkatan))) {
                    $matchedOpd = $opd;
                    break;
                }
            }

            if ($matchedOpd) {
                // Analisis khusus OPD tersebut
                $riskyOpds = collect($this->getOpdRiskAnalysis());
                $opdData = $riskyOpds->firstWhere('nama', $matchedOpd->nama);

                if ($opdData) {
                    if ($opdData['risiko'] === 'Tinggi') {
                        return "Berdasarkan pemindaian AI, **{$matchedOpd->nama}** berisiko **TINGGI**. Masalah yang terdeteksi: {$opdData['alasan']} Rekomendasi: Segera panggil tim perencanaan OPD terkait untuk sinkronisasi dokumen SAKIP hulu.";
                    } else {
                        return "Kinerja **{$matchedOpd->nama}** berstatus risiko **Sedang**. Terdeteksi: {$opdData['alasan']} Rekomendasi: Harap jadwalkan peninjauan minor pada portal evaluasi.";
                    }
                } else {
                    return "Kinerja **{$matchedOpd->nama}** saat ini tercatat baik dan tidak ada anomali dokumen atau indikator yang terdeteksi oleh sistem.";
                }
            }
        }

        // Menanyakan anomali secara general
        if (Str::contains($message, ['anomali', 'bermasalah', 'buruk'])) {
            $risks = $this->getOpdRiskAnalysis();
            $tinggi = count(array_filter($risks, fn($r) => $r['risiko'] === 'Tinggi'));
            return "Saat ini terdapat **{$tinggi} OPD** dengan risiko kinerja tinggi (anomali data). Anda bisa melihat daftarnya pada panel 'AI Priority Engine' di sebelah kiri.";
        }

        // Menanyakan prediksi / forecasting
        if (Str::contains($message, ['prediksi', 'forecasting', 'triwulan 4', 'akhir tahun'])) {
            $forecast = $this->getForecastingData();
            $t4 = $forecast[3];
            
            if ($t4 > 80) {
                return "Model regresi AI memprediksi capaian akhir tahun (Triwulan 4) akan menyentuh angka **{$t4}%**. Tren ini sangat positif dan selaras dengan target RPJMD.";
            } else {
                return "Waspada: Model regresi AI kami memprediksi capaian akhir tahun hanya akan mencapai **{$t4}%**. Terjadi kelambatan laju realisasi di triwulan berjalan. Diperlukan intervensi segera.";
            }
        }
        
        // Greeting
        if (Str::contains($message, ['halo', 'hai', 'pagi', 'siang', 'sore', 'malam'])) {
            return "Halo! Saya adalah SIPANDAI AI Assistant. Saya bisa membantu Anda menganalisis anomali data kinerja, tren capaian OPD, dan rekomendasi intervensi. Ada yang ingin ditanyakan terkait kinerja pemda saat ini?";
        }

        // Fallback response
        return "Maaf, saya tidak menemukan metrik yang relevan dengan pertanyaan Anda di dalam data SAKIP. Cobalah tanyakan mengenai 'prediksi capaian', 'anomali', atau sebutkan nama dinas tertentu (contoh: 'Bagaimana evaluasi Dinas Pendidikan?').";
    }
}
