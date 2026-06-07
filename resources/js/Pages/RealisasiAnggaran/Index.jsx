import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function RealisasiIndex({ realisasi, tahun_aktif, opd_nama }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Grouping the data for display: Program -> Kegiatan -> Sub Kegiatan
    const grouped = {};
    realisasi.forEach(item => {
        if (!grouped[item.program]) grouped[item.program] = {};
        if (!grouped[item.program][item.kegiatan]) grouped[item.program][item.kegiatan] = [];
        grouped[item.program][item.kegiatan].push(item);
    });

    const { data, setData, post, processing, reset, errors, transform } = useForm({
        tahun: new Date().getFullYear(),
        triwulan: 1,
        program: '',
        kegiatan: '',
        sub_kegiatan: '',
        
        pegawai_anggaran: 0,
        pegawai_realisasi_keuangan: 0,
        pegawai_realisasi_fisik: 0,

        barang_jasa_anggaran: 0,
        barang_jasa_realisasi_keuangan: 0,
        barang_jasa_realisasi_fisik: 0,

        modal_anggaran: 0,
        modal_realisasi_keuangan: 0,
        modal_realisasi_fisik: 0,

        hibah_anggaran: 0,
        hibah_realisasi_keuangan: 0,
        hibah_realisasi_fisik: 0,
    });

    const submitForm = (e) => {
        e.preventDefault();
        
        transform((data) => {
            const transformed = { ...data };
            const numFields = [
                'pegawai_anggaran', 'pegawai_realisasi_keuangan', 'pegawai_realisasi_fisik',
                'barang_jasa_anggaran', 'barang_jasa_realisasi_keuangan', 'barang_jasa_realisasi_fisik',
                'modal_anggaran', 'modal_realisasi_keuangan', 'modal_realisasi_fisik',
                'hibah_anggaran', 'hibah_realisasi_keuangan', 'hibah_realisasi_fisik'
            ];
            numFields.forEach(f => {
                if (transformed[f] === '' || isNaN(transformed[f])) {
                    transformed[f] = 0;
                }
            });
            return transformed;
        });

        post(route('realisasi.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    const handleTahunChange = (e) => {
        router.get(route('realisasi.index'), { tahun: e.target.value }, { preserveState: true });
    };

    const handlePrint = () => {
        const originalTitle = document.title;
        document.title = `Laporan Realisasi - ${opd_nama} - Tahun ${tahun_aktif}`;
        window.print();
        setTimeout(() => {
            document.title = originalTitle;
        }, 1000);
    };

    const formatRp = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    // Helper to calculate totals for a kegiatan
    const getKegiatanTotal = (subKegiatans) => {
        const total = {
            pegawai_a: 0, pegawai_rk: 0, pegawai_rf_sum: 0,
            bj_a: 0, bj_rk: 0, bj_rf_sum: 0,
            modal_a: 0, modal_rk: 0, modal_rf_sum: 0,
            hibah_a: 0, hibah_rk: 0, hibah_rf_sum: 0,
            triwulans: new Set(),
            count: subKegiatans.length
        };
        subKegiatans.forEach(sub => {
            if (sub.triwulan) total.triwulans.add(sub.triwulan);
            total.pegawai_a += parseFloat(sub.pegawai_anggaran || 0);
            total.pegawai_rk += parseFloat(sub.pegawai_realisasi_keuangan || 0);
            total.pegawai_rf_sum += parseFloat(sub.pegawai_realisasi_fisik || 0);
            
            total.bj_a += parseFloat(sub.barang_jasa_anggaran || 0);
            total.bj_rk += parseFloat(sub.barang_jasa_realisasi_keuangan || 0);
            total.bj_rf_sum += parseFloat(sub.barang_jasa_realisasi_fisik || 0);
            
            total.modal_a += parseFloat(sub.modal_anggaran || 0);
            total.modal_rk += parseFloat(sub.modal_realisasi_keuangan || 0);
            total.modal_rf_sum += parseFloat(sub.modal_realisasi_fisik || 0);
            
            total.hibah_a += parseFloat(sub.hibah_anggaran || 0);
            total.hibah_rk += parseFloat(sub.hibah_realisasi_keuangan || 0);
            total.hibah_rf_sum += parseFloat(sub.hibah_realisasi_fisik || 0);
        });

        // Averages for Physical Realization
        total.pegawai_rf_avg = total.count > 0 ? (total.pegawai_rf_sum / total.count) : 0;
        total.bj_rf_avg = total.count > 0 ? (total.bj_rf_sum / total.count) : 0;
        total.modal_rf_avg = total.count > 0 ? (total.modal_rf_sum / total.count) : 0;
        total.hibah_rf_avg = total.count > 0 ? (total.hibah_rf_sum / total.count) : 0;
        total.tw_string = total.triwulans.size > 0 ? Array.from(total.triwulans).sort().map(tw => `TW ${tw}`).join(', ') : '-';

        return total;
    };

    // Helper to calculate totals for a program based on its kegiatans
    const getProgramTotal = (kegiatans) => {
        const total = {
            pegawai_a: 0, pegawai_rk: 0, pegawai_rf_sum: 0,
            bj_a: 0, bj_rk: 0, bj_rf_sum: 0,
            modal_a: 0, modal_rk: 0, modal_rf_sum: 0,
            hibah_a: 0, hibah_rk: 0, hibah_rf_sum: 0,
            triwulans: new Set(),
            count: 0
        };

        const kegiatanNames = Object.keys(kegiatans);
        kegiatanNames.forEach(kName => {
            const subs = kegiatans[kName];
            const kTot = getKegiatanTotal(subs);
            
            kTot.triwulans.forEach(tw => total.triwulans.add(tw));
            total.pegawai_a += kTot.pegawai_a;
            total.pegawai_rk += kTot.pegawai_rk;
            total.pegawai_rf_sum += kTot.pegawai_rf_avg;

            total.bj_a += kTot.bj_a;
            total.bj_rk += kTot.bj_rk;
            total.bj_rf_sum += kTot.bj_rf_avg;

            total.modal_a += kTot.modal_a;
            total.modal_rk += kTot.modal_rk;
            total.modal_rf_sum += kTot.modal_rf_avg;

            total.hibah_a += kTot.hibah_a;
            total.hibah_rk += kTot.hibah_rk;
            total.hibah_rf_sum += kTot.hibah_rf_avg;

            total.count += 1;
        });

        total.pegawai_rf_avg = total.count > 0 ? (total.pegawai_rf_sum / total.count) : 0;
        total.bj_rf_avg = total.count > 0 ? (total.bj_rf_sum / total.count) : 0;
        total.modal_rf_avg = total.count > 0 ? (total.modal_rf_sum / total.count) : 0;
        total.hibah_rf_avg = total.count > 0 ? (total.hibah_rf_sum / total.count) : 0;
        total.tw_string = total.triwulans.size > 0 ? Array.from(total.triwulans).sort().map(tw => `TW ${tw}`).join(', ') : '-';

        return total;
    };

    const getLastEntryDate = () => {
        if (!realisasi || realisasi.length === 0) return '-';
        const dates = realisasi.map(item => new Date(item.updated_at));
        const maxDate = new Date(Math.max.apply(null, dates));
        return maxDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Realisasi Fisik dan Keuangan
                </h2>
            }
        >
            <Head title="Realisasi Anggaran" />

            <div className="py-12 print:py-0">
                <div className="mx-auto max-w-full sm:px-6 lg:px-8 print:px-0">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6 print:shadow-none print:p-0">
                        
                        {/* KOP SURAT PRINT */}
                        <div className="hidden print:flex items-center justify-between border-b-4 border-double border-black pb-4 mb-6">
                            <div className="w-24">
                                <img src="/images/logo_sungai_penuh.png" alt="Logo Sungai Penuh" className="w-full" />
                            </div>
                            <div className="flex-1 text-center">
                                <h1 className="text-xl font-bold uppercase">LAPORAN REALISASI FISIK DAN KEUANGAN</h1>
                                <h2 className="text-lg font-bold uppercase">BELANJA LANGSUNG KEGIATAN PEMBANGUNAN APBD</h2>
                                <p className="text-sm mt-2">Keadaan : {getLastEntryDate()}</p>
                            </div>
                            <div className="w-24"></div>
                        </div>

                        <div className="flex justify-between items-center mb-6 print:hidden">
                            <div className="flex items-center gap-4">
                                <h3 className="text-lg font-medium text-gray-900">Tabel Laporan Realisasi</h3>
                                <select 
                                    value={tahun_aktif} 
                                    onChange={handleTahunChange}
                                    className="border-gray-300 rounded-md text-sm"
                                >
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                    <option value="2027">2027</option>
                                </select>
                            </div>
                            <div className="flex gap-2 print:hidden">
                                <button onClick={handlePrint} className="bg-slate-600 text-white px-4 py-2 rounded-md shadow hover:bg-slate-700 transition flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                    Cetak PDF
                                </button>
                                <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition">
                                    Tambah Realisasi (Sub Kegiatan)
                                </button>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto print:overflow-visible">
                            <table className="min-w-full divide-y divide-gray-200 border text-sm print:text-[10px]">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th rowSpan="2" className="px-4 py-2 border text-left font-semibold">Program / Kegiatan / Sub Kegiatan</th>
                                        <th colSpan="3" className="px-4 py-2 border text-center font-semibold bg-blue-50">Belanja Pegawai</th>
                                        <th colSpan="3" className="px-4 py-2 border text-center font-semibold bg-green-50">Barang & Jasa</th>
                                        <th colSpan="3" className="px-4 py-2 border text-center font-semibold bg-blue-50">Belanja Modal</th>
                                        <th colSpan="3" className="px-4 py-2 border text-center font-semibold bg-purple-50">Belanja Hibah</th>
                                    </tr>
                                    <tr>
                                        {/* Pegawai */}
                                        <th className="px-2 py-1 border text-center text-xs bg-blue-50">Anggaran</th>
                                        <th className="px-2 py-1 border text-center text-xs bg-blue-50">Real. Uang</th>
                                        <th className="px-2 py-1 border text-center text-xs bg-blue-50">Real. Fisik (%)</th>
                                        {/* BJ */}
                                        <th className="px-2 py-1 border text-center text-xs bg-green-50">Anggaran</th>
                                        <th className="px-2 py-1 border text-center text-xs bg-green-50">Real. Uang</th>
                                        <th className="px-2 py-1 border text-center text-xs bg-green-50">Real. Fisik (%)</th>
                                        {/* Modal */}
                                        <th className="px-2 py-1 border text-center text-xs bg-blue-50">Anggaran</th>
                                        <th className="px-2 py-1 border text-center text-xs bg-blue-50">Real. Uang</th>
                                        <th className="px-2 py-1 border text-center text-xs bg-blue-50">Real. Fisik (%)</th>
                                        {/* Hibah */}
                                        <th className="px-2 py-1 border text-center text-xs bg-purple-50">Anggaran</th>
                                        <th className="px-2 py-1 border text-center text-xs bg-purple-50">Real. Uang</th>
                                        <th className="px-2 py-1 border text-center text-xs bg-purple-50">Real. Fisik (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(grouped).length === 0 ? (
                                        <tr><td colSpan="13" className="text-center py-4 text-gray-500">Belum ada data realisasi tahun ini.</td></tr>
                                    ) : (
                                        Object.keys(grouped).map(programName => {
                                            const pTot = getProgramTotal(grouped[programName]);
                                            return (
                                                <React.Fragment key={programName}>
                                                    <tr className="bg-gray-200 font-bold">
                                                        <td className="px-4 py-2 border">PROGRAM: {programName}</td>
                                                        <td className="px-2 py-2 border text-right">{formatRp(pTot.pegawai_a)}</td>
                                                        <td className="px-2 py-2 border text-right">{formatRp(pTot.pegawai_rk)}</td>
                                                        <td className="px-2 py-2 border text-center">{pTot.pegawai_rf_avg.toFixed(2)}%</td>
                                                        <td className="px-2 py-2 border text-right">{formatRp(pTot.bj_a)}</td>
                                                        <td className="px-2 py-2 border text-right">{formatRp(pTot.bj_rk)}</td>
                                                        <td className="px-2 py-2 border text-center">{pTot.bj_rf_avg.toFixed(2)}%</td>
                                                        <td className="px-2 py-2 border text-right">{formatRp(pTot.modal_a)}</td>
                                                        <td className="px-2 py-2 border text-right">{formatRp(pTot.modal_rk)}</td>
                                                        <td className="px-2 py-2 border text-center">{pTot.modal_rf_avg.toFixed(2)}%</td>
                                                        <td className="px-2 py-2 border text-right">{formatRp(pTot.hibah_a)}</td>
                                                        <td className="px-2 py-2 border text-right">{formatRp(pTot.hibah_rk)}</td>
                                                        <td className="px-2 py-2 border text-center">{pTot.hibah_rf_avg.toFixed(2)}%</td>
                                                    </tr>
                                                    {Object.keys(grouped[programName]).map(kegiatanName => {
                                                        const subs = grouped[programName][kegiatanName];
                                                        const tot = getKegiatanTotal(subs);
                                                        return (
                                                            <React.Fragment key={kegiatanName}>
                                                                <tr className="bg-gray-50 font-semibold text-gray-700">
                                                                    <td className="px-4 py-2 border pl-8">KEGIATAN: {kegiatanName}</td>
                                                                    <td className="px-2 py-2 border text-right">{formatRp(tot.pegawai_a)}</td>
                                                                    <td className="px-2 py-2 border text-right">{formatRp(tot.pegawai_rk)}</td>
                                                                    <td className="px-2 py-2 border text-center">{tot.pegawai_rf_avg.toFixed(2)}%</td>
                                                                    <td className="px-2 py-2 border text-right">{formatRp(tot.bj_a)}</td>
                                                                    <td className="px-2 py-2 border text-right">{formatRp(tot.bj_rk)}</td>
                                                                    <td className="px-2 py-2 border text-center">{tot.bj_rf_avg.toFixed(2)}%</td>
                                                                    <td className="px-2 py-2 border text-right">{formatRp(tot.modal_a)}</td>
                                                                    <td className="px-2 py-2 border text-right">{formatRp(tot.modal_rk)}</td>
                                                                    <td className="px-2 py-2 border text-center">{tot.modal_rf_avg.toFixed(2)}%</td>
                                                                    <td className="px-2 py-2 border text-right">{formatRp(tot.hibah_a)}</td>
                                                                    <td className="px-2 py-2 border text-right">{formatRp(tot.hibah_rk)}</td>
                                                                    <td className="px-2 py-2 border text-center">{tot.hibah_rf_avg.toFixed(2)}%</td>
                                                                </tr>
                                                            {subs.map(sub => (
                                                                <tr key={sub.id} className="hover:bg-blue-50">
                                                                    <td className="px-4 py-2 border pl-12">Sub: {sub.sub_kegiatan}</td>
                                                                    <td className="px-2 py-2 border text-right text-xs">{formatRp(sub.pegawai_anggaran)}</td>
                                                                    <td className="px-2 py-2 border text-right text-xs">{formatRp(sub.pegawai_realisasi_keuangan)}</td>
                                                                    <td className="px-2 py-2 border text-center text-xs">{sub.pegawai_realisasi_fisik}%</td>
                                                                    <td className="px-2 py-2 border text-right text-xs">{formatRp(sub.barang_jasa_anggaran)}</td>
                                                                    <td className="px-2 py-2 border text-right text-xs">{formatRp(sub.barang_jasa_realisasi_keuangan)}</td>
                                                                    <td className="px-2 py-2 border text-center text-xs">{sub.barang_jasa_realisasi_fisik}%</td>
                                                                    <td className="px-2 py-2 border text-right text-xs">{formatRp(sub.modal_anggaran)}</td>
                                                                    <td className="px-2 py-2 border text-right text-xs">{formatRp(sub.modal_realisasi_keuangan)}</td>
                                                                    <td className="px-2 py-2 border text-center text-xs">{sub.modal_realisasi_fisik}%</td>
                                                                    <td className="px-2 py-2 border text-right text-xs">{formatRp(sub.hibah_anggaran)}</td>
                                                                    <td className="px-2 py-2 border text-right text-xs">{formatRp(sub.hibah_realisasi_keuangan)}</td>
                                                                    <td className="px-2 py-2 border text-center text-xs">{sub.hibah_realisasi_fisik}%</td>
                                                                </tr>
                                                            ))}
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </React.Fragment>
                                        );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="4xl">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Input Realisasi Sub Kegiatan</h2>
                    
                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm font-semibold">
                            ⚠️ Harap periksa kembali isian Anda. Ada bagian yang kosong atau format tidak valid.
                            <ul className="list-disc ml-5 mt-1 font-normal">
                                {Object.values(errors).map((err, idx) => (
                                    <li key={idx}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={submitForm} className="space-y-4">
                        
                        <div className="grid grid-cols-1 gap-4 bg-gray-50 p-4 rounded-md">
                            <div>
                                <InputLabel htmlFor="tahun" value="Tahun Anggaran" />
                                <TextInput id="tahun" type="number" className="mt-1 block w-full" value={data.tahun} onChange={e => setData('tahun', e.target.value)} required />
                            </div>
                            <div className="hidden">
                                <select id="triwulan" value={data.triwulan} onChange={e => setData('triwulan', e.target.value)}>
                                    <option value="1">Triwulan 1</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <InputLabel htmlFor="program" value="Nama Program" />
                                <TextInput id="program" className="mt-1 block w-full" value={data.program} onChange={e => setData('program', e.target.value)} placeholder="Ketik atau pilih program..." list="program-list" required />
                                <datalist id="program-list">
                                    {Object.keys(grouped).map(p => <option key={p} value={p} />)}
                                </datalist>
                            </div>
                            <div>
                                <InputLabel htmlFor="kegiatan" value="Nama Kegiatan" />
                                <TextInput id="kegiatan" className="mt-1 block w-full" value={data.kegiatan} onChange={e => setData('kegiatan', e.target.value)} placeholder="Ketik atau pilih kegiatan..." list="kegiatan-list" required />
                                <datalist id="kegiatan-list">
                                    {data.program && grouped[data.program] ? Object.keys(grouped[data.program]).map(k => <option key={k} value={k} />) : null}
                                </datalist>
                            </div>
                            <div>
                                <InputLabel htmlFor="sub_kegiatan" value="Nama Sub Kegiatan" />
                                <TextInput id="sub_kegiatan" className="mt-1 block w-full" value={data.sub_kegiatan} onChange={e => setData('sub_kegiatan', e.target.value)} placeholder="Ketik sub kegiatan..." required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                            {/* Pegawai */}
                            <div className="border p-4 rounded-md bg-blue-50">
                                <h4 className="font-bold text-sm mb-2 text-blue-800">Belanja Pegawai</h4>
                                <div className="space-y-2">
                                    <InputLabel value="Anggaran (Rp)" />
                                    <TextInput type="number" className="block w-full text-sm" value={data.pegawai_anggaran} onChange={e => setData('pegawai_anggaran', e.target.value)} />
                                    <InputLabel value="Realisasi Keuangan (Rp)" />
                                    <TextInput type="number" className="block w-full text-sm" value={data.pegawai_realisasi_keuangan} onChange={e => setData('pegawai_realisasi_keuangan', e.target.value)} />
                                    <InputLabel value="Realisasi Fisik (%)" />
                                    <TextInput type="number" step="0.01" className="block w-full text-sm" value={data.pegawai_realisasi_fisik} onChange={e => setData('pegawai_realisasi_fisik', e.target.value)} />
                                </div>
                            </div>
                            {/* Barang Jasa */}
                            <div className="border p-4 rounded-md bg-green-50">
                                <h4 className="font-bold text-sm mb-2 text-green-800">Barang & Jasa</h4>
                                <div className="space-y-2">
                                    <InputLabel value="Anggaran (Rp)" />
                                    <TextInput type="number" className="block w-full text-sm" value={data.barang_jasa_anggaran} onChange={e => setData('barang_jasa_anggaran', e.target.value)} />
                                    <InputLabel value="Realisasi Keuangan (Rp)" />
                                    <TextInput type="number" className="block w-full text-sm" value={data.barang_jasa_realisasi_keuangan} onChange={e => setData('barang_jasa_realisasi_keuangan', e.target.value)} />
                                    <InputLabel value="Realisasi Fisik (%)" />
                                    <TextInput type="number" step="0.01" className="block w-full text-sm" value={data.barang_jasa_realisasi_fisik} onChange={e => setData('barang_jasa_realisasi_fisik', e.target.value)} />
                                </div>
                            </div>
                            {/* Modal */}
                            <div className="border p-4 rounded-md bg-blue-50">
                                <h4 className="font-bold text-sm mb-2 text-blue-800">Belanja Modal</h4>
                                <div className="space-y-2">
                                    <InputLabel value="Anggaran (Rp)" />
                                    <TextInput type="number" className="block w-full text-sm" value={data.modal_anggaran} onChange={e => setData('modal_anggaran', e.target.value)} />
                                    <InputLabel value="Realisasi Keuangan (Rp)" />
                                    <TextInput type="number" className="block w-full text-sm" value={data.modal_realisasi_keuangan} onChange={e => setData('modal_realisasi_keuangan', e.target.value)} />
                                    <InputLabel value="Realisasi Fisik (%)" />
                                    <TextInput type="number" step="0.01" className="block w-full text-sm" value={data.modal_realisasi_fisik} onChange={e => setData('modal_realisasi_fisik', e.target.value)} />
                                </div>
                            </div>
                            {/* Hibah */}
                            <div className="border p-4 rounded-md bg-purple-50">
                                <h4 className="font-bold text-sm mb-2 text-purple-800">Belanja Hibah</h4>
                                <div className="space-y-2">
                                    <InputLabel value="Anggaran (Rp)" />
                                    <TextInput type="number" className="block w-full text-sm" value={data.hibah_anggaran} onChange={e => setData('hibah_anggaran', e.target.value)} />
                                    <InputLabel value="Realisasi Keuangan (Rp)" />
                                    <TextInput type="number" className="block w-full text-sm" value={data.hibah_realisasi_keuangan} onChange={e => setData('hibah_realisasi_keuangan', e.target.value)} />
                                    <InputLabel value="Realisasi Fisik (%)" />
                                    <TextInput type="number" step="0.01" className="block w-full text-sm" value={data.hibah_realisasi_fisik} onChange={e => setData('hibah_realisasi_fisik', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={() => setIsModalOpen(false)}>Batal</SecondaryButton>
                            <PrimaryButton className="ml-3" disabled={processing}>Simpan Data</PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
