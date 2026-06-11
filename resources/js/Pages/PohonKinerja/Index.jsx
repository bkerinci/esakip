import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { 
    ReactFlow, 
    Controls, 
    Background, 
    Handle, 
    Position, 
    Panel, 
    applyNodeChanges, 
    applyEdgeChanges,
    MiniMap,
    addEdge,
    useReactFlow,
    ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import dagre from 'dagre';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import axios from 'axios';

const getLayoutedElements = (nodes, edges, direction = 'TB', useStoredPosition = true) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    
    const nodeWidth = 280;
    const nodeHeight = 120;
    
    dagreGraph.setGraph({ rankdir: direction });
    
    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });
    
    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });
    
    dagre.layout(dagreGraph);
    
    return nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const targetPosition = direction === 'LR' ? Position.Left : Position.Top;
        const sourcePosition = direction === 'LR' ? Position.Right : Position.Bottom;
        
        let position = node.position;
        // if forcing layout or no stored position, use dagre's position
        if (!useStoredPosition || !node.data.has_position) {
            position = {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            };
        }

        return {
            ...node,
            targetPosition,
            sourcePosition,
            position
        };
    });
};

const CustomNode = ({ data, selected }) => {
    let bgColor = 'bg-gray-400';
    // Visi = Biru Tua, Misi = Biru, Tujuan = Hijau, Sasaran = Kuning, Program = Orange, Kegiatan = Merah, IKU = Ungu
    if (data.jenis_node === 'visi') bgColor = 'bg-blue-800';
    else if (data.jenis_node === 'misi') bgColor = 'bg-blue-600';
    else if (data.jenis_node === 'tujuan') bgColor = 'bg-green-600';
    else if (data.jenis_node === 'sasaran' || data.jenis_node === 'sasaran_pemda' || data.jenis_node === 'sasaran_opd') bgColor = 'bg-yellow-500';
    else if (data.jenis_node === 'program') bgColor = 'bg-orange-500';
    else if (data.jenis_node === 'kegiatan' || data.jenis_node === 'sub_kegiatan') bgColor = 'bg-red-500';
    else if (data.jenis_node === 'iku_individu') bgColor = 'bg-purple-600';
    
    if (data.is_crosscutting) bgColor = 'bg-purple-500';

    const capaianColor = (data.capaian >= 80) ? 'bg-green-400' : (data.capaian >= 50 ? 'bg-yellow-400' : 'bg-red-400');

    return (
        <div className={`shadow-lg rounded-xl border-2 p-4 transition-all ${bgColor} text-white w-[280px] min-h-[120px] flex flex-col justify-start relative group ${selected ? 'border-yellow-300 ring-4 ring-yellow-300/50 scale-105' : 'border-transparent hover:shadow-xl'}`}>
            <Handle type="target" position={data.targetPosition || Position.Top} className="!bg-white w-3 h-3" />
            
            {data.jenis_node !== 'default' && (
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button data-action="edit" className="bg-white/20 hover:bg-white/40 p-1 rounded text-xs leading-none" title="Edit">✏️</button>
                    <button data-action="delete" className="bg-red-500/80 hover:bg-red-600 p-1 rounded text-xs leading-none" title="Hapus">🗑️</button>
                </div>
            )}

            <div className="flex justify-between items-center w-full mb-1">
                <strong className="text-xs uppercase tracking-wide opacity-90 font-bold bg-black/20 px-2 py-0.5 rounded">
                    {data.jenis_node?.replace('_', ' ')}
                </strong>
                {data.jenis_node !== 'default' && (
                    <div className="flex items-center space-x-1" title={`Capaian: ${data.capaian}%`}>
                        <span className={`w-3 h-3 rounded-full ${capaianColor} border border-white/50 shadow-sm`}></span>
                        <span className="text-xs font-semibold">{data.capaian}%</span>
                    </div>
                )}
            </div>
            
            {data.isEditing ? (
                <textarea 
                    className="w-full text-sm text-black rounded p-1 mt-1 border-none focus:ring-2 focus:ring-blue-300 resize-none"
                    defaultValue={data.deskripsi}
                    autoFocus
                    onBlur={(e) => data.onInlineEdit(data.original_id, e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); e.target.blur(); } }}
                />
            ) : (
                <p 
                    className="text-sm mt-1 font-medium cursor-pointer hover:bg-white/10 p-1 rounded -ml-1 transition-colors flex-grow"
                    onDoubleClick={() => data.setInlineEditing(data.original_id)}
                    title="Double click to edit"
                >
                    {data.deskripsi || 'Tidak ada deskripsi'}
                </p>
            )}

            {data.indikator && (
                <div className="mt-2 text-[11px] opacity-90 border-t border-white/30 pt-1 w-full bg-black/10 rounded p-1.5">
                    <div className="flex justify-between">
                        <span className="truncate mr-2" title={data.indikator}>🎯 {data.indikator}</span>
                        <span className="font-bold shrink-0">{data.target}</span>
                    </div>
                </div>
            )}

            {data.jenis_node !== 'default' && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button data-action="add" className="bg-white text-blue-600 hover:bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center shadow-md font-bold text-lg leading-none pb-1" title="Tambah Cabang">+</button>
                </div>
            )}

            <Handle type="source" position={data.sourcePosition || Position.Bottom} className="!bg-white w-3 h-3" />
        </div>
    );
};

