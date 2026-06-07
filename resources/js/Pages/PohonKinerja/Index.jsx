import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { ReactFlow, Controls, Background, Handle, Position, Panel, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMemo, useState, useEffect, useRef } from 'react';
import dagre from 'dagre';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

// Utility to apply dagre layout
const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  const nodeWidth = 250;
  const nodeHeight = 100;
  
  dagreGraph.setGraph({ rankdir: direction });
  
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });
  
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });
  
  dagre.layout(dagreGraph);
  
  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = Position.Top;
    node.sourcePosition = Position.Bottom;
    
    // We are shifting the dagre node position to be top-left aligned
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
  });
  
  return { nodes, edges };
};

const CustomNode = ({ data, selected }) => {
    let bgColor = 'bg-gray-400';
    if (data.jenis_node === 'visi' || data.jenis_node === 'misi') bgColor = 'bg-blue-600';
    if (data.jenis_node === 'sasaran_pemda') bgColor = 'bg-blue-500';
    if (data.jenis_node === 'sasaran_opd') bgColor = 'bg-green-500';
    if (data.jenis_node === 'program' || data.jenis_node === 'kegiatan' || data.jenis_node === 'iku_individu') bgColor = 'bg-blue-500';
    if (data.is_crosscutting) bgColor = 'bg-purple-500';

    return (
        <div className={`shadow-lg rounded-xl border-2 p-4 transition-all ${bgColor} text-white w-[250px] min-h-[100px] flex flex-col justify-center items-center text-center relative group ${selected ? 'border-yellow-300 ring-4 ring-yellow-300/50 scale-105' : 'border-transparent hover:shadow-xl'}`}>
            <Handle type="target" position={Position.Top} className="!bg-white" />
            
            {data.jenis_node !== 'default' && (
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button data-action="edit" className="bg-white/20 hover:bg-white/40 p-1 rounded text-xs leading-none" title="Edit">✏️</button>
                    <button data-action="delete" className="bg-red-500/80 hover:bg-red-600 p-1 rounded text-xs leading-none" title="Hapus">🗑️</button>
                </div>
            )}

            <strong className="text-sm uppercase tracking-wide opacity-80 mt-2">{data.jenis_node?.replace('_', ' ')}</strong>
            <p className="text-sm mt-1">{data.deskripsi || 'Tidak ada deskripsi'}</p>
            {data.indikator && (
                <div className="mt-2 text-xs opacity-90 border-t border-white/30 pt-1 w-full">
                    Ind: {data.indikator} <br/> Trg: {data.target}
                </div>
            )}

            {data.jenis_node !== 'default' && (
                <div className="absolute -bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button data-action="add" className="bg-white text-blue-600 hover:bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center shadow-md font-bold text-lg leading-none pb-1" title="Tambah Cabang">+</button>
                </div>
            )}

            <Handle type="source" position={Position.Bottom} className="!bg-white" />
        </div>
    );
};

