import { useState } from 'react';
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

export default function DetailOpd({ opd }) {
    const [selectedYear, setSelectedYear] = useState('2024');
    const years = ['2024', '2025', '2026', '2027', '2028'];

    // Mock data for the specific OPD's target vs realisasi
    const chartData = {
        labels: ['Triwulan 1', 'Triwulan 2', 'Triwulan 3', 'Triwulan 4'],
        datasets: [
            {
                label: 'Target (%)',
                data: [25, 50, 75, 100],
                backgroundColor: 'rgba(148, 163, 184, 0.5)', // Slate 400
                borderColor: 'rgb(148, 163, 184)',
                borderWidth: 1,
            },
            {
                label: 'Realisasi (%)',
                data: selectedYear === '2024' ? [26.5, 48.2, 70.1, 92.5] : [0, 0, 0, 0],
                backgroundColor: 'rgba(59, 130, 246, 0.8)', // Blue 500
                borderColor: 'rgb(37, 99, 235)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true,
                text: `Grafik Target vs Realisasi Tahun ${selectedYear}`,
                font: { size: 16 }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 120,
                ticks: { callback: function(value) { return value + '%'; } }
            }
        }
    };

    // Mock dokumen OPD
    const dokumenOpd = [
        { id: 1, jenis: 'Rencana Strategis (RENSTRA)', tahun: '2021-2026', status: 'Tersedia' },
        { id: 2, jenis: 'Indikator Kinerja Utama (IKU)', tahun: '2024', status: 'Tersedia' },
        { id: 3, jenis: 'Rencana Kerja Tahunan (RKT)', tahun: '2024', status: 'Tersedia' },
        { id: 4, jenis: 'Perjanjian Kinerja (PK)', tahun: '2024', status: 'Tersedia' },
        { id: 5, jenis: 'Laporan Kinerja (LKjIP)', tahun: '2023', status: 'Tersedia' },
    ];

    return (
        <PublicLayout>
            <Head title={`Profil ${opd.nama} - E-SAKIP`} />

            {/* Breadcrumb & Header */}
            <div className="bg-slate-800 text-white pt-8 pb-16 border-b-4 border-blue-500">
                <div className="container mx-auto px-4">
                    <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6">
                        <Link href="/" className="hover:text-white transition">Beranda</Link>
                        <span>/</span>
                        <Link href={route('publik.capaian')} className="hover:text-white transition">Direktori OPD</Link>
                        <span>/</span>
                        <span className="text-white font-medium">{opd.singkatan || 'Detail'}</span>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                        <div>
                            <div className="inline-block px-3 py-1 bg-blue-900 text-blue-200 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                                Profil Perangkat Daerah
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">{opd.nama}</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Kolom Kiri: Info & Dokumen */}
                    <div className="md:col-span-1 space-y-6">
                        {/* Info Card */}
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Informasi Umum</h3>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <span className="block text-gray-500 text-xs uppercase">Nama Lengkap</span>
                                    <span className="font-medium text-slate-700">{opd.nama}</span>
                                </li>
                                {opd.singkatan && (
                                    <li>
                                        <span className="block text-gray-500 text-xs uppercase">Singkatan</span>
                                        <span className="font-medium text-slate-700">{opd.singkatan}</span>
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Dokumen Card */}
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center justify-between">
                                Dokumen SAKIP
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </h3>
                            <div className="space-y-3">
                                {dokumenOpd.map(doc => (
                                    <div key={doc.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded border border-transparent hover:border-gray-200 transition group cursor-pointer">
                                        <div>
                                            <div className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition">{doc.jenis}</div>
                                            <div className="text-xs text-gray-500">Tahun: {doc.tahun} • {doc.status}</div>
                                        </div>
                                        <button className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded opacity-0 group-hover:opacity-100 transition">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan: Visualisasi Grafik */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-full flex flex-col">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Capaian Kinerja</h3>
                                    <p className="text-sm text-gray-500">Perbandingan Target dan Realisasi Indikator</p>
                                </div>
                                <select 
                                    value={selectedYear} 
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="mt-3 sm:mt-0 px-4 py-2 bg-slate-50 border border-gray-200 rounded text-slate-700 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    {years.map(y => <option key={y} value={y}>Tahun {y}</option>)}
                                </select>
                            </div>
                            
                            <div className="flex-grow w-full flex items-center justify-center min-h-[400px]">
                                <Bar data={chartData} options={chartOptions} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </PublicLayout>
    );
}
