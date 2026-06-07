import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function FormE81({ formulir_data, tahun_aktif }) {
    const { flash, auth } = usePage().props;
    const opdName = auth?.user?.opd?.nama || 'NAMA OPD / SKPD';
    
    const handlePrint = () => {
        window.print();
    };
    
    const [isInputModalOpen, setIsInputModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [selectedTahun, setSelectedTahun] = useState(tahun_aktif);

    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // Form for manual input
    const { data: inputData, setData: setInputData, post: postInput, put: putInput, processing: inputProcessing, reset: resetInput, errors: inputErrors } = useForm({
        tahun: tahun_aktif,
        nomor: '',
        sasaran: '',
        program: '',
        kegiatan: '',
        sub_kegiatan: '',
        indikator_kinerja: '',
        satuan: '',
        target_renstra_akhir_kinerja: '',
        target_renstra_akhir_anggaran: '',
        realisasi_kinerja_tahun_lalu_kinerja: '',
        realisasi_kinerja_tahun_lalu_anggaran: '',
        target_kinerja_tahun_berjalan_kinerja: '',
        target_kinerja_tahun_berjalan_anggaran: '',
        realisasi_tw1_kinerja: '',
        realisasi_tw1_anggaran: '',
        realisasi_tw2_kinerja: '',
        realisasi_tw2_anggaran: '',
        realisasi_tw3_kinerja: '',
        realisasi_tw3_anggaran: '',
        realisasi_tw4_kinerja: '',
        realisasi_tw4_anggaran: '',
        realisasi_capaian_tahun_dievaluasi_kinerja: '',
        realisasi_capaian_tahun_dievaluasi_anggaran: '',
        realisasi_kinerja_renstra_tahun_berjalan_kinerja: '',
        realisasi_kinerja_renstra_tahun_berjalan_anggaran: '',
        tingkat_capaian_renstra_tahun_berjalan_kinerja: '',
        tingkat_capaian_renstra_tahun_berjalan_anggaran: '',
        unit_penanggung_jawab: '',
    });

    // Form for Excel import
    const { data: importData, setData: setImportData, post: postImport, processing: importProcessing, reset: resetImport, errors: importErrors, progress } = useForm({
        tahun: tahun_aktif,
        file: null,
    });

    // Delete form
    const { delete: destroy } = useForm();

    // Filter data based on selected year
    const filteredData = formulir_data.filter(item => item.tahun == selectedTahun);

    const { groupedData, grandTotal } = useMemo(() => {
        const groups = {};
        const grandTotalObj = {
            target_renstra_akhir_anggaran: 0,
            realisasi_kinerja_tahun_lalu_anggaran: 0,
            target_kinerja_tahun_berjalan_anggaran: 0,
            realisasi_tw1_anggaran: 0,
            realisasi_tw2_anggaran: 0,
            realisasi_tw3_anggaran: 0,
            realisasi_tw4_anggaran: 0,
            realisasi_capaian_tahun_dievaluasi_anggaran: 0,
            realisasi_kinerja_renstra_tahun_berjalan_anggaran: 0,
            tingkat_capaian_renstra_tahun_berjalan_anggaran: 0,
        };

        filteredData.forEach(row => {
            const prog = row.program || 'Tanpa Program';
            const keg = row.kegiatan || 'Tanpa Kegiatan';
            
            if (!groups[prog]) {
                groups[prog] = { 
                    name: prog, 
                    sasaran: row.sasaran || '',
                    kegiatans: {},
                    totals: {
                        target_renstra_akhir_anggaran: 0,
                        realisasi_kinerja_tahun_lalu_anggaran: 0,
                        target_kinerja_tahun_berjalan_anggaran: 0,
                        realisasi_tw1_anggaran: 0,
                        realisasi_tw2_anggaran: 0,
                        realisasi_tw3_anggaran: 0,
                        realisasi_tw4_anggaran: 0,
                        realisasi_capaian_tahun_dievaluasi_anggaran: 0,
                        realisasi_kinerja_renstra_tahun_berjalan_anggaran: 0,
                        tingkat_capaian_renstra_tahun_berjalan_anggaran: 0,
                    }
                };
            }
            if (!groups[prog].kegiatans[keg]) {
                groups[prog].kegiatans[keg] = { 
                    name: keg, 
                    rows: [],
                    totals: {
                        target_renstra_akhir_anggaran: 0,
                        realisasi_kinerja_tahun_lalu_anggaran: 0,
                        target_kinerja_tahun_berjalan_anggaran: 0,
                        realisasi_tw1_anggaran: 0,
                        realisasi_tw2_anggaran: 0,
                        realisasi_tw3_anggaran: 0,
                        realisasi_tw4_anggaran: 0,
                        realisasi_capaian_tahun_dievaluasi_anggaran: 0,
                        realisasi_kinerja_renstra_tahun_berjalan_anggaran: 0,
                        tingkat_capaian_renstra_tahun_berjalan_anggaran: 0,
                    }
                };
            }
            
            groups[prog].kegiatans[keg].rows.push(row);
            
            const fields = [
                'target_renstra_akhir_anggaran', 'realisasi_kinerja_tahun_lalu_anggaran', 
                'target_kinerja_tahun_berjalan_anggaran', 'realisasi_tw1_anggaran', 
                'realisasi_tw2_anggaran', 'realisasi_tw3_anggaran', 'realisasi_tw4_anggaran', 
                'realisasi_capaian_tahun_dievaluasi_anggaran', 'realisasi_kinerja_renstra_tahun_berjalan_anggaran', 
                'tingkat_capaian_renstra_tahun_berjalan_anggaran'
            ];

            fields.forEach(field => {
                const val = Number(row[field]) || 0;
                groups[prog].kegiatans[keg].totals[field] += val;
                groups[prog].totals[field] += val;
                grandTotalObj[field] += val;
            });
        });
        
        return {
            groupedData: Object.values(groups).map(prog => ({
                ...prog,
                kegiatans: Object.values(prog.kegiatans)
            })),
            grandTotal: grandTotalObj
        };
    }, [filteredData]);

    const submitInput = (e) => {
        e.preventDefault();
        
        if (isEditing) {
            putInput(route('renja.form_e81.update', editId), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsInputModalOpen(false);
                    resetInput();
                    setIsEditing(false);
                    setEditId(null);
                    alert('Data berhasil diperbarui!');
                },
                onError: (err) => console.error(err)
            });
        } else {
            postInput(route('renja.form_e81.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsInputModalOpen(false);
                    resetInput();
                    alert('Data berhasil disimpan!');
                },
                onError: (err) => console.error(err)
            });
        }
    };

    const handleEdit = (row) => {
        setIsEditing(true);
        setEditId(row.id);
        
        // Populate form data
        Object.keys(inputData).forEach(key => {
            if (row[key] !== undefined) {
                setInputData(key, row[key]);
            }
        });
        
        setIsInputModalOpen(true);
    };

    const submitImport = (e) => {
        e.preventDefault();
        postImport(route('renja.form_e81.import'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsImportModalOpen(false);
                resetImport('file');
                alert('File Excel berhasil di-import!');
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data ini?')) {
            destroy(route('renja.form_e81.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const formatRp = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
    };

    // Filter data logic moved to top

    const renderTwoColumnInput = (label, fieldKinerja, fieldAnggaran) => (
        <div className="border p-3 rounded bg-gray-50 mb-3">
            <InputLabel value={label} className="font-bold text-gray-800 mb-2" />
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <span className="text-xs text-gray-500">Kinerja (Fisik/%)</span>
                    <TextInput 
                        type="number" 
                        step="0.01" 
                        className="mt-1 block w-full text-sm" 
                        value={inputData[fieldKinerja]} 
                        onChange={e => setInputData(fieldKinerja, e.target.value)} 
                    />
                </div>
                <div>
                    <span className="text-xs text-gray-500">Anggaran (Rp)</span>
                    <TextInput 
                        type="number" 
                        className="mt-1 block w-full text-sm" 
                        value={inputData[fieldAnggaran]} 
                        onChange={e => setInputData(fieldAnggaran, e.target.value)} 
                    />
                </div>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Formulir E.81 (Evaluasi Hasil Pelaksanaan Renja)
                </h2>
            }
        >
            <Head title={`Formulir E.81 - ${auth?.user?.opd?.nama || 'OPD Belum Diatur'}`} />

            <div className="py-12">
                <div className="mx-auto max-w-[100rem] sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        
                        {/* Print Header */}
                        <div className="hidden print:flex items-center justify-between mb-6 border-b-2 border-black pb-4">
                            <div className="w-24">
                                <img src="/images/logo_sungai_penuh.png" alt="Logo" className="w-full" />
                            </div>
                            <div className="text-center flex-1">
                                <h1 className="text-xl font-bold uppercase">PEMERINTAH KOTA SUNGAI PENUH</h1>
                                <h2 className="text-2xl font-bold uppercase">{opdName}</h2>
                                <h3 className="text-lg font-bold uppercase mt-4">Formulir E.81</h3>
                                <p className="text-sm mt-1 font-semibold">Periode Pelaksanaan : Tahun Anggaran {selectedTahun}</p>
                            </div>
                            <div className="w-24"></div>
                        </div>

                        {/* Header Controls */}
                        <div className="flex justify-between items-center mb-6 print:hidden">
                            <div className="flex items-center gap-4">
                                <label className="font-medium text-gray-700">Tahun Laporan:</label>
                                <select 
                                    className="border-gray-300 rounded-md"
                                    value={selectedTahun}
                                    onChange={e => setSelectedTahun(e.target.value)}
                                >
                                    {[...Array(5)].map((_, i) => {
                                        const year = new Date().getFullYear() - 2 + i;
                                        return <option key={year} value={year}>{year}</option>;
                                    })}
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handlePrint} className="bg-slate-600 text-white px-4 py-2 rounded-md shadow hover:bg-slate-700 transition flex items-center text-sm font-semibold">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                    Cetak PDF
                                </button>
                                <PrimaryButton onClick={() => setIsImportModalOpen(true)} className="bg-green-600 hover:bg-green-700">
                                    Import Excel
                                </PrimaryButton>
                                <PrimaryButton onClick={() => {
                                    setIsEditing(false);
                                    setEditId(null);
                                    resetInput();
                                    setIsInputModalOpen(true);
                                }}>
                                    Input Manual
                                </PrimaryButton>
                            </div>
                        </div>

                        {/* Flash Messages */}
                        {flash?.success && (
                            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                {flash.success}
                            </div>
                        )}
                        {importErrors?.file && (
                            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {importErrors.file}
                            </div>
                        )}

                        {/* Large Data Table */}
                        <div className="overflow-x-auto border rounded-lg print:overflow-visible print:border-none">
                            <table className="min-w-max w-full border-collapse text-sm print:text-[10px]">
                                <thead className="bg-gray-100 text-gray-700">
                                    <tr>
                                        <th rowSpan="3" className="border px-4 py-2 w-16">No</th>
                                        <th rowSpan="3" className="border px-4 py-2 w-48">Sasaran</th>
                                        <th rowSpan="3" className="border px-4 py-2 w-64">Program/Kegiatan/Sub Kegiatan</th>
                                        <th rowSpan="3" className="border px-4 py-2 w-48">Indikator Kinerja</th>
                                        <th rowSpan="3" className="border px-4 py-2 w-32">Satuan</th>
                                        
                                        <th colSpan="2" rowSpan="2" className="border px-4 py-2 text-center bg-blue-50">Target Renstra Akhir</th>
                                        <th colSpan="2" rowSpan="2" className="border px-4 py-2 text-center bg-blue-50">Realisasi s/d Tahun Lalu</th>
                                        <th colSpan="2" rowSpan="2" className="border px-4 py-2 text-center bg-blue-50">Target Tahun Berjalan</th>
                                        
                                        <th colSpan="8" className="border px-4 py-2 text-center bg-green-100 font-bold">Realisasi Kinerja Pada Triwulan</th>
                                        
                                        <th colSpan="2" rowSpan="2" className="border px-4 py-2 text-center bg-blue-50">Capaian Tahun Evaluasi</th>
                                        <th colSpan="2" rowSpan="2" className="border px-4 py-2 text-center bg-purple-50">Realisasi Renstra s/d Tahun Berjalan</th>
                                        <th colSpan="2" rowSpan="2" className="border px-4 py-2 text-center bg-purple-50">Tingkat Capaian s/d Tahun Berjalan</th>
                                        
                                        <th rowSpan="3" className="border px-4 py-2 w-48">Unit Penanggung Jawab</th>
                                        <th rowSpan="3" className="border px-4 py-2 w-24 print:hidden">Aksi</th>
                                    </tr>
                                    <tr>
                                        <th colSpan="2" className="border px-4 py-2 text-center bg-green-50">TW I</th>
                                        <th colSpan="2" className="border px-4 py-2 text-center bg-green-50">TW II</th>
                                        <th colSpan="2" className="border px-4 py-2 text-center bg-green-50">TW III</th>
                                        <th colSpan="2" className="border px-4 py-2 text-center bg-green-50">TW IV</th>
                                    </tr>
                                    <tr>
                                        {/* 11 Pairs of Fisik / Keuangan */}
                                        {[...Array(11)].map((_, i) => (
                                            <React.Fragment key={i}>
                                                <th className="border px-2 py-1 text-center font-normal">K</th>
                                                <th className="border px-2 py-1 text-center font-normal">Rp</th>
                                            </React.Fragment>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length === 0 ? (
                                        <tr>
                                            <td colSpan="28" className="border px-4 py-8 text-center text-gray-500">
                                                Belum ada data Formulir E.81 untuk tahun {selectedTahun}.
                                            </td>
                                        </tr>
                                    ) : (
                                        <>
                                            {/* Grand Total Row */}
                                            <tr className="bg-yellow-200 text-gray-900 font-extrabold uppercase">
                                                <td className="border px-2 py-3 border-gray-400"></td>
                                                <td className="border px-2 py-3 border-gray-400"></td>
                                                <td className="border px-2 py-3 border-gray-400 pl-2" colSpan="3">TOTAL SELURUH PROGRAM</td>
                                                
                                                <td className="border px-2 py-3 border-gray-400 text-center"></td>
                                                <td className="border px-2 py-3 border-gray-400 text-right">{formatRp(grandTotal.target_renstra_akhir_anggaran)}</td>
                                                
                                                <td className="border px-2 py-3 border-gray-400 text-center"></td>
                                                <td className="border px-2 py-3 border-gray-400 text-right">{formatRp(grandTotal.realisasi_kinerja_tahun_lalu_anggaran)}</td>
                                                
                                                <td className="border px-2 py-3 border-gray-400 text-center"></td>
                                                <td className="border px-2 py-3 border-gray-400 text-right">{formatRp(grandTotal.target_kinerja_tahun_berjalan_anggaran)}</td>
                                                
                                                <td className="border px-2 py-3 border-gray-400 text-center"></td>
                                                <td className="border px-2 py-3 border-gray-400 text-right">{formatRp(grandTotal.realisasi_tw1_anggaran)}</td>
                                                
                                                <td className="border px-2 py-3 border-gray-400 text-center"></td>
                                                <td className="border px-2 py-3 border-gray-400 text-right">{formatRp(grandTotal.realisasi_tw2_anggaran)}</td>
                                                
                                                <td className="border px-2 py-3 border-gray-400 text-center"></td>
                                                <td className="border px-2 py-3 border-gray-400 text-right">{formatRp(grandTotal.realisasi_tw3_anggaran)}</td>
                                                
                                                <td className="border px-2 py-3 border-gray-400 text-center"></td>
                                                <td className="border px-2 py-3 border-gray-400 text-right">{formatRp(grandTotal.realisasi_tw4_anggaran)}</td>
                                                
                                                <td className="border px-2 py-3 border-gray-400 text-center"></td>
                                                <td className="border px-2 py-3 border-gray-400 text-right">{formatRp(grandTotal.realisasi_capaian_tahun_dievaluasi_anggaran)}</td>
                                                
                                                <td className="border px-2 py-3 border-gray-400 text-center"></td>
                                                <td className="border px-2 py-3 border-gray-400 text-right">{formatRp(grandTotal.realisasi_kinerja_renstra_tahun_berjalan_anggaran)}</td>
                                                
                                                <td className="border px-2 py-3 border-gray-400 text-center"></td>
                                                <td className="border px-2 py-3 border-gray-400 text-right">{formatRp(grandTotal.tingkat_capaian_renstra_tahun_berjalan_anggaran)}</td>
                                                
                                                <td colSpan="2" className="border px-2 py-3 border-gray-400"></td>
                                            </tr>

                                            {groupedData.map((prog, progIndex) => (
                                                <React.Fragment key={`prog-${progIndex}`}>
                                                    {/* Program Row */}
                                                    <tr className="bg-gray-800 text-white font-bold">
                                                        <td className="border px-2 py-2 text-center border-gray-600"></td>
                                                        <td className="border px-2 py-2 border-gray-600 font-normal">{prog.sasaran}</td>
                                                        <td className="border px-2 py-2 border-gray-600 uppercase pl-4" colSpan="3">{prog.name}</td>
                                                        
                                                        <td className="border px-2 py-2 border-gray-600 text-center"></td>
                                                        <td className="border px-2 py-2 border-gray-600 text-right">{formatRp(prog.totals.target_renstra_akhir_anggaran)}</td>
                                                        
                                                        <td className="border px-2 py-2 border-gray-600 text-center"></td>
                                                        <td className="border px-2 py-2 border-gray-600 text-right">{formatRp(prog.totals.realisasi_kinerja_tahun_lalu_anggaran)}</td>
                                                        
                                                        <td className="border px-2 py-2 border-gray-600 text-center"></td>
                                                        <td className="border px-2 py-2 border-gray-600 text-right">{formatRp(prog.totals.target_kinerja_tahun_berjalan_anggaran)}</td>
                                                        
                                                        <td className="border px-2 py-2 border-gray-600 text-center"></td>
                                                        <td className="border px-2 py-2 border-gray-600 text-right">{formatRp(prog.totals.realisasi_tw1_anggaran)}</td>
                                                        
                                                        <td className="border px-2 py-2 border-gray-600 text-center"></td>
                                                        <td className="border px-2 py-2 border-gray-600 text-right">{formatRp(prog.totals.realisasi_tw2_anggaran)}</td>
                                                        
                                                        <td className="border px-2 py-2 border-gray-600 text-center"></td>
                                                        <td className="border px-2 py-2 border-gray-600 text-right">{formatRp(prog.totals.realisasi_tw3_anggaran)}</td>
                                                        
                                                        <td className="border px-2 py-2 border-gray-600 text-center"></td>
                                                        <td className="border px-2 py-2 border-gray-600 text-right">{formatRp(prog.totals.realisasi_tw4_anggaran)}</td>
                                                        
                                                        <td className="border px-2 py-2 border-gray-600 text-center"></td>
                                                        <td className="border px-2 py-2 border-gray-600 text-right">{formatRp(prog.totals.realisasi_capaian_tahun_dievaluasi_anggaran)}</td>
                                                        
                                                        <td className="border px-2 py-2 border-gray-600 text-center"></td>
                                                        <td className="border px-2 py-2 border-gray-600 text-right">{formatRp(prog.totals.realisasi_kinerja_renstra_tahun_berjalan_anggaran)}</td>
                                                        
                                                        <td className="border px-2 py-2 border-gray-600 text-center"></td>
                                                        <td className="border px-2 py-2 border-gray-600 text-right">{formatRp(prog.totals.tingkat_capaian_renstra_tahun_berjalan_anggaran)}</td>
                                                        
                                                        <td colSpan="2" className="border px-2 py-2 border-gray-600"></td>
                                                    </tr>
                                                    
                                                    {prog.kegiatans.map((keg, kegIndex) => (
                                                    <React.Fragment key={`keg-${progIndex}-${kegIndex}`}>
                                                        {/* Kegiatan Row */}
                                                        <tr className="bg-gray-200 font-semibold text-gray-800">
                                                            <td className="border px-2 py-2 border-gray-300"></td>
                                                            <td className="border px-2 py-2 border-gray-300"></td>
                                                            <td className="border px-2 py-2 border-gray-300 uppercase pl-6" colSpan="3">{keg.name}</td>
                                                            
                                                            <td className="border px-2 py-2 border-gray-300 text-center"></td>
                                                            <td className="border px-2 py-2 border-gray-300 text-right">{formatRp(keg.totals.target_renstra_akhir_anggaran)}</td>
                                                            
                                                            <td className="border px-2 py-2 border-gray-300 text-center"></td>
                                                            <td className="border px-2 py-2 border-gray-300 text-right">{formatRp(keg.totals.realisasi_kinerja_tahun_lalu_anggaran)}</td>
                                                            
                                                            <td className="border px-2 py-2 border-gray-300 text-center"></td>
                                                            <td className="border px-2 py-2 border-gray-300 text-right">{formatRp(keg.totals.target_kinerja_tahun_berjalan_anggaran)}</td>
                                                            
                                                            <td className="border px-2 py-2 border-gray-300 text-center"></td>
                                                            <td className="border px-2 py-2 border-gray-300 text-right">{formatRp(keg.totals.realisasi_tw1_anggaran)}</td>
                                                            
                                                            <td className="border px-2 py-2 border-gray-300 text-center"></td>
                                                            <td className="border px-2 py-2 border-gray-300 text-right">{formatRp(keg.totals.realisasi_tw2_anggaran)}</td>
                                                            
                                                            <td className="border px-2 py-2 border-gray-300 text-center"></td>
                                                            <td className="border px-2 py-2 border-gray-300 text-right">{formatRp(keg.totals.realisasi_tw3_anggaran)}</td>
                                                            
                                                            <td className="border px-2 py-2 border-gray-300 text-center"></td>
                                                            <td className="border px-2 py-2 border-gray-300 text-right">{formatRp(keg.totals.realisasi_tw4_anggaran)}</td>
                                                            
                                                            <td className="border px-2 py-2 border-gray-300 text-center"></td>
                                                            <td className="border px-2 py-2 border-gray-300 text-right">{formatRp(keg.totals.realisasi_capaian_tahun_dievaluasi_anggaran)}</td>
                                                            
                                                            <td className="border px-2 py-2 border-gray-300 text-center"></td>
                                                            <td className="border px-2 py-2 border-gray-300 text-right">{formatRp(keg.totals.realisasi_kinerja_renstra_tahun_berjalan_anggaran)}</td>
                                                            
                                                            <td className="border px-2 py-2 border-gray-300 text-center"></td>
                                                            <td className="border px-2 py-2 border-gray-300 text-right">{formatRp(keg.totals.tingkat_capaian_renstra_tahun_berjalan_anggaran)}</td>
                                                            
                                                            <td colSpan="2" className="border px-2 py-2 border-gray-300"></td>
                                                        </tr>
                                                        
                                                        {/* Sub Kegiatan Rows */}
                                                        {keg.rows.map((row, index) => (
                                                            <tr key={row.id} className="hover:bg-blue-50 bg-white">
                                                                <td className="border px-2 py-2 text-center text-gray-500 text-sm">{index + 1}</td>
                                                                <td className="border px-2 py-2"></td>
                                                                <td className="border px-2 py-2 pl-10 text-sm text-gray-600">{row.sub_kegiatan}</td>
                                                                <td className="border px-2 py-2">{row.indikator_kinerja}</td>
                                                                <td className="border px-2 py-2">{row.satuan}</td>
                                                                
                                                                <td className="border px-2 py-2 text-center">{row.target_renstra_akhir_kinerja}</td>
                                                                <td className="border px-2 py-2 text-right">{formatRp(row.target_renstra_akhir_anggaran)}</td>
                                                                
                                                                <td className="border px-2 py-2 text-center">{row.realisasi_kinerja_tahun_lalu_kinerja}</td>
                                                                <td className="border px-2 py-2 text-right">{formatRp(row.realisasi_kinerja_tahun_lalu_anggaran)}</td>
                                                                
                                                                <td className="border px-2 py-2 text-center">{row.target_kinerja_tahun_berjalan_kinerja}</td>
                                                                <td className="border px-2 py-2 text-right">{formatRp(row.target_kinerja_tahun_berjalan_anggaran)}</td>
                                                                
                                                                <td className="border px-2 py-2 text-center">{row.realisasi_tw1_kinerja}</td>
                                                                <td className="border px-2 py-2 text-right">{formatRp(row.realisasi_tw1_anggaran)}</td>
                                                                
                                                                <td className="border px-2 py-2 text-center">{row.realisasi_tw2_kinerja}</td>
                                                                <td className="border px-2 py-2 text-right">{formatRp(row.realisasi_tw2_anggaran)}</td>
                                                                
                                                                <td className="border px-2 py-2 text-center">{row.realisasi_tw3_kinerja}</td>
                                                                <td className="border px-2 py-2 text-right">{formatRp(row.realisasi_tw3_anggaran)}</td>
                                                                
                                                                <td className="border px-2 py-2 text-center">{row.realisasi_tw4_kinerja}</td>
                                                                <td className="border px-2 py-2 text-right">{formatRp(row.realisasi_tw4_anggaran)}</td>
                                                                
                                                                <td className="border px-2 py-2 text-center">{row.realisasi_capaian_tahun_dievaluasi_kinerja}</td>
                                                                <td className="border px-2 py-2 text-right">{formatRp(row.realisasi_capaian_tahun_dievaluasi_anggaran)}</td>
                                                                
                                                                <td className="border px-2 py-2 text-center">{row.realisasi_kinerja_renstra_tahun_berjalan_kinerja}</td>
                                                                <td className="border px-2 py-2 text-right">{formatRp(row.realisasi_kinerja_renstra_tahun_berjalan_anggaran)}</td>
                                                                
                                                                <td className="border px-2 py-2 text-center">{row.tingkat_capaian_renstra_tahun_berjalan_kinerja}</td>
                                                                <td className="border px-2 py-2 text-right">{formatRp(row.tingkat_capaian_renstra_tahun_berjalan_anggaran)}</td>
                                                                
                                                                <td className="border px-2 py-2">{row.unit_penanggung_jawab}</td>
                                                                <td className="border px-2 py-2 text-center flex flex-col gap-1 items-center justify-center h-full print:hidden">
                                                                    <button onClick={() => handleEdit(row)} className="text-blue-600 hover:text-blue-900 font-medium">Ubah</button>
                                                                    <button onClick={() => handleDelete(row.id)} className="text-red-600 hover:text-red-900 font-medium">Hapus</button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </React.Fragment>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Panduan Import Excel */}
                    <div className="mt-8 overflow-hidden bg-white shadow-sm sm:rounded-lg p-6 border-l-4 border-blue-500 print:hidden">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Panduan Import Excel
                        </h3>
                        <div className="text-sm text-gray-600 space-y-3">
                            <p>Untuk menghindari error saat melakukan <strong>Import Excel</strong>, pastikan file <code className="bg-gray-100 px-1 py-0.5 rounded text-red-600">.xlsx</code> Anda mengikuti aturan baku berikut:</p>
                            <ul className="list-disc list-inside ml-2 space-y-1">
                                <li>Data harus berada di <strong>Sheet pertama</strong>.</li>
                                <li>Pembacaan data dimulai secara otomatis dari <strong>Baris ke-3 (Row 3)</strong>. Anda dapat menggunakan baris 1 dan 2 untuk Judul Tabel / Header Anda.</li>
                                <li>Pastikan nilai yang diisi pada kolom berjenis <strong>Kinerja/Fisik</strong> dan <strong>Anggaran/Rp</strong> adalah murni <strong className="text-red-500">Angka</strong> (contoh: <code className="bg-gray-100 px-1 py-0.5 rounded">1000000</code>). Jangan menggunakan simbol huruf (contoh salah: <code className="bg-gray-100 px-1 py-0.5 rounded">Rp 1.000.000</code> atau <code className="bg-gray-100 px-1 py-0.5 rounded">100%</code>).</li>
                            </ul>
                            
                            <h4 className="font-semibold text-gray-800 mt-4 border-b pb-2">Susunan Kolom (Kiri ke Kanan)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 mt-2 bg-gray-50 p-4 rounded border">
                                <div><strong className="text-blue-600">Kolom A:</strong> Nomor</div>
                                <div><strong className="text-blue-600">Kolom B:</strong> Sasaran</div>
                                <div><strong className="text-blue-600">Kolom C:</strong> Program</div>
                                <div><strong className="text-blue-600">Kolom D:</strong> Kegiatan</div>
                                <div><strong className="text-blue-600">Kolom E:</strong> Sub Kegiatan</div>
                                <div><strong className="text-blue-600">Kolom F:</strong> Indikator Kinerja</div>
                                <div><strong className="text-blue-600">Kolom G:</strong> Satuan</div>
                                <div><strong className="text-blue-600">Kolom H:</strong> Target Renstra Akhir (Kinerja)</div>
                                <div><strong className="text-blue-600">Kolom I:</strong> Target Renstra Akhir (Rp)</div>
                                <div><strong className="text-blue-600">Kolom J:</strong> Realisasi s/d Thn Lalu (Kinerja)</div>
                                <div><strong className="text-blue-600">Kolom K:</strong> Realisasi s/d Thn Lalu (Rp)</div>
                                <div><strong className="text-blue-600">Kolom L:</strong> Target Tahun Berjalan (Kinerja)</div>
                                <div><strong className="text-blue-600">Kolom M:</strong> Target Tahun Berjalan (Rp)</div>
                                <div><strong className="text-blue-600">Kolom N:</strong> TW I (Kinerja)</div>
                                <div><strong className="text-blue-600">Kolom O:</strong> TW I (Rp)</div>
                                <div><strong className="text-blue-600">Kolom P:</strong> TW II (Kinerja)</div>
                                <div><strong className="text-blue-600">Kolom Q:</strong> TW II (Rp)</div>
                                <div><strong className="text-blue-600">Kolom R:</strong> TW III (Kinerja)</div>
                                <div><strong className="text-blue-600">Kolom S:</strong> TW III (Rp)</div>
                                <div><strong className="text-blue-600">Kolom T:</strong> TW IV (Kinerja)</div>
                                <div><strong className="text-blue-600">Kolom U:</strong> TW IV (Rp)</div>
                                <div><strong className="text-blue-600">Kolom V:</strong> Capaian Evaluasi (Kinerja)</div>
                                <div><strong className="text-blue-600">Kolom W:</strong> Capaian Evaluasi (Rp)</div>
                                <div><strong className="text-blue-600">Kolom X:</strong> Realisasi Renstra s/d Thn (Kinerja)</div>
                                <div><strong className="text-blue-600">Kolom Y:</strong> Realisasi Renstra s/d Thn (Rp)</div>
                                <div><strong className="text-blue-600">Kolom Z:</strong> Tkt Capaian Renstra s/d Thn (Kinerja)</div>
                                <div><strong className="text-blue-600">Kolom AA:</strong> Tkt Capaian Renstra s/d Thn (Rp)</div>
                                <div className="lg:col-span-3"><strong className="text-blue-600">Kolom AB:</strong> Unit Penanggung Jawab</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Import Excel */}
            <Modal show={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Import Data dari Excel</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Pastikan format tabel Excel Anda mengikuti urutan kolom dari kiri ke kanan secara presisi. Mulai membaca data dari Baris ke-3.
                    </p>
                    <form onSubmit={submitImport} className="space-y-4">
                        <div>
                            <InputLabel value="Tahun Laporan" />
                            <TextInput type="number" className="block w-full mt-1" value={importData.tahun} onChange={e => setImportData('tahun', e.target.value)} required />
                        </div>
                        <div>
                            <InputLabel value="File Excel (.xlsx)" />
                            <input 
                                type="file" 
                                accept=".xlsx,.xls" 
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700" 
                                onChange={e => setImportData('file', e.target.files[0])}
                                required
                            />
                            {progress && <progress value={progress.percentage} max="100">{progress.percentage}%</progress>}
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <SecondaryButton onClick={() => setIsImportModalOpen(false)}>Batal</SecondaryButton>
                            <PrimaryButton disabled={importProcessing}>Upload & Import</PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Modal Input Manual */}
            <Modal show={isInputModalOpen} onClose={() => setIsInputModalOpen(false)} maxWidth="4xl">
                <div className="p-6 h-[80vh] overflow-y-auto">
                    <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Input Manual Formulir E.81</h2>
                    
                    <form onSubmit={submitInput} className="space-y-6">
                        <div className="mb-4">
                            <InputLabel value="Tahun Laporan" />
                            <TextInput type="number" className="block w-full mt-1 bg-gray-100" value={inputData.tahun} readOnly />
                        </div>

                        <div>
                            <InputLabel value="Sasaran" />
                            <TextInput type="text" className="block w-full mt-1" value={inputData.sasaran} onChange={e => setInputData('sasaran', e.target.value)} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-md bg-gray-50">
                            <div>
                                <InputLabel value="Program" />
                                <TextInput type="text" className="block w-full mt-1" value={inputData.program} onChange={e => setInputData('program', e.target.value)} />
                            </div>
                            <div>
                                <InputLabel value="Kegiatan" />
                                <TextInput type="text" className="block w-full mt-1" value={inputData.kegiatan} onChange={e => setInputData('kegiatan', e.target.value)} />
                            </div>
                            <div>
                                <InputLabel value="Sub Kegiatan" />
                                <TextInput type="text" className="block w-full mt-1" value={inputData.sub_kegiatan} onChange={e => setInputData('sub_kegiatan', e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Indikator Kinerja Program / Kegiatan" />
                                <TextInput type="text" className="block w-full mt-1" value={inputData.indikator_kinerja} onChange={e => setInputData('indikator_kinerja', e.target.value)} />
                            </div>
                            <div>
                                <InputLabel value="Satuan" />
                                <TextInput type="text" className="block w-full mt-1" value={inputData.satuan} onChange={e => setInputData('satuan', e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                            {renderTwoColumnInput('Target Renstra Akhir', 'target_renstra_akhir_kinerja', 'target_renstra_akhir_anggaran')}
                            {renderTwoColumnInput('Realisasi s/d Tahun Lalu', 'realisasi_kinerja_tahun_lalu_kinerja', 'realisasi_kinerja_tahun_lalu_anggaran')}
                            {renderTwoColumnInput('Target Tahun Berjalan', 'target_kinerja_tahun_berjalan_kinerja', 'target_kinerja_tahun_berjalan_anggaran')}
                            {renderTwoColumnInput('Capaian Tahun Evaluasi', 'realisasi_capaian_tahun_dievaluasi_kinerja', 'realisasi_capaian_tahun_dievaluasi_anggaran')}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                            {renderTwoColumnInput('Realisasi TW I', 'realisasi_tw1_kinerja', 'realisasi_tw1_anggaran')}
                            {renderTwoColumnInput('Realisasi TW II', 'realisasi_tw2_kinerja', 'realisasi_tw2_anggaran')}
                            {renderTwoColumnInput('Realisasi TW III', 'realisasi_tw3_kinerja', 'realisasi_tw3_anggaran')}
                            {renderTwoColumnInput('Realisasi TW IV', 'realisasi_tw4_kinerja', 'realisasi_tw4_anggaran')}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                            {renderTwoColumnInput('Realisasi Renstra s/d Tahun Berjalan', 'realisasi_kinerja_renstra_tahun_berjalan_kinerja', 'realisasi_kinerja_renstra_tahun_berjalan_anggaran')}
                            {renderTwoColumnInput('Tingkat Capaian s/d Tahun Berjalan', 'tingkat_capaian_renstra_tahun_berjalan_kinerja', 'tingkat_capaian_renstra_tahun_berjalan_anggaran')}
                        </div>

                        <div>
                            <InputLabel value="Unit Penanggung Jawab" />
                            <TextInput type="text" className="block w-full mt-1" value={inputData.unit_penanggung_jawab} onChange={e => setInputData('unit_penanggung_jawab', e.target.value)} />
                        </div>

                        <div className="flex justify-end gap-2 pt-6 border-t">
                            <SecondaryButton onClick={() => setIsInputModalOpen(false)}>Batal</SecondaryButton>
                            <PrimaryButton disabled={inputProcessing}>Simpan Data</PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

        </AuthenticatedLayout>
    );
}
