import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function PublicLayout({ children }) {
    const { url } = usePage();
    const isHome = url === '/';
    
    const [scrolled, setScrolled] = useState(false);
    const [infoPublikOpen, setInfoPublikOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navbarBg = isHome 
        ? (scrolled ? 'bg-blue-800/95 backdrop-blur-md shadow-md' : 'bg-transparent')
        : 'bg-blue-800 shadow-md';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
            {/* Header & Navbar */}
            <header className={`fixed w-full z-50 transition-all duration-300 ${navbarBg} text-white`}>
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <Link href="/" className="flex items-center cursor-pointer">
                            <img src="/images/logo_sakip_sungai_penuh.png" alt="SAKIP Kota Sungai Penuh" className="h-20 w-auto object-contain py-1" />
                        </Link>
                    </div>
                    
                    <nav className="hidden md:block">
                        <ul className="flex space-x-8 items-center font-medium text-sm">
                            <li><Link href="/" className="hover:text-blue-200 transition">Beranda</Link></li>
                            <li><Link href={route('publik.peraturan')} className="hover:text-blue-200 transition font-bold">Peraturan</Link></li>
                            <li className="relative cursor-pointer">
                                <div 
                                    className="hover:text-blue-200 flex items-center transition py-2 font-bold"
                                    onClick={() => setInfoPublikOpen(!infoPublikOpen)}
                                >
                                    Informasi Publik <span className="ml-1 text-xs">▼</span>
                                </div>
                                <div className={`absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100 transition duration-150 ease-in-out origin-top-left transform ${infoPublikOpen ? 'scale-100 opacity-100 block' : 'scale-95 opacity-0 hidden'}`}>
                                    <Link href={route('publik.perencanaan')} className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition">Perencanaan Kinerja</Link>
                                    <Link href={route('publik.capaian')} className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition">Pengukuran dan Capaian Kinerja</Link>
                                    <Link href={route('publik.pelaporan')} className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition">Pelaporan Kinerja</Link>
                                    <Link href={route('publik.evaluasi')} className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition">Evaluasi Kinerja</Link>
                                </div>
                            </li>
                        </ul>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <Link href={route('login')} className="bg-transparent border border-white hover:bg-white hover:text-blue-800 px-5 py-2 rounded font-semibold text-sm transition flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                            Masuk
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className={`flex-grow ${!isHome ? 'pt-20' : ''}`}>
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 mt-10">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <div className="mb-4">
                            <img src="/images/logo-sakip-kontak.png" alt="SAKIP Kota Sungai Penuh" className="h-20 w-auto object-contain" />
                        </div>
                        <p className="mt-2 text-sm">Sistem Akuntabilitas Kinerja Instansi Pemerintah terintegrasi untuk mewujudkan tata kelola birokrasi yang transparan.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">Kontak Kami</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-start">
                                <span className="mr-2">📍</span> Setda Kota Sungai Penuh, Provinsi Jambi
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2">📧</span> esakip@sungaipenuh.go.id
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2">📞</span> (0748) 123456
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">Misi Pembangunan</h3>
                        <p className="text-sm leading-relaxed">Mewujudkan Kota Sungai Penuh Maju, Adil, Sejahtera (JUARA) melalui tata kelola birokrasi yang akuntabel dan pelayanan publik yang prima.</p>
                    </div>
                </div>
                <div className="container mx-auto px-4 text-center text-sm border-t border-slate-700 mt-8 pt-6">
                    &copy; {new Date().getFullYear()} Bag.Or SETDA Pemerintah Kota Sungai Penuh. All Rights Reserved.
                </div>
            </footer>
        </div>
    );
}
