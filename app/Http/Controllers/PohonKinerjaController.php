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
                'position' => ['x' => $node->x ?? 0, 'y' => $node->y ?? 0],
                'data' => [
                    'label' => $node->jenis_node . ': ' . $node->deskripsi,
                    'jenis_node' => $node->jenis_node,
                    'deskripsi' => $node->deskripsi,
                    'indikator' => $node->indikator,
                    'target' => $node->target,
                    'is_crosscutting' => $node->is_crosscutting,
                    'capaian' => $node->capaian,
                    'original_id' => $node->id,
                    'has_position' => $node->x !== null && $node->y !== null
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
            'jenis_node' => 'required|in:visi,misi,tujuan,sasaran,program,kegiatan,sub_kegiatan',
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
            'jenis_node' => 'required|in:visi,misi,tujuan,sasaran,program,kegiatan,sub_kegiatan',
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

    public function updatePosition(Request $request, $id)
    {
        $request->validate([
            'x' => 'required|numeric',
            'y' => 'required|numeric',
        ]);

        $node = PohonKinerja::findOrFail($id);
        $node->update([
            'x' => $request->x,
            'y' => $request->y,
        ]);

        return response()->json(['success' => true]);
    }

    public function updateConnection(Request $request, $id)
    {
        $request->validate([
            'parent_id' => 'nullable|exists:pohon_kinerjas,id',
        ]);

        $node = PohonKinerja::findOrFail($id);
        
        // Basic cycle prevention could be added here
        if ($request->parent_id == $node->id) {
            return response()->json(['success' => false, 'message' => 'Cannot connect to itself'], 400);
        }

        $node->update([
            'parent_id' => $request->parent_id,
        ]);

        return response()->json(['success' => true]);
    }

    public function duplicateBranch($id)
    {
        $node = PohonKinerja::findOrFail($id);
        
        $this->duplicateNodeRecursive($node, $node->parent_id);

        return redirect()->back()->with('success', 'Cabang berhasil diduplikasi.');
    }

    private function duplicateNodeRecursive($node, $parentId)
    {
        $newNode = $node->replicate();
        $newNode->parent_id = $parentId;
        // Shift a bit to right and bottom so it doesn't completely overlap
        if ($newNode->x !== null) $newNode->x += 50;
        if ($newNode->y !== null) $newNode->y += 50;
        $newNode->save();

        $children = PohonKinerja::where('parent_id', $node->id)->get();
        foreach ($children as $child) {
            $this->duplicateNodeRecursive($child, $newNode->id);
        }
    }

    public function generateAI(Request $request)
    {
        $request->validate([
            'prompt' => 'required|string',
        ]);

        // Mock AI Generation - creating a simple tree
        // In a real scenario, this would call OpenAI or Gemini API and parse the JSON
        $opd_id = auth()->user()->opd_id;

        $visi = PohonKinerja::create([
            'jenis_node' => 'visi',
            'deskripsi' => 'Visi: ' . $request->prompt,
            'opd_id' => $opd_id,
        ]);

        $misi = PohonKinerja::create([
            'jenis_node' => 'misi',
            'deskripsi' => 'Misi untuk mendukung Visi',
            'parent_id' => $visi->id,
            'opd_id' => $opd_id,
        ]);

        $tujuan = PohonKinerja::create([
            'jenis_node' => 'tujuan',
            'deskripsi' => 'Tujuan Strategis AI',
            'parent_id' => $misi->id,
            'opd_id' => $opd_id,
        ]);

        return redirect()->back()->with('success', 'Struktur pohon berhasil di-generate dengan AI (Mock).');
    }
}
