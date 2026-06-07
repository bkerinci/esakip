import { useState, useMemo } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SakipPublik({ dataOpd, ikus, e81s }) {
    const [activeTab, setActiveTab] = useState('visualisasi');
    const [selectedYear, setSelectedYear] = useState('2024');
    
    const years = ['2024', '2025', '2026', '2027', '2028'];
    const [selectedTriwulan, setSelectedTriwulan] = useState('Semua');
    const triwulans = ['Semua', 'Triwulan 1', 'Triwulan 2', 'Triwulan 3', 'Triwulan 4'];

    // Generate real data based on Formulir E81
    const tableData = useMemo(() => {
        return dataOpd.map(opd => {
            const opdE81s = (e81s || []).filter(e => e.opd_id === opd.id && e.tahun == selectedYear);
            
            let sumTri1 = 0, countTri1 = 0;
            let sumTri2 = 0, countTri2 = 0;
            let sumTri3 = 0, countTri3 = 0;
            let sumTri4 = 0, countTri4 = 0;
            
            opdE81s.forEach(e => {
                const target = parseFloat(e.target_kinerja_tahun_berjalan_kinerja) || 0;
                if (target > 0) {
                    sumTri1 += ((parseFloat(e.realisasi_tw1_kinerja) || 0) / target) * 100;
                    sumTri2 += ((parseFloat(e.realisasi_tw2_kinerja) || 0) / target) * 100;
                    sumTri3 += ((parseFloat(e.realisasi_tw3_kinerja) || 0) / target) * 100;
                    sumTri4 += ((parseFloat(e.realisasi_tw4_kinerja) || 0) / target) * 100;
                    countTri1++; countTri2++; countTri3++; countTri4++;
                } else {
                    if (parseFloat(e.realisasi_tw1_kinerja) > 0) { sumTri1 += 100; countTri1++; }
                    if (parseFloat(e.realisasi_tw2_kinerja) > 0) { sumTri2 += 100; countTri2++; }
                    if (parseFloat(e.realisasi_tw3_kinerja) > 0) { sumTri3 += 100; countTri3++; }
                    if (parseFloat(e.realisasi_tw4_kinerja) > 0) { sumTri4 += 100; countTri4++; }
                }
            });

            const tri1 = countTri1 > 0 ? sumTri1 / countTri1 : 0;
            const tri2 = countTri2 > 0 ? sumTri2 / countTri2 : 0;
            const tri3 = countTri3 > 0 ? sumTri3 / countTri3 : 0;
            const tri4 = countTri4 > 0 ? sumTri4 / countTri4 : 0;
            
            // Rata-rata dari triwulan yang sudah diisi
            let validTriCount = 0;
            let totalTri = 0;
            if (tri1 > 0) { totalTri += tri1; validTriCount++; }
            if (tri2 > 0) { totalTri += tri2; validTriCount++; }
            if (tri3 > 0) { totalTri += tri3; validTriCount++; }
            if (tri4 > 0) { totalTri += tri4; validTriCount++; }
            
            const capaian = validTriCount > 0 ? totalTri / validTriCount : 0;
            
            return {
                ...opd,
                capaian: parseFloat(capaian.toFixed(2)),
                tri1: parseFloat(tri1.toFixed(2)),
                tri2: parseFloat(tri2.toFixed(2)),
                tri3: parseFloat(tri3.toFixed(2)),
                tri4: parseFloat(tri4.toFixed(2)),
            };
        });
    }, [dataOpd, selectedYear, selectedTriwulan, e81s]);

    const getStatusColor = (value) => {
        if (!value || value === 0) return 'bg-gray-100 text-gray-800';
        if (value < 60) return 'bg-red-100 text-red-800 border-red-200';
        if (value < 80) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        if (value < 100) return 'bg-green-100 text-green-800 border-green-200';
        return 'bg-blue-100 text-blue-800 border-blue-200';
    };

    const getStatusText = (value) => {
        if (!value || value === 0) return 'Belum Diisi';
        if (value < 60) return 'Sangat Kurang';
        if (value < 80) return 'Cukup';
        if (value < 100) return 'Baik';
        return 'Sangat Baik';
    };

    const chartData = {
        labels: tableData.map(d => d.singkatan || d.nama),
        datasets: [
            {
                label: 'Capaian Kinerja (%)',
                data: tableData.map(d => d.capaian),
                backgroundColor: tableData.map(d => {
                    if (d.capaian === 0) return 'rgba(209, 213, 219, 0.7)'; // Gray for 0/empty
                    if (d.capaian < 60) return 'rgba(239, 68, 68, 0.7)'; // Red
                    if (d.capaian < 80) return 'rgba(234, 179, 8, 0.7)'; // Yellow
                    if (d.capaian < 100) return 'rgba(34, 197, 94, 0.7)'; // Green
                    return 'rgba(59, 130, 246, 0.7)'; // Blue
                }),
                borderColor: tableData.map(d => {
                    if (d.capaian === 0) return 'rgb(156, 163, 175)';
                    if (d.capaian < 60) return 'rgb(239, 68, 68)';
                    if (d.capaian < 80) return 'rgb(234, 179, 8)';
                    if (d.capaian < 100) return 'rgb(34, 197, 94)';
                    return 'rgb(59, 130, 246)';
                }),
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                display: false
            },
            title: {
                display: true,
                text: `Rata-rata Capaian Kinerja Perangkat Daerah Tahun ${selectedYear}`,
                font: { size: 16 }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                }
            }
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <PublicLayout>
            <Head title="Pengukuran dan Capaian Kinerja" />
            
            {/* Header Title */}
            <div className="bg-gray-100 py-6 px-4 border-b">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Pengukuran dan Capaian Kinerja</h1>
                    
                    <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-2 border-r pr-3">
                            <label htmlFor="triwulan-filter" className="font-semibold text-gray-500 text-sm">Triwulan:</label>
                            <select 
                                id="triwulan-filter"
                                value={selectedTriwulan} 
                                onChange={(e) => setSelectedTriwulan(e.target.value)}
                                className="border-none bg-transparent focus:ring-0 font-bold text-slate-700 text-sm cursor-pointer p-0"
                            >
                                {triwulans.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <label htmlFor="year-filter" className="font-semibold text-gray-500 text-sm">Tahun:</label>
                            <select 
                                id="year-filter"
                                value={selectedYear} 
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="border-none bg-transparent focus:ring-0 font-bold text-blue-600 text-lg cursor-pointer p-0"
                            >
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Alert & Export Button */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 shadow-sm rounded-r flex-grow md:mr-4">
                        <div className="flex items-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span><strong>Informasi:</strong> Capaian Kinerja Publik adalah hasil agregasi realisasi IKU dan Perjanjian Kinerja SKPD.</span>
                        </div>
                    </div>
                    <button 
                        onClick={handlePrint}
                        className="mt-4 md:mt-0 flex items-center bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded shadow transition whitespace-nowrap"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                        Export PDF
                    </button>
                </div>

                {/* Legend Capaian */}
                <div className="flex flex-wrap gap-3 mb-6 text-sm font-medium">
                    <div className="flex items-center"><span className="w-4 h-4 rounded bg-red-500 mr-2"></span> &lt; 60% (Sangat Kurang)</div>
                    <div className="flex items-center"><span className="w-4 h-4 rounded bg-yellow-500 mr-2"></span> 60% - 79% (Cukup)</div>
                    <div className="flex items-center"><span className="w-4 h-4 rounded bg-green-500 mr-2"></span> 80% - 99% (Baik)</div>
                    <div className="flex items-center"><span className="w-4 h-4 rounded bg-blue-500 mr-2"></span> 100% (Sangat Baik)</div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex space-x-2 border-b-2 border-gray-200 mb-6 overflow-x-auto">
                    <button 
                        onClick={() => setActiveTab('visualisasi')}
                        className={`py-3 px-6 font-bold whitespace-nowrap focus:outline-none transition-colors border-b-4 ${
                            activeTab === 'visualisasi' 
                            ? 'border-blue-500 text-blue-600 bg-blue-50' 
                            : 'border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                        }`}
                    >
                        📊 Visualisasi Kinerja
                    </button>
                    <button 
                        onClick={() => setActiveTab('tabulasi')}
                        className={`py-3 px-6 font-bold whitespace-nowrap focus:outline-none transition-colors border-b-4 ${
                            activeTab === 'tabulasi' 
                            ? 'border-blue-500 text-blue-600 bg-blue-50' 
                            : 'border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                        }`}
                    >
                        📋 Tabulasi Capaian
                    </button>
                    <button 
                        onClick={() => setActiveTab('iku')}
                        className={`py-3 px-6 font-bold whitespace-nowrap focus:outline-none transition-colors border-b-4 ${
                            activeTab === 'iku' 
                            ? 'border-blue-500 text-blue-600 bg-blue-50' 
                            : 'border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                        }`}
                    >
                        🎯 Capaian IKU
                    </button>
                </div>

                {/* Tab 0: Visualisasi (Chart) */}
                {activeTab === 'visualisasi' && (
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100 animate-fade-in-up">
                        <div className="w-full h-[500px] flex justify-center">
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    </div>
                )}

                {/* Tab 1: Tabulasi / Capaian PK */}
                {activeTab === 'tabulasi' && (
                    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-100 animate-fade-in-up">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-slate-800 text-white">
                                <tr>
                                    <th className="p-4 border-b border-slate-700 text-center w-12 rounded-tl-lg">No</th>
                                    <th className="p-4 border-b border-slate-700">Perangkat Daerah</th>
                                    <th className="p-4 border-b border-slate-700 text-center">Tri 1</th>
                                    <th className="p-4 border-b border-slate-700 text-center">Tri 2</th>
                                    <th className="p-4 border-b border-slate-700 text-center">Tri 3</th>
                                    <th className="p-4 border-b border-slate-700 text-center">Tri 4</th>
                                    <th className="p-4 border-b border-slate-700 text-center bg-slate-900 rounded-tr-lg">Rata-rata Capaian</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((opd, index) => (
                                    <tr key={opd.id} className="hover:bg-slate-50 border-b border-gray-200 transition">
                                        <td className="p-4 text-center font-medium text-gray-500">{index + 1}</td>
                                        <td className="p-4 font-bold text-slate-700">
                                            <Link href={route('publik.opd', opd.id)} className="hover:text-blue-600 transition underline decoration-transparent hover:decoration-blue-600">
                                                {opd.nama}
                                            </Link>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded border text-xs font-bold ${getStatusColor(opd.tri1)}`}>
                                                {opd.tri1 > 0 ? `${opd.tri1.toFixed(1)}%` : '-'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded border text-xs font-bold ${getStatusColor(opd.tri2)}`}>
                                                {opd.tri2 > 0 ? `${opd.tri2.toFixed(1)}%` : '-'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded border text-xs font-bold ${getStatusColor(opd.tri3)}`}>
                                                {opd.tri3 > 0 ? `${opd.tri3.toFixed(1)}%` : '-'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded border text-xs font-bold ${getStatusColor(opd.tri4)}`}>
                                                {opd.tri4 > 0 ? `${opd.tri4.toFixed(1)}%` : '-'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center bg-slate-50 border-l border-gray-200">
                                            <div className="flex flex-col items-center">
                                                <span className={`px-4 py-1.5 rounded-full border shadow-sm text-sm font-bold ${getStatusColor(opd.capaian)}`}>
                                                    {opd.capaian}%
                                                </span>
                                                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mt-1">
                                                    {getStatusText(opd.capaian)}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Tab 2: Capaian IKU */}
                {activeTab === 'iku' && (
                    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-100 animate-fade-in-up">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-slate-800 text-white">
                                <tr>
                                    <th className="p-4 border-b text-center w-12 rounded-tl-lg">No</th>
                                    <th className="p-4 border-b">Perangkat Daerah</th>
                                    <th className="p-4 border-b">Sasaran Strategis</th>
                                    <th className="p-4 border-b">Indikator Kinerja</th>
                                    <th className="p-4 border-b text-center">Target</th>
                                    <th className="p-4 border-b text-center">Realisasi</th>
                                    <th className="p-4 border-b text-center rounded-tr-lg">Capaian (%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ikus && ikus.length > 0 ? ikus.map((iku, index) => {
                                    const target = parseFloat(iku.target) || 0;
                                    const realisasi = parseFloat(iku.realisasi) || 0;
                                    let capaian = 0;
                                    if (target > 0) capaian = (realisasi / target) * 100;
                                    else if (realisasi > 0) capaian = 100;
                                    
                                    // Ambil dari data OPD perangkat daerah yang mempunyai sasaran strategis tersebut
                                    let opdNama = null;
                                    if (iku.sasaran_strategis) {
                                        const matchingE81 = e81s?.find(e => e.sasaran === iku.sasaran_strategis);
                                        if (matchingE81) {
                                            const matchingOpd = dataOpd.find(o => o.id === matchingE81.opd_id);
                                            if (matchingOpd) opdNama = matchingOpd.nama;
                                        }
                                    }
                                    
                                    // Fallback ke data aslinya jika tidak ditemukan di e81
                                    if (!opdNama) opdNama = iku.opd?.nama || '-';
                                    
                                    return (
                                        <tr key={iku.id || index} className="hover:bg-slate-50 border-b border-gray-200 transition">
                                            <td className="p-4 text-center font-medium text-gray-500">{index + 1}</td>
                                            <td className="p-4 font-bold text-slate-700">
                                                {opdNama}
                                            </td>
                                            <td className="p-4 text-slate-600">{iku.sasaran_strategis}</td>
                                            <td className="p-4 text-slate-600">{iku.indikator_kinerja}</td>
                                            <td className="p-4 text-center font-semibold">{iku.target} {iku.satuan}</td>
                                            <td className="p-4 text-center font-semibold">{iku.realisasi} {iku.satuan}</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-3 py-1 rounded border text-xs font-bold ${getStatusColor(capaian)}`}>
                                                    {capaian.toFixed(1)}%
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-gray-500">Belum ada data IKU yang diinputkan.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Info Jadwal Pengisian */}
                <div className="mt-8 text-sm text-gray-500 bg-white p-4 border rounded shadow-sm">
                    <strong>Jadwal Entry/pengisian Laporan Kinerja:</strong>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Triwulan 1: 28 Maret s/d 5 April</li>
                        <li>Triwulan 2: 28 Juni s/d 5 Juli</li>
                        <li>Triwulan 3: 28 September s/d 5 Oktober</li>
                        <li>Triwulan 4: 28 Desember s/d 5 Januari</li>
                    </ul>
                </div>
            </div>
        </PublicLayout>
    );
}