export default function PohonKinerja({ initialNodes, initialEdges }) {
    const { auth } = usePage().props;
    const userRole = auth.user.role;

    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editNodeId, setEditNodeId] = useState(null);
    const [selectedNodes, setSelectedNodes] = useState([]);
    const flowRef = useRef(null);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        parent_id: '',
        jenis_node: 'misi',
        deskripsi: '',
        indikator: '',
        target: '',
        is_crosscutting: false
    });

    const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);
    
    const onNodesChange = (changes) => setNodes((nds) => applyNodeChanges(changes, nds));
    const onEdgesChange = (changes) => setEdges((eds) => applyEdgeChanges(changes, eds));

    useEffect(() => {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            initialNodes,
            initialEdges
        );
        const nodesWithRole = layoutedNodes.map(node => ({
            ...node,
            data: { ...node.data, userRole }
        }));
        setNodes(nodesWithRole);
        setEdges(layoutedEdges);
    }, [initialNodes, initialEdges, userRole]);

    const getNextJenisNode = (currentJenis) => {
         if (currentJenis === 'visi') return 'misi';
         if (currentJenis === 'misi') return 'sasaran_pemda';
         if (currentJenis === 'sasaran_pemda') return 'sasaran_opd';
         if (currentJenis === 'sasaran_opd') return 'program';
         if (currentJenis === 'program') return 'kegiatan';
         return 'iku_individu';
    };

    const handleNodeClick = (event, node) => {
        const button = event.target.closest('button[data-action]');
        
        if (!button) {
            if (node.id === 'default-visi') {
                 setEditMode(false);
                 setData({ parent_id: null, jenis_node: 'visi', deskripsi: '', indikator: '', target: '', is_crosscutting: false });
                 setIsModalOpen(true);
            }
            return;
        }
        
        const action = button.getAttribute('data-action');
        
        if (action === 'add') {
             setEditMode(false);
             setData({
                 parent_id: node.data.original_id,
                 jenis_node: getNextJenisNode(node.data.jenis_node),
                 deskripsi: '', 
                 indikator: '', 
                 target: '', 
                 is_crosscutting: false
             });
             setIsModalOpen(true);
        } else if (action === 'edit') {
             setEditMode(true);
             setEditNodeId(node.data.original_id);
             setData({
                 parent_id: node.data.parent_id || '',
                 jenis_node: node.data.jenis_node,
                 deskripsi: node.data.deskripsi,
                 indikator: node.data.indikator || '',
                 target: node.data.target || '',
                 is_crosscutting: node.data.is_crosscutting || false
             });
             setIsModalOpen(true);
        } else if (action === 'delete') {
             if (confirm('Apakah Anda yakin ingin menghapus node ini beserta seluruh anak cabangnya?')) {
                 router.delete(route('pohon-kinerja.destroy', node.data.original_id));
             }
        }
    };

    const submitForm = (e) => {
        e.preventDefault();
        
        const onSuccessHandler = () => {
            setIsModalOpen(false);
            reset();
        };

        if (editMode) {
            put(route('pohon-kinerja.update', editNodeId), {
                onSuccess: onSuccessHandler
            });
        } else {
            post(route('pohon-kinerja.store'), {
                onSuccess: onSuccessHandler
            });
        }
    };

    const handlePrintPdf = async () => {
        if (!flowRef.current) return;
        
        try {
            // Tunggu sebentar untuk memastikan render selesai (opsional)
            await new Promise(resolve => setTimeout(resolve, 100));

            // Perbesar resolusi canvas dengan scale
            const dataUrl = await toPng(flowRef.current, {
                backgroundColor: '#f9fafb', // gray-50
                cacheBust: true,
                pixelRatio: 2,
            });
            
            const flowWidth = flowRef.current.offsetWidth;
            const flowHeight = flowRef.current.offsetHeight;
            const headerHeight = 110;
            const pdfWidth = flowWidth;
            const pdfHeight = flowHeight + headerHeight;

            const pdf = new jsPDF({
                orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
                unit: 'px',
                format: [pdfWidth, pdfHeight]
            });
            
            // Header Background Putih
            pdf.setFillColor(255, 255, 255);
            pdf.rect(0, 0, pdfWidth, headerHeight, 'F');

            // Load Logo
            const logoImg = new Image();
            logoImg.src = '/images/logo_sungai_penuh.png';
            await new Promise((resolve) => { 
                logoImg.onload = resolve; 
                logoImg.onerror = resolve; // fallback if image error
            });

            // Draw Logo
            pdf.addImage(logoImg, 'PNG', 40, 20, 60, 65);

            // Draw Text
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(22);
            pdf.setFont('helvetica', 'bold');
            pdf.text("POHON KINERJA", 120, 45);

            pdf.setFontSize(14);
            const userOpd = auth.user.opd?.nama;
            
            if (userOpd) {
                pdf.text(userOpd.toUpperCase(), 120, 65);
                pdf.setFontSize(12);
                pdf.setFont('helvetica', 'normal');
                pdf.text("Pemerintah Kota Sungai Penuh", 120, 80);
            } else {
                // Jika super admin (tanpa OPD spesifik)
                pdf.text("PEMERINTAH KOTA SUNGAI PENUH", 120, 65);
            }

            // Draw a Line
            pdf.setLineWidth(2);
            pdf.setDrawColor(0, 0, 0);
            pdf.line(40, 95, pdfWidth - 40, 95);
            pdf.setLineWidth(0.5);
            pdf.line(40, 98, pdfWidth - 40, 98);

            // Draw the React Flow Image
            pdf.addImage(dataUrl, 'PNG', 0, headerHeight, flowWidth, flowHeight);
            pdf.save('pohon-kinerja.pdf');
        } catch (error) {
            console.error('Error generating PDF', error);
            alert('Gagal menghasilkan PDF. Pastikan browser mendukung fitur ini.');
        }
    };

    const handleSaveProject = () => {
        // Buat header CSV yang kompatibel dengan Microsoft Visio Data Visualizer (Organization Chart)
        const headers = ['Node ID', 'Name', 'Title', 'Manager ID', 'Indikator', 'Target', 'Crosscutting'];
        
        const rows = nodes.map(node => {
            // Cari parent dari edges
            const edge = edges.find(e => e.target === node.id);
            const parentId = edge ? edge.source : '';
            
            // Fungsi untuk membersihkan teks agar aman di CSV
            const cleanStr = (str) => {
                if (!str) return '""';
                const stringified = String(str).replace(/"/g, '""').replace(/\n/g, ' ');
                return `"${stringified}"`;
            };

            return [
                cleanStr(node.id),
                cleanStr(node.data.deskripsi), // Muncul sebagai Nama Kotak di Visio
                cleanStr(node.data.jenis_node), // Muncul sebagai Jabatan/Level di Visio
                cleanStr(parentId),
                cleanStr(node.data.indikator),
                cleanStr(node.data.target),
                cleanStr(node.data.is_crosscutting ? 'Yes' : 'No')
            ].join(',');
        });

        const csvContent = "\uFEFF" + [headers.join(','), ...rows].join('\n'); // Tambahkan BOM utf-8 agar Excel/Visio baca dengan benar
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", url);
        downloadAnchorNode.setAttribute("download", "pohon-kinerja-visio.csv");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        URL.revokeObjectURL(url);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Pohon Kinerja Interaktif
                        </h2>
                        <span className="text-sm text-gray-500">Klik node untuk menambah cabang di bawahnya</span>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={handleSaveProject} className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition shadow flex items-center">
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                            Export Visio (CSV)
                        </button>
                        <button onClick={handlePrintPdf} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition shadow flex items-center">
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                            Print PDF
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Pohon Kinerja" />

            <div className="py-8 h-[calc(100vh-140px)]">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 h-full">
                    <div className="overflow-hidden bg-gray-50 shadow-sm sm:rounded-lg h-full border border-gray-200 relative" ref={flowRef}>
                        <ReactFlow 
                            nodes={nodes} 
                            edges={edges}
                            nodeTypes={nodeTypes}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onNodeClick={handleNodeClick}
                            onSelectionChange={({ nodes }) => setSelectedNodes(nodes)}
                            onNodesDelete={(deleted) => {
                                if (deleted.length > 0) {
                                    const node = deleted[0];
                                    const canDelete = node.data.jenis_node !== 'default';
                                    if (canDelete && confirm('Apakah Anda yakin ingin menghapus node ini beserta semua cabang di bawahnya?')) {
                                        router.delete(route('pohon-kinerja.destroy', node.id));
                                    }
                                }
                            }}
                            fitView
                        >
                            <Background color="#ccc" gap={16} />
                            <Controls />
                            {selectedNodes.length > 0 && (
                                <Panel position="top-center" className="bg-white p-2 shadow-xl rounded-lg border border-gray-300 flex items-center space-x-3 z-50 mt-4">
                                    <span className="text-sm text-gray-700 font-medium px-2 border-r border-gray-200">
                                        {selectedNodes[0].data.jenis_node?.replace('_', ' ').toUpperCase()} Terpilih
                                    </span>
                                    {selectedNodes[0].data.jenis_node !== 'default' ? (
                                        <>
                                            <button 
                                                onClick={() => {
                                                    const node = selectedNodes[0];
                                                    setEditMode(true);
                                                    setEditNodeId(node.id);
                                                    setData({
                                                        parent_id: node.data.original_parent_id || '',
                                                        jenis_node: node.data.jenis_node,
                                                        deskripsi: node.data.deskripsi || '',
                                                        indikator: node.data.indikator || '',
                                                        target: node.data.target || '',
                                                        is_crosscutting: node.data.is_crosscutting || false
                                                    });
                                                    setIsModalOpen(true);
                                                }}
                                                className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded text-sm font-medium transition flex items-center"
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    if (confirm('Apakah Anda yakin ingin menghapus node ini beserta semua cabang di bawahnya?')) {
                                                        router.delete(route('pohon-kinerja.destroy', selectedNodes[0].id), {
                                                            onSuccess: () => setSelectedNodes([])
                                                        });
                                                    }
                                                }}
                                                className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded text-sm font-medium transition flex items-center"
                                            >
                                                🗑️ Hapus
                                            </button>
                                        </>
                                    ) : (
                                        <span className="text-xs text-gray-500 italic px-2">Hanya lihat (Read-only)</span>
                                    )}
                                </Panel>
                            )}
                        </ReactFlow>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">{editMode ? 'Edit Cabang Kinerja' : 'Tambah Cabang Kinerja'}</h2>
                    <form onSubmit={submitForm} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="jenis_node" value="Level Node" />
                            <select 
                                id="jenis_node"
                                className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                value={data.jenis_node}
                                onChange={e => setData('jenis_node', e.target.value)}
                            >
                                {userRole === 'super_admin' && <option value="visi">Visi Daerah</option>}
                                {userRole === 'super_admin' && <option value="misi">Misi Daerah</option>}
                                {userRole === 'super_admin' && <option value="sasaran_pemda">Sasaran Strategis Pemda</option>}
                                <option value="sasaran_opd">Sasaran Strategis OPD</option>
                                <option value="program">Program</option>
                                <option value="kegiatan">Kegiatan / Sub Kegiatan</option>
                                <option value="iku_individu">Kinerja Individu (ASN)</option>
                            </select>
                        </div>
                        
                        <div>
                            <InputLabel htmlFor="deskripsi" value="Deskripsi / Uraian" />
                            <TextInput
                                id="deskripsi"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.deskripsi}
                                onChange={e => setData('deskripsi', e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="indikator" value="Indikator (Opsional)" />
                                <TextInput
                                    id="indikator"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.indikator}
                                    onChange={e => setData('indikator', e.target.value)}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="target" value="Target (Opsional)" />
                                <TextInput
                                    id="target"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.target}
                                    onChange={e => setData('target', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center mt-4">
                            <input
                                id="is_crosscutting"
                                type="checkbox"
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                checked={data.is_crosscutting}
                                onChange={e => setData('is_crosscutting', e.target.checked)}
                            />
                            <label htmlFor="is_crosscutting" className="ml-2 text-sm text-gray-600">
                                Tandai sebagai Crosscutting (Lintas Sektor)
                            </label>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={() => setIsModalOpen(false)}>Batal</SecondaryButton>
                            <PrimaryButton className="ml-3" disabled={processing}>
                                {editMode ? 'Simpan Perubahan' : 'Simpan Node'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
