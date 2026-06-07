import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar, Radar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function SipandaiIndex({ auth, analytics, opdsWithLhe }) {
    const [activeTab, setActiveTab] = useState('overview');
    
    // State for LHE Upload
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        opd_id: '',
        tahun: new Date().getFullYear(),
        file: null,
    });
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedOpd, setSelectedOpd] = useState(null);

    const openUploadModal = (opd) => {
        setSelectedOpd(opd);
        setData({
            opd_id: opd.id,
            tahun: new Date().getFullYear(),
            file: null,
        });
        clearErrors();
        setShowUploadModal(true);
    };

    const closeUploadModal = () => {
        setShowUploadModal(false);
        reset();
        clearErrors();
    };

    const submitUpload = (e) => {
        e.preventDefault();
        post(route('sipandai.lhe.store'), {
            onSuccess: () => closeUploadModal(),
            preserveScroll: true,
        });
    };

    const deleteLhe = (id) => {
        if (confirm('Yakin ingin menghapus dokumen LHE ini?')) {
            router.delete(route('sipandai.lhe.destroy', id), {
                preserveScroll: true
            });
        }
    };
    
    // State for AI Chat
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([
        { sender: 'system', text: 'AI Assistant connected. Menggunakan Internal Engine.' },
        { sender: 'ai', text: 'Halo! Saya adalah SIPANDAI AI. Ada yang ingin Anda tanyakan seputar SAKIP?' }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMsg = chatInput;
        setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setChatInput('');
        setIsTyping(true);

        try {
            const response = await window.axios.post(route('sipandai.chat'), { message: userMsg });
            setChatMessages(prev => [...prev, { sender: 'ai', text: response.data.reply }]);
        } catch (error) {
            setChatMessages(prev => [...prev, { sender: 'system', text: 'Error connecting to AI service.' }]);
        } finally {
            setIsTyping(false);
        }
    };

    // REAL DATA FROM CONTROLLER
    const forecastingData = {
        labels: ['Triwulan 1', 'Triwulan 2', 'Triwulan 3', 'Triwulan 4 (Prediksi)'],
        datasets: [
            {
                label: 'Realisasi Rata-rata',
                data: analytics?.forecasting || [0, 0, 0, 0],
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Target SAKIP',
                data: [25, 50, 75, 100],
                borderColor: 'rgba(16, 185, 129, 1)',
                borderDash: [5, 5],
                tension: 0,
            }
        ],
    };

    const radarData = {
        labels: ['Perencanaan', 'Pengukuran', 'Pelaporan', 'Evaluasi Internal', 'Capaian'],
        datasets: [
            {
                label: 'Rata-rata Pemda',
                data: analytics?.radar || [0, 0, 0, 0, 0],
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                borderColor: 'rgba(139, 92, 246, 1)',
                pointBackgroundColor: 'rgba(139, 92, 246, 1)',
                pointBorderColor: '#fff',
            }
        ]
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#e2e8f0' }
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
            x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }
        }
    };
    
    const lineOptions = {
        responsive: true,
        plugins: {
            legend: {
                labels: { color: '#e2e8f0' }
            }
        },
        scales: {
            y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
            x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }
        }
    };

    const radarOptions = {
        scales: {
            r: {
                angleLines: { color: '#334155' },
                grid: { color: '#334155' },
                pointLabels: { color: '#e2e8f0' },
                ticks: { display: false }
            }
        },
        plugins: {
            legend: { labels: { color: '#e2e8f0' } }
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">SIPANDAI AI - Smart Government Analytics</h2>}
        >
            <Head title="SIPANDAI AI" />

            <div className="py-8 bg-slate-900 min-h-screen text-slate-100">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Header Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            Executive Intelligence Dashboard
                        </h1>
                        <p className="text-slate-400 mt-2">Sistem Pendukung Keputusan Berbasis Artificial Intelligence</p>
                    </div>

                    {/* AI Insight Alert */}
                    <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 shadow-lg backdrop-blur-sm flex items-start space-x-4">
                        <div className="p-3 bg-indigo-500/20 rounded-lg">
                            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-indigo-300">AI Executive Summary</h3>
                            <ul className="mt-2 space-y-1 text-sm text-slate-300">
                                {analytics?.insights?.length > 0 ? (
                                    analytics.insights.map((insight, idx) => (
                                        <li key={idx} className="flex items-center">
                                            <span className={`w-2 h-2 rounded-full bg-${insight.color}-400 mr-2`}></span> 
                                            {insight.text}
                                        </li>
                                    ))
                                ) : (
                                    <li className="flex items-center text-slate-500 italic">Menunggu data analitik...</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-md">
                            <h4 className="text-slate-400 text-sm font-medium">Prediksi Capaian Rata-rata</h4>
                            <div className="mt-2 flex items-baseline">
                                <span className="text-3xl font-extrabold text-white">{analytics?.kpi?.rata_rata_capaian || 0}%</span>
                                <span className="ml-2 text-sm text-emerald-400 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                                    Terhitung
                                </span>
                            </div>
                        </div>
                        <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-md">
                            <h4 className="text-slate-400 text-sm font-medium">OPD Berisiko Tinggi</h4>
                            <div className="mt-2 flex items-baseline">
                                <span className="text-3xl font-extrabold text-rose-400">{analytics?.kpi?.opd_berisiko || 0}</span>
                                <span className="ml-2 text-sm text-rose-400 flex items-center">
                                    OPD
                                </span>
                            </div>
                        </div>
                        <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-md">
                            <h4 className="text-slate-400 text-sm font-medium">Anomali Terdeteksi</h4>
                            <div className="mt-2 flex items-baseline">
                                <span className="text-3xl font-extrabold text-amber-400">{analytics?.kpi?.anomali || 0}</span>
                                <span className="ml-2 text-sm text-slate-400">Indikator</span>
                            </div>
                        </div>
                        <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-md">
                            <h4 className="text-slate-400 text-sm font-medium">Akurasi Prediksi AI</h4>
                            <div className="mt-2 flex items-baseline">
                                <span className="text-3xl font-extrabold text-indigo-400">94.2%</span>
                                <span className="ml-2 text-sm text-emerald-400">Sangat Baik</span>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* Line Chart */}
                        <div className="lg:col-span-2 bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-md">
                            <h3 className="text-lg font-semibold text-white mb-4">AI Forecasting Capaian Kinerja</h3>
                            <div className="h-72">
                                <Line data={forecastingData} options={lineOptions} />
                            </div>
                        </div>

                        {/* Radar Chart */}
                        <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-md">
                            <h3 className="text-lg font-semibold text-white mb-4">Analisis Komponen SAKIP</h3>
                            <div className="h-72 flex justify-center">
                                <Radar data={radarData} options={radarOptions} />
                            </div>
                        </div>
                    </div>

                    {/* AI Chat & Recommendation Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-md">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                                AI Priority Engine
                            </h3>
                            <div className="space-y-4">
                                {analytics?.opd_berisiko_list?.length > 0 ? (
                                    analytics.opd_berisiko_list.map((opd, idx) => (
                                        <div key={idx} className="p-4 bg-rose-900/30 border border-rose-500/30 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-semibold text-rose-300">{opd.nama}</h4>
                                                <span className="px-2 py-1 bg-rose-500/20 text-rose-300 text-xs rounded-md">Risiko {opd.risiko}</span>
                                            </div>
                                            <p className="text-sm text-slate-300 mt-2">{opd.alasan}</p>
                                            <button className="mt-3 text-xs text-rose-400 hover:text-rose-300 font-medium">Beri Rekomendasi Khusus &rarr;</button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 bg-emerald-900/30 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm">
                                        Tidak ada OPD berisiko tinggi saat ini. Semua data sejajar dengan target.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-md flex flex-col">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                                SIPANDAI Chat Assistant
                            </h3>
                            <div className="flex-1 bg-slate-900/80 rounded-xl border border-slate-700 p-4 mb-4 font-mono text-sm overflow-y-auto" style={{ maxHeight: '250px' }}>
                                {chatMessages.map((msg, i) => (
                                    <div key={i} className="mb-4">
                                        {msg.sender === 'system' && (
                                            <><span className="text-slate-500">System:</span> <span className="text-slate-400">{msg.text}</span></>
                                        )}
                                        {msg.sender === 'user' && (
                                            <><span className="text-blue-400 font-bold">You:</span> <span className="text-white">{msg.text}</span></>
                                        )}
                                        {msg.sender === 'ai' && (
                                            <><span className="font-bold text-emerald-400">SIPANDAI:</span> <span className="text-emerald-300">{msg.text}</span></>
                                        )}
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="mb-4 text-emerald-400 animate-pulse">
                                        <span className="font-bold">SIPANDAI:</span> <em>Mengetik...</em>
                                    </div>
                                )}
                            </div>
                            <form onSubmit={handleSendMessage} className="flex space-x-2">
                                <input 
                                    type="text" 
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="Tanya AI Assistant (Misal: 'Bagaimana prediksi capaian?')..." 
                                    className="flex-1 bg-slate-700 border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500" 
                                    disabled={isTyping}
                                />
                                <button 
                                    type="submit"
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${isTyping ? 'bg-blue-800 text-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`} 
                                    disabled={isTyping}
                                >
                                    Kirim
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Manajemen Dokumen LHE & Rekapitulasi SAKIP Section */}
                    {(auth.user.role === 'super_admin' || auth.user.role === 'evaluator') && (
                        <div className="mt-8 bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-md">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                Rekapitulasi Data SAKIP Perangkat Daerah
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse whitespace-nowrap">
                                    <thead>
                                        <tr className="bg-slate-700/50 text-slate-300 text-xs uppercase tracking-wider">
                                            <th className="p-3 border-b border-slate-600 rounded-tl-lg">Nama OPD</th>
                                            <th className="p-3 border-b border-slate-600">LHE</th>
                                            <th className="p-3 border-b border-slate-600">IKU</th>
                                            <th className="p-3 border-b border-slate-600">PK</th>
                                            <th className="p-3 border-b border-slate-600">Rencana Aksi</th>
                                            <th className="p-3 border-b border-slate-600">Pohon Kinerja</th>
                                            <th className="p-3 border-b border-slate-600">DPA</th>
                                            <th className="p-3 border-b border-slate-600">Renstra</th>
                                            <th className="p-3 border-b border-slate-600">Renja</th>
                                            <th className="p-3 border-b border-slate-600">LKjIP</th>
                                            <th className="p-3 border-b border-slate-600">CALK</th>
                                            <th className="p-3 border-b border-slate-600 text-right rounded-tr-lg">Aksi LHE</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/50 text-sm">
                                        {opdsWithLhe && opdsWithLhe.map(opd => {
                                            const getDocs = (types) => opd.documents ? opd.documents.filter(d => types.includes(d.jenis_dokumen)) : [];
                                            const lheDocs = getDocs(['lhe']);
                                            const pkCount = getDocs(['perjanjian_kinerja', 'perjanjian_kinerja_perubahan']).length;
                                            const dpaCount = getDocs(['dpa']).length;
                                            const renstraCount = getDocs(['renstra']).length;
                                            const renjaCount = getDocs(['renja_dokumen', 'renja_form_e70', 'renja_pelaksanaan_renstra', 'renja_form_e75']).length;
                                            const lkjipCount = getDocs(['lkjip']).length;
                                            const calkCount = getDocs(['calk']).length;
                                            const ikuCount = opd.ikus ? opd.ikus.length : 0;
                                            const pkjCount = opd.pohonKinerja ? opd.pohonKinerja.length : 0;
                                            const raCount = opd.rencanaAksis ? opd.rencanaAksis.length : 0;

                                            return (
                                            <tr key={opd.id} className="hover:bg-slate-700/30 transition-colors">
                                                <td className="p-3 font-medium text-slate-200">{opd.nama}</td>
                                                <td className="p-3 text-slate-400 min-w-[200px]">
                                                    {lheDocs.length > 0 ? (
                                                        <ul className="space-y-1">
                                                            {lheDocs.map(doc => (
                                                                <li key={doc.id} className="flex items-center justify-between bg-slate-800 p-2 rounded border border-slate-600">
                                                                    <div className="flex items-center truncate">
                                                                        <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded mr-2 font-bold">{doc.tahun}</span>
                                                                        <a href={doc.file_path} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline truncate w-32" title={doc.nama_file}>
                                                                            {doc.nama_file}
                                                                        </a>
                                                                    </div>
                                                                    <button onClick={() => deleteLhe(doc.id)} className="text-rose-400 hover:text-rose-300 ml-2 flex-shrink-0" title="Hapus LHE">
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                                    </button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <span className="italic text-slate-500">Belum ada LHE</span>
                                                    )}
                                                </td>
                                                <td className="p-3 text-center">
                                                    <a href={route('iku.index')} className="text-blue-400 hover:underline" title="Ke Halaman IKU">
                                                        {ikuCount} Data
                                                    </a>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <a href={route('perjanjian-kinerja.index')} className="text-blue-400 hover:underline" title="Ke Halaman PK">
                                                        {pkCount > 0 ? `${pkCount} Dokumen` : '-'}
                                                    </a>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <a href={route('rencana_aksi.index')} className="text-blue-400 hover:underline" title="Ke Halaman Rencana Aksi">
                                                        {raCount > 0 ? `${raCount} Data` : '-'}
                                                    </a>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <a href={route('pohon-kinerja.index')} className="text-blue-400 hover:underline" title="Ke Halaman Pohon Kinerja">
                                                        {pkjCount > 0 ? `${pkjCount} Node` : '-'}
                                                    </a>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <a href={route('dpa.index')} className="text-blue-400 hover:underline" title="Ke Halaman DPA">
                                                        {dpaCount > 0 ? `${dpaCount} Dokumen` : '-'}
                                                    </a>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <a href={route('renstra.index')} className="text-blue-400 hover:underline" title="Ke Halaman Renstra">
                                                        {renstraCount > 0 ? `${renstraCount} Dokumen` : '-'}
                                                    </a>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <a href={route('renja.generic.index', { type: 'dokumen' })} className="text-blue-400 hover:underline" title="Ke Halaman Renja">
                                                        {renjaCount > 0 ? `${renjaCount} Dokumen` : '-'}
                                                    </a>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <a href={route('lkjip.index')} className="text-blue-400 hover:underline" title="Ke Halaman LKjIP">
                                                        {lkjipCount > 0 ? `${lkjipCount} Dokumen` : '-'}
                                                    </a>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <a href={route('calk.index')} className="text-blue-400 hover:underline" title="Ke Halaman CALK">
                                                        {calkCount > 0 ? `${calkCount} Dokumen` : '-'}
                                                    </a>
                                                </td>
                                                <td className="p-3 text-right">
                                                    <button onClick={() => openUploadModal(opd)} className="inline-flex items-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded transition shadow-sm">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                                        Upload LHE
                                                    </button>
                                                </td>
                                            </tr>
                                        )})}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Upload Modal */}
                    {showUploadModal && (
                        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
                            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={closeUploadModal}></div>
                            <div className="bg-slate-800 rounded-xl max-w-lg w-full p-6 relative z-10 shadow-2xl border border-slate-700 transform transition-all">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-white">Upload Dokumen LHE</h3>
                                    <button onClick={closeUploadModal} className="text-slate-400 hover:text-white transition">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>

                                <form onSubmit={submitUpload} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Nama OPD</label>
                                        <input 
                                            type="text" 
                                            value={selectedOpd?.nama || ''} 
                                            readOnly 
                                            className="w-full bg-slate-700 border-slate-600 text-slate-400 rounded-lg px-4 py-2 opacity-70 cursor-not-allowed" 
                                        />
                                        <p className="text-xs text-slate-500 mt-1">Nama OPD otomatis terisi sesuai baris yang dipilih.</p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Tahun Evaluasi</label>
                                        <input 
                                            type="number" 
                                            value={data.tahun} 
                                            onChange={e => setData('tahun', e.target.value)}
                                            className="w-full bg-slate-700 border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500" 
                                            required
                                        />
                                        {errors.tahun && <p className="text-rose-400 text-xs mt-1">{errors.tahun}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">File LHE (PDF, Maks 5MB)</label>
                                        <input 
                                            type="file" 
                                            accept=".pdf"
                                            onChange={e => setData('file', e.target.files[0])}
                                            className="w-full bg-slate-700 border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition" 
                                            required
                                        />
                                        {errors.file && <p className="text-rose-400 text-xs mt-1">{errors.file}</p>}
                                    </div>

                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button 
                                            type="button" 
                                            onClick={closeUploadModal}
                                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition"
                                        >
                                            Batal
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={processing}
                                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition disabled:opacity-50 flex items-center"
                                        >
                                            {processing ? 'Mengunggah...' : 'Upload LHE'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
