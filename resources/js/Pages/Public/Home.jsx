import PublicLayout from '@/Layouts/PublicLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import FloatingAiWidget from '@/Components/FloatingAiWidget';

export default function Home({ statistik }) {
    const slides = [
        "/images/home_slide_1.jpg",
        "/images/home_slide_2.jpg",
        "/images/home_slide_3.jpg"
    ];
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };
    const { data, setData, post, processing, reset, errors } = useForm({
        nama: '',
        email: '',
        pesan: ''
    });

    const submitFeedback = (e) => {
        e.preventDefault();
        post(route('feedback.store'), {
            onSuccess: () => {
                reset();
                alert('Terima kasih! Pesan Anda telah kami terima.');
            }
        });
    };

    return (
        <PublicLayout>
            <Head title="Beranda E-SAKIP" />
            
            {/* Hero Banner Area */}
            <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden bg-blue-900 group">
                {/* Slide Image */}
                {slides.map((slide, index) => (
                    <img 
                        key={index}
                        src={slide} 
                        alt={`Slide Kegiatan ${index + 1}`} 
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`} 
                    />
                ))}
                
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-black/10"></div>

                {/* Slider arrows */}
                <div onClick={prevSlide} className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer text-white/70 hover:text-white transition hidden md:block bg-black/30 hover:bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </div>
                <div onClick={nextSlide} className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer text-white/70 hover:text-white transition hidden md:block bg-black/30 hover:bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
                

                {/* Dots indicator */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                    {slides.map((_, index) => (
                        <button 
                            key={index} 
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50 hover:bg-white/80'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* White Title Band */}
            <div className="bg-white py-8 border-b shadow-sm">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-normal text-slate-700 mb-4 md:mb-0" style={{ fontFamily: "'Alex Brush', cursive" }}>
                        Sistem Akuntabilitas Kinerja Instansi Pemerintah
                    </h1>
                    <a href="#kategori" className="border border-slate-700 text-slate-700 hover:bg-slate-700 hover:text-white px-6 py-2 rounded-full font-medium transition duration-300 flex items-center whitespace-nowrap">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        Selengkapnya
                    </a>
                </div>
            </div>
            {/* Statistik Ringkasan */}
            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                        {/* Stat 1 */}
                        <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-100 w-full md:w-1/4">
                            <div className="text-4xl font-bold text-slate-800 mb-2">{statistik?.total_opd || 0}</div>
                            <div className="text-gray-500 font-semibold uppercase text-xs tracking-wider">Perangkat Daerah</div>
                        </div>
                        {/* Stat 2 */}
                        <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-100 w-full md:w-1/4">
                            <div className="text-4xl font-bold text-slate-800 mb-2">{statistik?.total_indikator || 0}</div>
                            <div className="text-gray-500 font-semibold uppercase text-xs tracking-wider">Indikator Kinerja</div>
                        </div>
                        {/* Stat 3 */}
                        <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-100 w-full md:w-1/4">
                            <div className="text-4xl font-bold text-green-500 mb-2">{statistik?.capaian_rata_rata || 0}%</div>
                            <div className="text-gray-500 font-semibold uppercase text-xs tracking-wider">Rata-rata Capaian</div>
                        </div>
                        {/* Stat 4 */}
                        <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-100 w-full md:w-1/4">
                            <div className="text-4xl font-bold text-purple-500 mb-2">{statistik?.total_dokumen || 0}</div>
                            <div className="text-gray-500 font-semibold uppercase text-xs tracking-wider">Dokumen SAKIP</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Modern Kategori SAKIP */}
            <div id="kategori" className="bg-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-slate-800 mb-12 relative inline-block">
                        Kategori Informasi Publik
                        <span className="absolute bottom-0 left-1/4 w-1/2 h-1 bg-blue-500 -mb-4"></span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {['Perencanaan Kinerja', 'Monitoring Capaian', 'Pelaporan Kinerja', 'Evaluasi Kinerja'].map((item, idx) => {
                            const isMonitoring = item === 'Monitoring Capaian';
                            const isPerencanaan = item === 'Perencanaan Kinerja';
                            const isPelaporan = item === 'Pelaporan Kinerja';
                            const isEvaluasi = item === 'Evaluasi Kinerja';
                            const Wrapper = (isMonitoring || isPerencanaan || isPelaporan || isEvaluasi) ? Link : 'div';
                            const props = isMonitoring ? { href: route('publik.capaian') } : (isPerencanaan ? { href: route('publik.perencanaan') } : (isPelaporan ? { href: route('publik.pelaporan') } : (isEvaluasi ? { href: route('publik.evaluasi') } : {})));

                            return (
                                <Wrapper key={idx} {...props} className="block bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100 group cursor-pointer relative overflow-hidden text-left">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                                    <div className="w-16 h-16 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition shadow-inner">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-700 mb-3 text-center">{item}</h3>
                                    <p className="text-gray-500 text-sm text-center">Lihat detail dokumen dan pencapaian terkait {item.toLowerCase()} Perangkat Daerah.</p>
                                </Wrapper>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Form Feedback */}
            <div className="bg-gray-50 py-16 border-t border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row border border-gray-100">
                        <div className="bg-slate-800 text-white p-8 md:w-2/5 flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 z-0"></div>
                            <div className="relative z-10">
                                <img src="/images/logo_sungai_penuh.png" alt="Logo Kota Sungai Penuh" className="h-20 w-auto mb-4" />
                                <h3 className="text-2xl font-bold mb-4">Kirim Masukan</h3>
                                <p className="opacity-80 mb-6 text-sm">Kami menghargai partisipasi publik untuk evaluasi dan perbaikan kinerja Pemerintah Kota Sungai Penuh.</p>
                                <div className="flex items-center space-x-3 opacity-90 text-sm">
                                    <span>📧</span> <span>esakip@sungaipenuh.go.id</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 md:w-3/5">
                            <form onSubmit={submitFeedback} className="space-y-4">
                                <div>
                                    <label className="block text-slate-700 text-sm font-semibold mb-2">Nama Lengkap</label>
                                    <input type="text" value={data.nama} onChange={e => setData('nama', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" required />
                                    {errors.nama && <div className="text-red-500 text-xs mt-1">{errors.nama}</div>}
                                </div>
                                <div>
                                    <label className="block text-slate-700 text-sm font-semibold mb-2">Email</label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" required />
                                    {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                                </div>
                                <div>
                                    <label className="block text-slate-700 text-sm font-semibold mb-2">Pesan & Masukan</label>
                                    <textarea value={data.pesan} onChange={e => setData('pesan', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition h-28" required></textarea>
                                    {errors.pesan && <div className="text-red-500 text-xs mt-1">{errors.pesan}</div>}
                                </div>
                                <button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded shadow transition">
                                    {processing ? 'Mengirim...' : 'Kirim Pesan'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* AI Widget */}
            <FloatingAiWidget />
        </PublicLayout>
    );
}
