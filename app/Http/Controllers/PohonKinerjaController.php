<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\PohonKinerja;
use Inertia\Inertia;

class PohonKinerjaController extends Controller
{
    public function index()
    {
        if (in_array(auth()->user()->role, ['super_admin', 'evaluator'])) {
            $semuaNode = PohonKinerja::all();
        } else {
            $semuaNode = PohonKinerja::where('opd_id', auth()->user()->opd_id)
                         ->orWhereNull('opd_id')
                         ->get();
        }
        
        $nodes = [];
        $edges = [];
        
        // Very basic manual positioning if dagre isn't used. 
        // We will actually rely on the frontend to layout using dagre.
        foreach ($semuaNode as $node) {
            $nodes[] = [
                'id' => (string) $node->id,
                'position' => ['x' => 0, 'y' => 0], // position is required by ReactFlow but we'll override it dynamically in React
                'data' => [
                    'label' => $node->jenis_node . ': ' . $node->deskripsi,
                    'jenis_node' => $node->jenis_node,
                    'deskripsi' => $node->deskripsi,
                    'indikator' => $node->indikator,
                    'target' => $node->target,
                    'is_crosscutting' => $node->is_crosscutting,
                    'original_id' => $node->id
                ],
                'type' => 'custom', // custom node type
            ];
            
            if ($node->parent_id) {
                $edges[] = [
                    'id' => 'e' . $node->parent_id . '-' . $node->id,
                    'source' => (string) $node->parent_id,
                    'target' => (string) $node->id,
                    'type' => 'smoothstep',
                    'animated' => $node->is_crosscutting
                ];
            }
        }

        // If it's an empty database, create a default root "Visi" node so the user has something to start with
        if (count($nodes) === 0) {
            $nodes[] = [
                'id' => 'default-visi',
                'position' => ['x' => 0, 'y' => 0],
                'data' => ['label' => 'Klik Kanan untuk Buat Visi', 'jenis_node' => 'default'],
            ];
        }

        return Inertia::render('PohonKinerja/Index', [
            'initialNodes' => $nodes,
            'initialEdges' => $edges
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'deskripsi' => 'required|string',
            'jenis_node' => 'required|in:visi,misi,sasaran_pemda,sasaran_opd,program,kegiatan,iku_individu',
            'parent_id' => 'nullable|exists:pohon_kinerjas,id',
            'indikator' => 'nullable|string',
            'target' => 'nullable|string',
        ]);

        // OPD diizinkan membuat visi/misi berdasarkan konfigurasi terbaru

        PohonKinerja::create([
            'parent_id' => $request->parent_id,
            'opd_id' => auth()->user()->opd_id,
            'jenis_node' => $request->jenis_node,
            'deskripsi' => $request->deskripsi,
            'indikator' => $request->indikator,
            'target' => $request->target,
            'is_crosscutting' => $request->is_crosscutting ?? false,
        ]);

        return redirect()->back()->with('success', 'Node berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'deskripsi' => 'required|string',
            'jenis_node' => 'required|in:visi,misi,sasaran_pemda,sasaran_opd,program,kegiatan,iku_individu',
            'indikator' => 'nullable|string',
            'target' => 'nullable|string',
        ]);

        $node = PohonKinerja::findOrFail($id);

        if (auth()->user()->role !== 'super_admin') {
            if ($node->opd_id !== auth()->user()->opd_id && !is_null($node->opd_id)) {
                abort(403, 'Anda tidak memiliki akses untuk memodifikasi node ini.');
            }
            // OPD diizinkan mengedit visi/misi berdasarkan konfigurasi terbaru
        }

        $node->update([
            'jenis_node' => $request->jenis_node,
            'deskripsi' => $request->deskripsi,
            'indikator' => $request->indikator,
            'target' => $request->target,
            'is_crosscutting' => $request->is_crosscutting ?? false,
        ]);

        return redirect()->back()->with('success', 'Node berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $node = PohonKinerja::findOrFail($id);

        if (auth()->user()->role !== 'super_admin') {
            if ($node->opd_id !== auth()->user()->opd_id && !is_null($node->opd_id)) {
                abort(403, 'Anda tidak memiliki akses untuk menghapus node ini.');
            }
            // OPD diizinkan menghapus visi/misi berdasarkan konfigurasi terbaru
        }

        $node->delete(); // automatically cascades down because of onDelete('cascade') in DB

        return redirect()->back()->with('success', 'Node beserta cabangnya berhasil dihapus.');
    }
}
