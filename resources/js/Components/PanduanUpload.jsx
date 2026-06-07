import React from 'react';

export default function PanduanUpload() {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-12 shadow-sm">
            <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
                <span className="text-xl mr-2">📖</span> Panduan Upload Dokumen
            </h3>
            <div className="text-sm text-blue-900 space-y-2">
                <p>Ikuti langkah-langkah berikut untuk mengunggah dokumen dengan benar:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Pilih <strong>Tahun</strong> yang sesuai dengan dokumen yang ingin Anda unggah pada form di atas.</li>
                    <li>Klik <strong>Pilih File</strong> dan cari file dokumen di komputer Anda.</li>
                    <li>Pastikan format file yang diunggah adalah <strong>PDF (.pdf)</strong>.</li>
                    <li>Pastikan file PDF yang diunggah <strong className="text-red-600">sudah ditandatangani oleh Kepala Dinas/OPD</strong> terkait.</li>
                    <li>Pastikan ukuran file tidak melebihi batas maksimal yaitu <strong>10 MB</strong>.</li>
                    <li>Klik tombol <strong>Upload Dokumen</strong> untuk mulai mengunggah.</li>
                </ol>
                <p className="mt-4 text-xs text-blue-700 bg-blue-100 p-2 rounded inline-block">
                    <strong>Catatan:</strong> Dokumen yang sudah berhasil diunggah akan tampil di dalam tabel dan dapat Anda <strong>Lihat</strong>, <strong>Unduh</strong>, atau <strong>Hapus</strong> jika terjadi kesalahan (sesuai dengan hak akses Anda).
                </p>
            </div>
        </div>
    );
}
