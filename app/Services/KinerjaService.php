<?php

namespace App\Services;

use App\Models\Opd;

class KinerjaService
{
    public function getStatistikDashboard()
    {
        $total_indikator = \App\Models\Iku::count();
        $total_dokumen = \App\Models\DocumentUpload::count();
        
        $realisasiList = \App\Models\RealisasiKinerja::with('targetKinerja')->get();
        $totalCapaian = 0;
        $countValid = 0;

        foreach ($realisasiList as $r) {
            $realisasiStr = preg_replace('/[^0-9.]/', '', $r->realisasi);
            $targetStr = preg_replace('/[^0-9.]/', '', $r->targetKinerja->target ?? '0');
            
            $realisasiVal = floatval($realisasiStr);
            $targetVal = floatval($targetStr);
            
            if ($targetVal > 0) {
                $capaian = ($realisasiVal / $targetVal) * 100;
                if ($capaian > 100) $capaian = 100;
                
                $totalCapaian += $capaian;
                $countValid++;
            }
        }

        $capaian_rata_rata = $countValid > 0 ? round($totalCapaian / $countValid, 1) : 0;

        return [
            'total_opd' => Opd::count(),
            'total_indikator' => $total_indikator,
            'capaian_rata_rata' => $capaian_rata_rata,
            'total_dokumen' => $total_dokumen,
        ];
    }
}
