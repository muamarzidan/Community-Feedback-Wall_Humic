import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function TermsConditions() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [accepted, setAccepted] = useState(false);
    const returnTo = searchParams.get('returnTo');

    useEffect(() => {
        if (!returnTo || (returnTo !== 'register' && returnTo !== 'modal')) {
            navigate('/', { replace: true });
        }
    }, [returnTo, navigate]);

    const handleAccept = () => {
        if (returnTo === 'register') {
            navigate('/register?termsAccepted=true');
        } else if (returnTo === 'modal') {
            // Flag terms accepted untuk AuthModal
            sessionStorage.setItem('authmodal_terms_accepted', 'true');
            // Dispatch event untuk AuthModal
            window.dispatchEvent(new CustomEvent('termsAccepted', { detail: { accepted: true } }));
            navigate('/');
            // Trigger modal to open setelah navigate
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { mode: 'register' } }));
            }, 100);
        } else {
            navigate('/');
        }
    };

    return (
        <>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #E5E7EB;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #3B82F6;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #2563EB;
                }
            `}</style>
            <div className="px-4 py-4 min-h-dvh sm:py-6 bg-gray-50">
                <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl">
                    {/* Header */}
                    <div className="sticky top-0 px-6 py-4 bg-white border-b border-gray-200 sm:py-6 rounded-t-2xl sm:px-8">
                        <h1 className="text-xl font-bold text-center text-gray-900 sm:text-2xl xl:text-3xl">
                            Syarat & Ketentuan serta Kebijakan Privasi
                        </h1>
                        <p className="mt-2 text-sm text-center text-gray-500">
                            Terakhir diperbarui: 16 Februari 2026
                        </p>
                    </div>
                    {/* Content - Scrollable */}
                    <div className="px-6 py-6 sm:px-8 max-h-[60vh] overflow-y-auto custom-scrollbar" 
                        style={{
                            scrollbarColor: '#3B82F6 #E5E7EB'
                        }}>
                        <div className="space-y-6 text-gray-700">
                            {/* Syarat dan Ketentuan */}
                            <section>
                                <h2 className="mb-4 text-xl font-bold text-gray-900">Syarat dan Ketentuan</h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="mb-2 font-semibold text-gray-900">1. Ketentuan Umum</h3>
                                        <p className="text-sm leading-relaxed">
                                            Community Feedback Wall adalah platform berbasis website dan aplikasi mobile yang menyediakan ruang bagi komunitas untuk menyampaikan dan 
                                            mengelola umpan balik secara terpusat.
                                        </p>
                                        <p className="mt-2 text-sm leading-relaxed">
                                            Dengan mengakses atau menggunakan layanan ini, pengguna dianggap telah membaca, memahami, dan menyetujui seluruh ketentuan yang berlaku.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="mb-2 font-semibold text-gray-900">2. Akun dan Autentikasi</h3>
                                        <ul className="ml-4 space-y-1 text-sm list-disc list-inside">
                                            <li>Pengguna terdaftar wajib memberikan informasi yang benar dan akurat saat proses pendaftaran.</li>
                                            <li>Pengguna bertanggung jawab atas keamanan akun dan kredensial login masing-masing.</li>
                                            <li>Pengguna tidak diperkenankan membagikan akun kepada pihak lain.</li>
                                            <li>Platform berhak menangguhkan atau menghapus akun apabila ditemukan pelanggaran terhadap ketentuan layanan.</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="mb-2 font-semibold text-gray-900">3. Hak dan Tanggung Jawab Pengguna</h3>
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">3.1 Pengguna Terdaftar</p>
                                            <ul className="ml-4 space-y-1 text-sm list-disc list-inside">
                                                <li>Pengguna terdaftar wajib memberikan informasi yang benar dan akurat saat proses pendaftaran.</li>
                                                <li>Pengguna bertanggung jawab atas keamanan akun dan kredensial login masing-masing.</li>
                                                <li>Pengguna tidak diperkenankan membagikan akun kepada pihak lain.</li>
                                                <li>Platform berhak menangguhkan atau menghapus akun apabila ditemukan pelanggaran terhadap ketentuan layanan.</li>
                                            </ul>
                                            
                                            <p className="mt-3 text-sm font-medium">3.2 Mode Tamu (Guest Mode)</p>
                                            <ul className="ml-4 space-y-1 text-sm list-disc list-inside">
                                                <li>Pengguna dalam mode tamu dapat memberikan kontribusi anonim dengan batasan tertentu.</li>
                                                <li>Platform tidak menjamin penyimpanan atau pemulihan data yang dikirim melalui mode tamu.</li>
                                            </ul>
                                            
                                            <p className="mt-3 text-sm font-medium">3.3 Tanggung Jawab Konten</p>
                                            <ul className="ml-4 space-y-1 text-sm list-disc list-inside">
                                                <li>Pengguna bertanggung jawab penuh atas isi feedback yang dikirimkan.</li>
                                                <li>Dilarang mengunggah konten yang mengandung ujaran kebencian, spam, pornografi, pelanggaran hak cipta, atau konten yang melanggar hukum.</li>
                                                <li>Pengguna bertanggung jawab atas keamanan akun dan kredensial login masing-masing.</li>
                                                <li>Pengguna tidak diperkenankan membagikan akun kepada pihak lain.</li>
                                                <li>Platform berhak menangguhkan atau menghapus akun apabila ditemukan pelanggaran terhadap ketentuan layanan.</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="mb-2 font-semibold text-gray-900">4. Moderasi dan Administrasi</h3>
                                        <ul className="ml-4 space-y-1 text-sm list-disc list-inside">
                                            <li>Administrator memiliki hak untuk melakukan moderasi dan menyunting atau menghapus konten yang melanggar kebijakan.</li>
                                            <li>Administrator dapat menghapus, menyunting, atau memberikan akses terhadap konten yang dianggap melanggar ketentuan.</li>
                                            <li>Pengguna dapat melaporkan konten yang dianggap tidak sesuai dalam format CSV atau PDF untuk analisis internal.</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="mb-2 font-semibold text-gray-900">5. Batasan Tanggung Jawab</h3>
                                        <ul className="ml-4 space-y-1 text-sm list-disc list-inside">
                                            <li>Platform disediakan sebagaimana adanya (as is). Pengguna tidak bertanggung jawab atas:</li>
                                            <li>Konten akibat kesalahan pengguna atau outage sistem.</li>
                                            <li>Gangguan teknis atau kehilangan data akibat faktor di luar kendali pengelola.</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="mb-2 font-semibold text-gray-900">6. Perubahan Ketentuan</h3>
                                        <p className="text-sm leading-relaxed">
                                            Ketentuan ini dapat diperbarui sewaktu-waktu. Pengguna disarankan untuk meninjau halaman Terms secara berkala untuk tetap mendapatkan 
                                            informasi terkini mengenai kebijakan kami.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Kebijakan Privasi */}
                            <section className="pt-6 mt-6 border-t border-gray-200">
                                <h2 className="mb-4 text-xl font-bold text-gray-900">Kebijakan Privasi</h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="mb-2 font-semibold text-gray-900">1. Informasi yang Dikumpulkan</h3>
                                        <p className="text-sm leading-relaxed">
                                            Kami mengumpulkan data akun (nama, email), isi feedback yang Anda kirimkan, interaksi antar pengguna, serta metadata teknis (IP, jenis perangkat) 
                                            untuk tujuan keamanan.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="mb-2 font-semibold text-gray-900">2. Penggunaan Data</h3>
                                        <ul className="ml-4 space-y-1 text-sm list-disc list-inside">
                                            <li>Mengelola autentikasi dan fungsionalitas akun.</li>
                                            <li>Menjaga keamanan dan memoderasi konten platform.</li>
                                            <li>Kebutuhan analisis internal untuk pengembangan sistem.</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="mb-2 font-semibold text-gray-900">3. Keamanan & Hak Anda</h3>
                                        <p className="text-sm leading-relaxed">
                                            Data disimpan dengan enkripsi standar. Anda memiliki hak untuk memperbarui informasi profil, menghapus feedback milik sendiri, atau mengajukan 
                                            penghapusan akun.
                                        </p>
                                        <p className="mt-2 text-sm leading-relaxed">
                                            Feedback mode tamu bersifat anonim, namun metadata teknis tetap dicatat demi mencegah penyalahgunaan sistem (spam).
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="mb-2 font-semibold text-gray-900">4. Perubahan Kebijakan</h3>
                                        <p className="text-sm leading-relaxed">
                                            Kebijakan ini dapat diperbarui sewaktu-waktu. Perubahan signifikan akan diinformasikan melalui notifikasi di platform.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                    {/* Footer - Sticky */}
                    <div className="sticky bottom-0 px-6 py-6 bg-white border-t border-gray-200 rounded-b-2xl sm:px-8">
                        <div className="flex items-start gap-3 mb-4">
                            <input 
                                type="checkbox" 
                                id="acceptTerms"
                                checked={accepted}
                                onChange={(e) => setAccepted(e.target.checked)}
                                className="w-4 h-4 mt-1 cursor-pointer accent-blue-600" 
                            />
                            <label htmlFor="acceptTerms" className="text-sm font-medium text-gray-900 cursor-pointer">
                                Saya telah membaca dan menyetujui Syarat & Ketentuan serta Kebijakan Privasi.
                            </label>
                        </div>
                        <div className="flex items-center justify-end w-full">                        
                            <button
                                onClick={handleAccept}
                                disabled={!accepted}
                                className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-full cursor-pointer sm:px-6 sm:py-3 sm:text-base bg-primary-500 w-fit hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Terima & Lanjutkan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