function FlowApp({ initialNodes, initialEdges }) {
    const { auth } = usePage().props;
    const userRole = auth.user.role;

    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [history, setHistory] = useState({ past: [], future: [] });
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editNodeId, setEditNodeId] = useState(null);
    const [selectedNodes, setSelectedNodes] = useState([]);
    const [layoutMode, setLayoutMode] = useState('TB'); // TB, LR
    
    const [aiModalOpen, setAiModalOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    
    const flowRef = useRef(null);
    const containerRef = useRef(null);

    const { data, setData, post, put, processing, reset } = useForm({
        parent_id: '',
        jenis_node: 'tujuan',
        deskripsi: '',
        indikator: '',
        target: '',
        is_crosscutting: false
    });

    const setInlineEditing = useCallback((id) => {
        setNodes((nds) => nds.map(n => {
            if (n.data.original_id === id) {
                return { ...n, data: { ...n.data, isEditing: true } };
            }
            return n;
        }));
    }, []);

    const onInlineEdit = useCallback((id, newDesc) => {
        setNodes((nds) => nds.map(n => {
            if (n.data.original_id === id) {
                // Update on server silently
                axios.put(route('pohon-kinerja.update', id), {
                    deskripsi: newDesc,
                    jenis_node: n.data.jenis_node,
                    indikator: n.data.indikator,
                    target: n.data.target,
                    is_crosscutting: n.data.is_crosscutting
                });
                return { ...n, data: { ...n.data, isEditing: false, deskripsi: newDesc, label: n.data.jenis_node + ': ' + newDesc } };
            }
            return n;
        }));
    }, []);

    const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

    // Initialize
    useEffect(() => {
        const layoutedNodes = getLayoutedElements(initialNodes, initialEdges, 'TB', true);
        const nodesWithRole = layoutedNodes.map(node => ({
            ...node,
            data: { ...node.data, userRole, setInlineEditing, onInlineEdit }
        }));
        setNodes(nodesWithRole);
        setEdges(initialEdges);
    }, [initialNodes, initialEdges, userRole, setInlineEditing, onInlineEdit]);

    const saveHistory = useCallback(() => {
        setHistory(h => ({
            past: [...h.past, { nodes, edges }],
            future: []
        }));
    }, [nodes, edges]);

    const handleUndo = useCallback(() => {
        setHistory(h => {
            if (h.past.length === 0) return h;
            const previous = h.past[h.past.length - 1];
            const newPast = h.past.slice(0, h.past.length - 1);
            setNodes(previous.nodes);
            setEdges(previous.edges);
            return { past: newPast, future: [{ nodes, edges }, ...h.future] };
        });
    }, [nodes, edges]);

    const handleRedo = useCallback(() => {
        setHistory(h => {
            if (h.future.length === 0) return h;
            const next = h.future[0];
            const newFuture = h.future.slice(1);
            setNodes(next.nodes);
            setEdges(next.edges);
            return { past: [...h.past, { nodes, edges }], future: newFuture };
        });
    }, [nodes, edges]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === 'z') { e.preventDefault(); handleUndo(); }
            if (e.ctrlKey && e.key === 'y') { e.preventDefault(); handleRedo(); }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleUndo, handleRedo]);

    const onNodesChange = useCallback((changes) => {
        setNodes((nds) => applyNodeChanges(changes, nds));
    }, []);

    const onEdgesChange = useCallback((changes) => {
        setEdges((eds) => applyEdgeChanges(changes, eds));
    }, []);

    const onNodeDragStop = useCallback((event, node) => {
        if (node.data.jenis_node === 'default') return;
        // Save history before change? The drag already happened.
        axios.put(route('pohon-kinerja.update-position', node.data.original_id), {
            x: node.position.x,
            y: node.position.y
        }).catch(err => console.error("Auto-save position failed", err));
    }, []);

    const onConnect = useCallback((connection) => {
        // Enforce hierarchy rules? Or just connect in backend
        axios.put(route('pohon-kinerja.update-connection', connection.target), {
            parent_id: connection.source
        }).then(res => {
            if(res.data.success) {
                setEdges((eds) => addEdge({ ...connection, type: 'smoothstep' }, eds));
                router.reload({ only: ['initialNodes', 'initialEdges'] });
            }
        }).catch(err => {
            alert("Gagal menghubungkan node. " + (err.response?.data?.message || ''));
        });
    }, []);

    const getNextJenisNode = (currentJenis) => {
         if (currentJenis === 'visi') return 'misi';
         if (currentJenis === 'misi') return 'tujuan';
         if (currentJenis === 'tujuan') return 'sasaran';
         if (currentJenis === 'sasaran') return 'program';
         if (currentJenis === 'program') return 'kegiatan';
         if (currentJenis === 'kegiatan') return 'sub_kegiatan';
         return 'sub_kegiatan';
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
             if (confirm('Hapus node ini beserta seluruh cabangnya?')) {
                 router.delete(route('pohon-kinerja.destroy', node.data.original_id));
             }
        }
    };

    const submitForm = (e) => {
        e.preventDefault();
        const onSuccessHandler = () => { setIsModalOpen(false); reset(); };
        if (editMode) {
            put(route('pohon-kinerja.update', editNodeId), { onSuccess: onSuccessHandler });
        } else {
            post(route('pohon-kinerja.store'), { onSuccess: onSuccessHandler });
        }
    };

    const handleDuplicate = () => {
        if(selectedNodes.length > 0) {
            router.post(route('pohon-kinerja.duplicate', selectedNodes[0].data.original_id), {}, {
                onSuccess: () => setSelectedNodes([])
            });
        }
    };

    const applyLayout = (direction) => {
        setLayoutMode(direction);
        saveHistory();
        const layoutedNodes = getLayoutedElements(nodes, edges, direction, false);
        setNodes([...layoutedNodes]);
        // Also we might want to save all these new positions to DB
        layoutedNodes.forEach(n => {
            if (n.data.original_id) {
                axios.put(route('pohon-kinerja.update-position', n.data.original_id), { x: n.position.x, y: n.position.y });
            }
        });
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                alert(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const handleAIGenerate = (e) => {
        e.preventDefault();
        router.post(route('pohon-kinerja.ai-generate'), { prompt: aiPrompt }, {
            onSuccess: () => { setAiModalOpen(false); setAiPrompt(''); }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Pohon Kinerja Interaktif
                        </h2>
                        <span className="text-sm text-gray-500">Klik ganda untuk edit teks. Tarik & Lepas (Drag) node untuk mengatur.</span>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => setAiModalOpen(true)} className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-700 transition shadow flex items-center">
                            ✨ AI Generate
                        </button>
                        <button onClick={() => applyLayout('TB')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition shadow flex items-center ${layoutMode === 'TB' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 border'}`}>
                            ⬇️ Vertical
                        </button>
                        <button onClick={() => applyLayout('LR')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition shadow flex items-center ${layoutMode === 'LR' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 border'}`}>
                            ➡️ Horizontal
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Pohon Kinerja" />

            <div className="py-6 h-[calc(100vh-140px)]" ref={containerRef}>
                <div className="mx-auto max-w-full px-4 h-full">
                    <div className="overflow-hidden bg-gray-50 shadow-sm rounded-lg h-full border border-gray-200 relative">
                        
                        {/* Toolbar */}
                        <div className="absolute top-4 left-4 z-10 flex space-x-2 bg-white p-2 rounded-lg shadow-md border border-gray-200">
                            <button onClick={handleUndo} disabled={history.past.length === 0} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50" title="Undo (Ctrl+Z)">↩️</button>
                            <button onClick={handleRedo} disabled={history.future.length === 0} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50" title="Redo (Ctrl+Y)">↪️</button>
                            <div className="w-px h-6 bg-gray-300 self-center"></div>
                            <button onClick={toggleFullscreen} className="p-1.5 rounded hover:bg-gray-100" title="Fullscreen">🔲</button>
                        </div>

                        <ReactFlow 
                            ref={flowRef}
                            nodes={nodes} 
                            edges={edges}
                            nodeTypes={nodeTypes}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onNodeDragStop={onNodeDragStop}
                            onConnect={onConnect}
                            onNodeClick={handleNodeClick}
                            onSelectionChange={({ nodes }) => setSelectedNodes(nodes)}
                            fitView
                            attributionPosition="bottom-right"
                        >
                            <Background color="#ccc" gap={16} />
                            <Controls />
                            <MiniMap nodeStrokeColor="#ccc" nodeColor="#e2e8f0" zoomable pannable className="!bottom-12 !right-4" />
                            
                            {selectedNodes.length > 0 && (
                                <Panel position="top-center" className="bg-white p-2 shadow-xl rounded-lg border border-gray-300 flex items-center space-x-3 z-50 mt-4">
                                    <span className="text-sm text-gray-700 font-medium px-2 border-r border-gray-200">
                                        {selectedNodes[0].data.jenis_node?.replace('_', ' ').toUpperCase()} Terpilih
                                    </span>
                                    {selectedNodes[0].data.jenis_node !== 'default' ? (
                                        <>
                                            <button onClick={handleDuplicate} className="bg-purple-50 text-purple-600 hover:bg-purple-100 px-3 py-1.5 rounded text-sm font-medium transition flex items-center">
                                                📑 Duplicate Branch
                                            </button>
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
                                                ✏️ Edit Detail
                                            </button>
                                        </>
                                    ) : null}
                                </Panel>
                            )}
                        </ReactFlow>
                    </div>
                </div>
            </div>

            {/* AI Generate Modal */}
            <Modal show={aiModalOpen} onClose={() => setAiModalOpen(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">✨ Generate Pohon Kinerja dengan AI</h2>
                    <p className="text-sm text-gray-500 mb-4">Masukkan prompt untuk membuat kerangka awal pohon kinerja otomatis.</p>
                    <form onSubmit={handleAIGenerate}>
                        <textarea
                            className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm h-32"
                            placeholder="Contoh: Buatkan pohon kinerja Dinas Kominfo untuk peningkatan pelayanan publik digital."
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            required
                        ></textarea>
                        <div className="mt-4 flex justify-end">
                            <SecondaryButton onClick={() => setAiModalOpen(false)}>Batal</SecondaryButton>
                            <PrimaryButton className="ml-3 bg-indigo-600 hover:bg-indigo-700" disabled={!aiPrompt}>
                                Generate Sekarang
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Node Modal */}
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
                                <option value="tujuan">Tujuan</option>
                                <option value="sasaran">Sasaran Strategis</option>
                                <option value="program">Program</option>
                                <option value="kegiatan">Kegiatan</option>
                                <option value="sub_kegiatan">Sub Kegiatan</option>
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

export default function PohonKinerja(props) {
    return (
        <ReactFlowProvider>
            <FlowApp {...props} />
        </ReactFlowProvider>
    );
}
