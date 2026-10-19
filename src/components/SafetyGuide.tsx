import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  CheckCircle,
  Compass,
  AlertOctagon,
  Search,
  MessageCircle,
} from 'lucide-react';

interface SafetyGuideProps {
  onStartChecking: () => void;
  onOpenChat: () => void;
}

export const SafetyGuide: React.FC<SafetyGuideProps> = ({
  onStartChecking,
  onOpenChat,
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Hero Guide Card */}
      <div className="bg-linear-to-r from-indigo-700 via-indigo-600 to-sky-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white mb-3">
            <Compass className="w-3.5 h-3.5" />
            Buku Panduan Detektif Remaja
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Rumus 3T: Tahan, Teliti, Tanya!
          </h2>
          <p className="text-indigo-100 text-xs sm:text-sm mt-2 leading-relaxed">
            Di media sosial, jari kita sering lebih cepat daripada pikiran kita. Sebelum menekan tombol 'Forward' atau 'Share' ke grup kelas atau teman bermainmu, gunakan rumus 3T ini:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
              <span className="text-xl font-black">1. ✋ Tahan</span>
              <p className="text-xs text-indigo-100 mt-1">Jangan langsung percaya apalagi buru-buru menyebarkan pesan yang memicu emosi.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
              <span className="text-xl font-black">2. 🔍 Teliti</span>
              <p className="text-xs text-indigo-100 mt-1">Gunakan Detektif Share untuk cek link, tanggal, dan kejanggalan bahasanya.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
              <span className="text-xl font-black">3. 💬 Tanya</span>
              <p className="text-xs text-indigo-100 mt-1">Tanya Guru BK, Orang Tua, atau Detektif AI jika ada yang aneh atau menakutkan.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Category Explanation */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>🏷️ Memahami 4 Kategori Hasil Detektif Share</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-2xs space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-950">Aman Berdasarkan Pemeriksaan</h4>
                <span className="text-[11px] font-semibold text-emerald-700">Risiko Rendah</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Konten tidak memuat ciri mencurigakan seperti pancingan link aneh, iming-iming uang, atau kata-kata kasar. Namun tetap ingat: AI bukan penjamin mutlak; selalu gunakan akal sehatmu.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-2xs space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-950">Perlu Diperiksa Lebih Lanjut</h4>
                <span className="text-[11px] font-semibold text-amber-700">Bukti Belum Cukup</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pesan belum tentu jahat, namun bukti yang ada belum cukup kuat untuk memastikannya. Sebaiknya tanyakan kepada pihak sekolah resmi atau jangan disebarkan terlebih dahulu.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-2xl bg-white border border-orange-200 shadow-2xs space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-100 text-orange-700">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-orange-950">Berisiko</h4>
                <span className="text-[11px] font-semibold text-orange-700">Tanda Bahaya Terdeteksi</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ditemukan ciri kuat penipuan (phishing), hoaks viral yang meresahkan, atau pesan berantai berkedok hadiah. DILARANG meneruskan (forward) pesan ini ke orang lain!
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-2xl bg-white border border-rose-300 shadow-2xs space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-rose-950">Bahaya Serius</h4>
                <span className="text-[11px] font-semibold text-rose-700">Darurat / Membahayakan</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mengandung unsur cyberbullying berat, pemerasan (misal minta uang/foto pribadi), ancaman kekerasan fisik, atau ajakan tawuran. Segera simpan bukti dan lapor ke Guru BK atau Orang Tua!
            </p>
          </div>

        </div>
      </div>

      {/* Top 4 Scams Junior High Students Must Beware */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          ⚠️ 4 Jebakan Digital yang Paling Sering Menyerang Anak SMP
        </h3>

        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <p className="font-bold text-slate-800">1. Hoaks Kuota / Diamond Game Gratis</p>
            <p className="text-slate-600 mt-1">
              "Klik link ini untuk dapat 50GB kuota belajar atau 1000 Diamond Free Fire/Mobile Legends gratis". Kenyataannya: link tersebut mencuri nomor HP dan akun medsosmu!
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <p className="font-bold text-slate-800">2. Akun Bodong Mengaku Teman atau Guru</p>
            <p className="text-slate-600 mt-1">
              Ada akun baru pakai foto profil teman sekelas atau guru, tiba-tiba minta tolong transfer pulsa atau minta kirimkan kode OTP 6 angka. Jangan pernah berikan kode OTP kepada siapapun!
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <p className="font-bold text-slate-800">3. Grup "No Guru" Berisi Doxxing &amp; Gosip Jahat</p>
            <p className="text-slate-600 mt-1">
              Menyebarkan foto aib teman sekelas, nomor HP orang tuanya, atau menghina bentuk tubuh di grup WA tanpa guru termasuk tindak Cyberbullying dan melanggar hukum (UU ITE).
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <p className="font-bold text-slate-800">4. Broadcast Hoaks Bencana / Libur Sekolah</p>
            <p className="text-slate-600 mt-1">
              Informasi libur sekolah atau jadwal ujian yang valid HANYA berasal dari wali kelas, surat resmi bertanda tangan kepala sekolah, atau pengumuman resmi sekolah.
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onStartChecking}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Mulai Periksa Konten Sekarang</span>
          </button>
          <button
            onClick={onOpenChat}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Konsultasi ke Detektif AI</span>
          </button>
        </div>
      </div>

    </div>
  );
};
