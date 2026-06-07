import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';

export default function PrintRencanaAksi({ rencana_aksis, opd_name }) {
    useEffect(() => {
        window.print();
    }, []);

    return (
        <div className="bg-white text-black p-8" style={{ fontFamily: 'Times New Roman, serif' }}>
            <Head title="Cetak Rencana Aksi" />
            
            <div className="flex items-center justify-center gap-6 mb-8 border-b-4 border-black pb-4">
                <img src="/images/logo_sungai_penuh.png" alt="Logo Sungai Penuh" className="w-20 h-auto" />
                <div className="text-center font-bold">
                    <h1 className="text-xl uppercase">RENCANA AKSI</h1>
                    <h2 className="text-lg uppercase">{opd_name} TAHUN ANGGARAN {new Date().getFullYear()}</h2>
                </div>
                <div className="w-20"></div> {/* Spacer for centering */}
            </div>

            <table className="w-full border-collapse border border-black text-sm">
                <thead>
                    <tr>
                        <th className="border border-black p-2" rowSpan="2">Nomor</th>
                        <th className="border border-black p-2" rowSpan="2">Sasaran (Strategis/ Program/ Kegiatan*)</th>
                        <th className="border border-black p-2" rowSpan="2">Indikator Kinerja (Program/kegiatan)*</th>
                        <th className="border border-black p-2" colSpan="4">Target Kinerja</th>
                        <th className="border border-black p-2" rowSpan="2">Aktifitas yang direncanakan dilakukan untuk mencapai Target Kinerja</th>
                        <th className="border border-black p-2" rowSpan="2">Penanggung Jawab</th>
                        <th className="border border-black p-2">Anggaran</th>
                    </tr>
                    <tr>
                        <th className="border border-black p-2">TW 1</th>
                        <th className="border border-black p-2">TW 2</th>
                        <th className="border border-black p-2">TW 3</th>
                        <th className="border border-black p-2">TW 4</th>
                        <th className="border border-black p-2">(Rp.)</th>
                    </tr>
                </thead>
                <tbody>
                    {rencana_aksis && rencana_aksis.length > 0 ? (
                        rencana_aksis.map((item, index) => (
                            <tr key={index}>
                                <td className="border border-black p-2 text-center">{index + 1}</td>
                                <td className="border border-black p-2">{item.sasaran}</td>
                                <td className="border border-black p-2">{item.indikator_kinerja}</td>
                                <td className="border border-black p-2 text-center">{item.tw_1}</td>
                                <td className="border border-black p-2 text-center">{item.tw_2}</td>
                                <td className="border border-black p-2 text-center">{item.tw_3}</td>
                                <td className="border border-black p-2 text-center">{item.tw_4}</td>
                                <td className="border border-black p-2">{item.aktifitas}</td>
                                <td className="border border-black p-2">{item.penanggung_jawab}</td>
                                <td className="border border-black p-2 text-right">{item.anggaran}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10" className="border border-black p-4 text-center italic">Belum ada data</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
