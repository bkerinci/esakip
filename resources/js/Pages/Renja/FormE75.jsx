import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function FormE75({ formulir_data, tahun_aktif }) {
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
        kode: '',
        program: '',
        kegiatan: '',
        sub_kegiatan: '',
        indikator_kinerja_renja: '',
        indikator_kinerja_rka: '',
        rencana_lokasi_renja: '',
        rencana_lokasi_rka: '',
        rencana_target_renja: '',
        rencana_target_rka: '',
        rencana_dana_renja: '',
        rencana_dana_rka: '',
        prakiraan_maju_target_renja: '',
        prakiraan_maju_target_rka: '',
        prakiraan_maju_dana_renja: '',
        prakiraan_maju_dana_rka: '',
        kesesuaian: '',
        evaluasi: '',
        tindak_lanjut: '',
        hasil_tindak_lanjut: '',
    });

    // Form for Excel import
    const { data: importData, setData: setImportData, post: postImport, processing: importProcessing, reset: resetImport, errors: importErrors, progress } = useForm({
        tahun: tahun_aktif,
        file: null,
    });

    const { delete: destroy } = useForm();

    const filteredData = formulir_data.filter(item => item.tahun == selectedTahun);

    const { groupedData, grandTotal } = useMemo(() => {
        const groups = {};
        const grandTotalObj = {
            rencana_dana_renja: 0,
            rencana_dana_rka: 0,
            prakiraan_maju_dana_renja: 0,
            prakiraan_maju_dana_rka: 0,
        };

        filteredData.forEach(row => {
            const prog = row.program || 'Tanpa Program';
            const keg = row.kegiatan || 'Tanpa Kegiatan';
            
            if (!groups[prog]) {
                groups[prog] = { 
                    name: prog, 
                    kode: row.kode || '',
                    kegiatans: {},
                    totals: {
                        rencana_dana_renja: 0,
                        rencana_dana_rka: 0,
                        prakiraan_maju_dana_renja: 0,
                        prakiraan_maju_dana_rka: 0,
                    }
                };
            }
            if (!groups[prog].kegiatans[keg]) {
                groups[prog].kegiatans[keg] = { 
                    name: keg, 
                    kode: row.kode || '',
                    rows: [],
                    totals: {
                        rencana_dana_renja: 0,
                        rencana_dana_rka: 0,
                        prakiraan_maju_dana_renja: 0,
                        prakiraan_maju_dana_rka: 0,
                    }
                };
            }
            
            groups[prog].kegiatans[keg].rows.push(row);
            
            const fields = [
                'rencana_dana_renja', 'rencana_dana_rka', 
                'prakiraan_maju_dana_renja', 'prakiraan_maju_dana_rka'
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
            putInput(route('renja.form_e75.update', editId), {
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
            postInput(route('renja.form_e75.store'), {
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
        
        Object.keys(inputData).forEach(key => {
            if (row[key] !== undefined) {
                setInputData(key, row[key] === null ? '' : row[key]);
            }
        });
        
        setIsInputModalOpen(true);
    };

    const submitImport = (e) => {
        e.preventDefault();
        postImport(route('renja.form_e75.import'), {
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
            destroy(route('renja.form_e75.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const formatRp = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Formulir E.75 (Tabel Kesesuaian)
                </h2>
            }
        >
            <Head title={`Formulir E.75 - ${auth?.user?.opd?.nama || 'OPD Belum Diatur'}`} />

            <div className="py-12">
                <div className="mx-auto max-w-[120rem] sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        
                        {/* Print Header */}
                        <div className="hidden print:flex items-center justify-between mb-6 border-b-2 border-black pb-4">
                            <div className="w-24">
                                <img src="/images/logo_sungai_penuh.png" alt="Logo" className="w-full" />
                            </div>
                            <div className="text-center flex-1">
                                <h1 className="text-xl font-bold uppercase">PEMERINTAH KOTA SUNGAI PENUH</h1>
                                <h2 className="text-2xl font-bold uppercase">{opdName}</h2>
                                <h3 className="text-lg font-bold uppercase mt-4">Formulir E.75</h3>
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
                                <thead className="bg-gray-100 text-gray-700 text-center align-middle">
                                    <tr>
                                        <th rowSpan="3" className="border px-2 py-2 w-16">Kode</th>
                                        <th rowSpan="3" className="border px-4 py-2 w-64">Urusan/Bidang Urusan<br/>Pemerintahan Daerah dan<br/>Program/Kegiatan/Sub Kegiatan</th>
                                        
                                        <th colSpan="2" className="border px-2 py-2 bg-blue-50">Indikator Kinerja</th>
                                        
                                        <th colSpan="6" className="border px-2 py-2 bg-green-50">Rencana Tahun {selectedTahun}</th>
                                        <th colSpan="4" className="border px-2 py-2 bg-yellow-50">Prakiraan Maju Rencana Tahun {Number(selectedTahun) + 1}</th>
                                        
                                        <th colSpan="2" className="border px-2 py-2 bg-red-50">Kesesuaian</th>
                                        
                                        <th rowSpan="3" className="border px-4 py-2 w-48">Evaluasi Hasil Kesesuaian<br/>(Bila Tidak Sesuai)</th>
                                        <th rowSpan="3" className="border px-4 py-2 w-48">Tindak Lanjut<br/>Atas Hasil Evaluasi</th>
                                        <th rowSpan="3" className="border px-4 py-2 w-48">Hasil Tindak Lanjut</th>
                                        <th rowSpan="3" className="border px-4 py-2 w-24 print:hidden">Aksi</th>
                                    </tr>
                                    <tr>
                                        <th rowSpan="2" className="border px-2 py-1 bg-blue-50">Renja</th>
                                        <th rowSpan="2" className="border px-2 py-1 bg-blue-50">RKA</th>
                                        
                                        <th colSpan="2" className="border px-2 py-1 bg-green-50">Lokasi</th>
                                        <th colSpan="2" className="border px-2 py-1 bg-green-50">Target Capaian Kinerja</th>
                                        <th colSpan="2" className="border px-2 py-1 bg-green-50">Dana</th>
                                        
                                        <th colSpan="2" className="border px-2 py-1 bg-yellow-50">Target Capaian Kinerja</th>
                                        <th colSpan="2" className="border px-2 py-1 bg-yellow-50">Dana</th>
                                        
                                        <th rowSpan="2" className="border px-2 py-1 bg-red-50 w-12">Ya</th>
                                        <th rowSpan="2" className="border px-2 py-1 bg-red-50 w-12">Tidak</th>
                                    </tr>
                                    <tr>
                                        {/* Lokasi */}
                                        <th className="border px-2 py-1 bg-green-50">Renja</th>
                                        <th className="border px-2 py-1 bg-green-50">RKA</th>
                                        
                                        {/* Target Rencana */}
                                        <th className="border px-2 py-1 bg-green-50">Renja</th>
                                        <th className="border px-2 py-1 bg-green-50">RKA</th>
                                        
                                        {/* Dana Rencana */}
                                        <th className="border px-2 py-1 bg-green-50">Renja</th>
                                        <th className="border px-2 py-1 bg-green-50">RKA</th>
                                        
                                        {/* Target Prakiraan Maju */}
                                        <th className="border px-2 py-1 bg-yellow-50">Renja</th>
                                        <th className="border px-2 py-1 bg-yellow-50">RKA</th>
                                        
                                        {/* Dana Prakiraan Maju */}
                                        <th className="border px-2 py-1 bg-yellow-50">Renja</th>
                                        <th className="border px-2 py-1 bg-yellow-50">RKA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length === 0 ? (
                                        <tr>
                                            <td colSpan="20" className="border px-4 py-8 text-center text-gray-500">
                                                Belum ada data Formulir E.75 untuk tahun {selectedTahun}.
                                            </td>
                                        </tr>
                                    ) : (
                                        <>
                                            {/* Grand Total Row */}
                                            <tr className="bg-blue-200 text-gray-900 font-extrabold uppercase text-xs">
                                                <td className="border px-2 py-3 border-gray-400"></td>
                                                <td className="border px-2 py-3 border-gray-400 pl-2">TOTAL SELURUH PROGRAM</td>
                                                
                                                <td className="border px-2 py-3 border-gray-400"></td>
                                                <td className="border px-2 py-3 border-gray-400"></td>
                                                
                                                <td className="border px-2 py-3 border-gray-400"></td>
                                                <td className="border px-2 py-3 border-gray-400"></td>
                                                
                                                <td className="border px-2 py-3 border-gray-400"></td>
                                                <td className="border px-2 py-3 border-gray-400"></td>
                                                
                                                <td className="border px-2 py-3 border-gray-400 text-right">{formatRp(grandTotal.rencana_dana_renja)}</td>
                                                <td className="border px-2 py-3 border-gray-400 text-right">{formatRp(grandTotal.rencana_dana_rka)}</td>
                                                
                                                <td className="border px-2 py-3 border-gray-400"></td>
                                                <td className="border px-2 py-3 border-gray-400"></td>
                                                
                                                <td className="border px-2 py-3 border-gray-400 text-right">{formatRp(grandTotal.prakiraan_maju_dana_renja)}</td>
                                                <td className="border px-2 py-3 border-gray-400 text-right">{formatRp(grandTotal.prakiraan_maju_dana_rka)}</td>
                                                
                                                <td colSpan="6" className="border px-2 py-3 border-gray-400"></td>
                                            </tr>

                                            {groupedData.map((prog, progIndex) => (
                                                <React.Fragment key={`prog-${progIndex}`}>
                                                    {/* Program Row */}
                                                    <tr className="bg-gray-800 text-white font-bold text-xs">
                                                        <td className="border px-2 py-2 text-center border-gray-600">{prog.kode}</td>
                                                        <td className="border px-2 py-2 border-gray-600 uppercase pl-4">{prog.name}</td>
                                                        
                                                        <td className="border px-2 py-2 border-gray-600"></td>
                                                        <td className="border px-2 py-2 border-gray-600"></td>
                                                        
                                                        <td className="border px-2 py-2 border-gray-600"></td>
                                                        <td className="border px-2 py-2 border-gray-600"></td>
                                                        
                                                        <td className="border px-2 py-2 border-gray-600"></td>
                                                        <td className="border px-2 py-2 border-gray-600"></td>
                                                        
                                                        <td className="border px-2 py-2 border-gray-600 text-right">{formatRp(prog.totals.rencana_dana_renja)}</td>
                                                        <td className="border px-2 py-2 border-gray-600 text-right">{formatRp(prog.totals.rencana_dana_rka)}</td>
                                                        
                                                        <td className="border px-2 py-2 border-gray-600"></td>
                                                        <td className="border px-2 py-2 border-gray-600"></td>
                                                        
                                                        <td className="border px-2 py-2 border-gray-600 text-right">{formatRp(prog.totals.prakiraan_maju_dana_renja)}</td>
                                                        <td className="border px-2 py-2 border-gray-600 text-right">{formatRp(prog.totals.prakiraan_maju_dana_rka)}</td>
                                                        
                                                        <td colSpan="6" className="border px-2 py-2 border-gray-600 text-center"></td>
                                                    </tr>
                                                    
                                                    {prog.kegiatans.map((keg, kegIndex) => (
                                                    <React.Fragment key={`keg-${progIndex}-${kegIndex}`}>
                                                        {/* Kegiatan Row */}
                                                        <tr className="bg-gray-200 font-semibold text-gray-800 text-xs">
                                                            <td className="border px-2 py-2 text-center border-gray-300">{keg.kode}</td>
                                                            <td className="border px-2 py-2 border-gray-300 uppercase pl-6">{keg.name}</td>
                                                            
                                                            <td className="border px-2 py-2 border-gray-300"></td>
                                                            <td className="border px-2 py-2 border-gray-300"></td>
                                                            
                                                            <td className="border px-2 py-2 border-gray-300"></td>
                                                            <td className="border px-2 py-2 border-gray-300"></td>
                                                            
                                                            <td className="border px-2 py-2 border-gray-300"></td>
                                                            <td className="border px-2 py-2 border-gray-300"></td>
                                                            
                                                            <td className="border px-2 py-2 border-gray-300 text-right">{formatRp(keg.totals.rencana_dana_renja)}</td>
                                                            <td className="border px-2 py-2 border-gray-300 text-right">{formatRp(keg.totals.rencana_dana_rka)}</td>
                                                            
                                                            <td className="border px-2 py-2 border-gray-300"></td>
                                                            <td className="border px-2 py-2 border-gray-300"></td>
                                                            
                                                            <td className="border px-2 py-2 border-gray-300 text-right">{formatRp(keg.totals.prakiraan_maju_dana_renja)}</td>
                                                            <td className="border px-2 py-2 border-gray-300 text-right">{formatRp(keg.totals.prakiraan_maju_dana_rka)}</td>
                                                            
                                                            <td colSpan="6" className="border px-2 py-2 border-gray-300"></td>
                                                        </tr>
                                                        
                                                        {/* Sub Kegiatan Rows */}
                                                        {keg.rows.map((row, index) => (
                                                            <tr key={row.id} className="hover:bg-blue-50 bg-white text-xs align-top">
                                                                <td className="border px-2 py-2 text-center">{row.kode}</td>
                                                                <td className="border px-2 py-2 pl-10 text-gray-700">{row.sub_kegiatan}</td>
                                                                
                                                                <td className="border px-2 py-2 whitespace-pre-wrap break-words max-w-[100mm] min-w-[100mm]">{row.indikator_kinerja_renja}</td>
                                                                <td className="border px-2 py-2 whitespace-pre-wrap break-words max-w-[100mm] min-w-[100mm]">{row.indikator_kinerja_rka}</td>
                                                                
                                                                <td className="border px-2 py-2">{row.rencana_lokasi_renja}</td>
                                                                <td className="border px-2 py-2">{row.rencana_lokasi_rka}</td>
                                                                
                                                                <td className="border px-2 py-2">{row.rencana_target_renja}</td>
                                                                <td className="border px-2 py-2">{row.rencana_target_rka}</td>
                                                                
                                                                <td className="border px-2 py-2 text-right font-medium">{formatRp(row.rencana_dana_renja)}</td>
                                                                <td className="border px-2 py-2 text-right font-medium">{formatRp(row.rencana_dana_rka)}</td>
                                                                
                                                                <td className="border px-2 py-2">{row.prakiraan_maju_target_renja}</td>
                                                                <td className="border px-2 py-2">{row.prakiraan_maju_target_rka}</td>
                                                                
                                                                <td className="border px-2 py-2 text-right font-medium">{formatRp(row.prakiraan_maju_dana_renja)}</td>
                                                                <td className="border px-2 py-2 text-right font-medium">{formatRp(row.prakiraan_maju_dana_rka)}</td>
                                                                
                                                                <td className="border px-2 py-2 text-center font-bold text-green-600">
                                                                    {row.kesesuaian === 'Ya' ? '✓' : ''}
                                                                </td>
                                                                <td className="border px-2 py-2 text-center font-bold text-red-600">
                                                                    {row.kesesuaian === 'Tidak' ? '✓' : ''}
                                                                </td>
                                                                
                                                                <td className="border px-2 py-2">{row.evaluasi}</td>
                                                                <td className="border px-2 py-2">{row.tindak_lanjut}</td>
                                                                <td className="border px-2 py-2">{row.hasil_tindak_lanjut}</td>
                                                                
                                                                <td className="border px-2 py-2 text-center flex flex-col gap-2 items-center justify-center h-full print:hidden">
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
                            Panduan Import Excel (Formulir E.75)
                        </h3>
                        <div className="text-sm text-gray-600 space-y-3">
                            <p>Pembacaan data dimulai secara otomatis dari <strong>Baris ke-4 (Row 4)</strong>. Anda dapat menggunakan baris 1 s/d 3 untuk Header Tabel.</p>
                            <h4 className="font-semibold text-gray-800 mt-4 border-b pb-2">Susunan Kolom (Kiri ke Kanan)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 mt-2 bg-gray-50 p-4 rounded border">
                                <div><strong className="text-blue-600">Kolom A:</strong> Kode</div>
                                <div><strong className="text-blue-600">Kolom B:</strong> Program</div>
                                <div><strong className="text-blue-600">Kolom C:</strong> Kegiatan</div>
                                <div><strong className="text-blue-600">Kolom D:</strong> Sub Kegiatan</div>
                                <div><strong className="text-blue-600">Kolom E:</strong> Indikator Kinerja Renja</div>
                                <div><strong className="text-blue-600">Kolom F:</strong> Indikator Kinerja RKA</div>
                                <div><strong className="text-blue-600">Kolom G:</strong> Lokasi Renja</div>
                                <div><strong className="text-blue-600">Kolom H:</strong> Lokasi RKA</div>
                                <div><strong className="text-blue-600">Kolom I:</strong> Rencana Target Renja</div>
                                <div><strong className="text-blue-600">Kolom J:</strong> Rencana Target RKA</div>
                                <div><strong className="text-blue-600">Kolom K:</strong> Rencana Dana Renja (Angka)</div>
                                <div><strong className="text-blue-600">Kolom L:</strong> Rencana Dana RKA (Angka)</div>
                                <div><strong className="text-blue-600">Kolom M:</strong> Prakiraan Target Renja</div>
                                <div><strong className="text-blue-600">Kolom N:</strong> Prakiraan Target RKA</div>
                                <div><strong className="text-blue-600">Kolom O:</strong> Prakiraan Dana Renja (Angka)</div>
                                <div><strong className="text-blue-600">Kolom P:</strong> Prakiraan Dana RKA (Angka)</div>
                                <div><strong className="text-blue-600">Kolom Q:</strong> Kesesuaian (Ya/Tidak)</div>
                                <div><strong className="text-blue-600">Kolom R:</strong> Evaluasi Hasil Kesesuaian</div>
                                <div><strong className="text-blue-600">Kolom S:</strong> Tindak Lanjut</div>
                                <div><strong className="text-blue-600">Kolom T:</strong> Hasil Tindak Lanjut</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Import Excel */}
            <Modal show={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Import Data E.75 dari Excel</h2>
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

            {/* Modal Manual Input */}
            <Modal show={isInputModalOpen} onClose={() => setIsInputModalOpen(false)} maxWidth="4xl">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">{isEditing ? 'Ubah Data' : 'Tambah Data Manual'} E.75</h2>
                    <form onSubmit={submitInput} className="space-y-4 max-h-[70vh] overflow-y-auto px-1 pb-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Tahun" />
                                <TextInput type="number" className="mt-1 block w-full" value={inputData.tahun} onChange={e => setInputData('tahun', e.target.value)} required />
                            </div>
                            <div>
                                <InputLabel value="Kode" />
                                <TextInput type="text" className="mt-1 block w-full" value={inputData.kode} onChange={e => setInputData('kode', e.target.value)} />
                            </div>
                        </div>

                        <div className="border p-4 rounded bg-gray-50">
                            <h4 className="font-bold mb-3">Hierarki</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <InputLabel value="Program" />
                                    <TextInput type="text" className="mt-1 block w-full text-sm" value={inputData.program} onChange={e => setInputData('program', e.target.value)} />
                                </div>
                                <div>
                                    <InputLabel value="Kegiatan" />
                                    <TextInput type="text" className="mt-1 block w-full text-sm" value={inputData.kegiatan} onChange={e => setInputData('kegiatan', e.target.value)} />
                                </div>
                                <div>
                                    <InputLabel value="Sub Kegiatan" />
                                    <TextInput type="text" className="mt-1 block w-full text-sm" value={inputData.sub_kegiatan} onChange={e => setInputData('sub_kegiatan', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="border p-4 rounded bg-blue-50">
                            <h4 className="font-bold mb-3">Renja vs RKA</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <InputLabel value="Indikator Kinerja Renja" />
                                    <TextInput type="text" className="mt-1 block w-full text-sm" value={inputData.indikator_kinerja_renja} onChange={e => setInputData('indikator_kinerja_renja', e.target.value)} />
                                </div>
                                <div>
                                    <InputLabel value="Indikator Kinerja RKA" />
                                    <TextInput type="text" className="mt-1 block w-full text-sm" value={inputData.indikator_kinerja_rka} onChange={e => setInputData('indikator_kinerja_rka', e.target.value)} />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <InputLabel value="Lokasi Renja" />
                                    <TextInput type="text" className="mt-1 block w-full text-sm" value={inputData.rencana_lokasi_renja} onChange={e => setInputData('rencana_lokasi_renja', e.target.value)} />
                                </div>
                                <div>
                                    <InputLabel value="Lokasi RKA" />
                                    <TextInput type="text" className="mt-1 block w-full text-sm" value={inputData.rencana_lokasi_rka} onChange={e => setInputData('rencana_lokasi_rka', e.target.value)} />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                <div className="col-span-2">
                                    <InputLabel value="Rencana Target Renja" />
                                    <TextInput type="text" className="mt-1 block w-full text-sm" value={inputData.rencana_target_renja} onChange={e => setInputData('rencana_target_renja', e.target.value)} />
                                </div>
                                <div className="col-span-2">
                                    <InputLabel value="Rencana Dana Renja (Rp)" />
                                    <TextInput type="number" className="mt-1 block w-full text-sm" value={inputData.rencana_dana_renja} onChange={e => setInputData('rencana_dana_renja', e.target.value)} />
                                </div>
                                <div className="col-span-2">
                                    <InputLabel value="Rencana Target RKA" />
                                    <TextInput type="text" className="mt-1 block w-full text-sm" value={inputData.rencana_target_rka} onChange={e => setInputData('rencana_target_rka', e.target.value)} />
                                </div>
                                <div className="col-span-2">
                                    <InputLabel value="Rencana Dana RKA (Rp)" />
                                    <TextInput type="number" className="mt-1 block w-full text-sm" value={inputData.rencana_dana_rka} onChange={e => setInputData('rencana_dana_rka', e.target.value)} />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="col-span-2">
                                    <InputLabel value="Prakiraan Maju Target Renja" />
                                    <TextInput type="text" className="mt-1 block w-full text-sm" value={inputData.prakiraan_maju_target_renja} onChange={e => setInputData('prakiraan_maju_target_renja', e.target.value)} />
                                </div>
                                <div className="col-span-2">
                                    <InputLabel value="Prakiraan Maju Dana Renja (Rp)" />
                                    <TextInput type="number" className="mt-1 block w-full text-sm" value={inputData.prakiraan_maju_dana_renja} onChange={e => setInputData('prakiraan_maju_dana_renja', e.target.value)} />
                                </div>
                                <div className="col-span-2">
                                    <InputLabel value="Prakiraan Maju Target RKA" />
                                    <TextInput type="text" className="mt-1 block w-full text-sm" value={inputData.prakiraan_maju_target_rka} onChange={e => setInputData('prakiraan_maju_target_rka', e.target.value)} />
                                </div>
                                <div className="col-span-2">
                                    <InputLabel value="Prakiraan Maju Dana RKA (Rp)" />
                                    <TextInput type="number" className="mt-1 block w-full text-sm" value={inputData.prakiraan_maju_dana_rka} onChange={e => setInputData('prakiraan_maju_dana_rka', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="border p-4 rounded bg-red-50">
                            <h4 className="font-bold mb-3">Evaluasi & Tindak Lanjut</h4>
                            <div className="mb-4">
                                <InputLabel value="Kesesuaian" />
                                <select 
                                    className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                    value={inputData.kesesuaian}
                                    onChange={e => setInputData('kesesuaian', e.target.value)}
                                >
                                    <option value="">-- Pilih Kesesuaian --</option>
                                    <option value="Ya">Ya</option>
                                    <option value="Tidak">Tidak</option>
                                </select>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <InputLabel value="Evaluasi Hasil Kesesuaian" />
                                    <textarea className="mt-1 block w-full border-gray-300 rounded-md text-sm" rows="3" value={inputData.evaluasi} onChange={e => setInputData('evaluasi', e.target.value)}></textarea>
                                </div>
                                <div>
                                    <InputLabel value="Tindak Lanjut" />
                                    <textarea className="mt-1 block w-full border-gray-300 rounded-md text-sm" rows="3" value={inputData.tindak_lanjut} onChange={e => setInputData('tindak_lanjut', e.target.value)}></textarea>
                                </div>
                                <div>
                                    <InputLabel value="Hasil Tindak Lanjut" />
                                    <textarea className="mt-1 block w-full border-gray-300 rounded-md text-sm" rows="3" value={inputData.hasil_tindak_lanjut} onChange={e => setInputData('hasil_tindak_lanjut', e.target.value)}></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t">
                            <SecondaryButton type="button" onClick={() => setIsInputModalOpen(false)}>Batal</SecondaryButton>
                            <PrimaryButton type="submit" disabled={inputProcessing}>Simpan</PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
