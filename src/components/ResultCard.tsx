import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  HelpCircle,
  CheckCircle,
  Copy,
  Check,
  Share2,
  MessageCircle,
  PhoneCall,
  Info,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { AnalysisResult, RiskCategory } from '../types';

interface ResultCardProps {
  result: AnalysisResult;
  onAskDetective: (result: AnalysisResult) => void;
  onOpenHelp: () => void;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  onAskDetective,
  onOpenHelp,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [showOverrideShare, setShowOverrideShare] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Category Configuration
  const categoryConfig: Record<
    RiskCategory,
    {
      badgeBg: string;
      badgeText: string;
      badgeBorder: string;
      cardBorder: string;
      icon: React.ReactNode;
      label: string;
      levelDescription: string;
      isHighRisk: boolean;
    }
  > = {
    'Aman Berdasarkan Pemeriksaan': {
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-900',
      badgeBorder: 'border-emerald-300',
      cardBorder: 'border-emerald-200 shadow-emerald-100/50',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      label: 'Aman Berdasarkan Pemeriksaan',
      levelDescription: 'Tidak ditemukan tanda-tanda berbahaya yang mencolok dari informasi yang diberikan.',
      isHighRisk: false,
    },
    'Perlu Diperiksa Lebih Lanjut': {
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-900',
      badgeBorder: 'border-amber-300',
      cardBorder: 'border-amber-200 shadow-amber-100/50',
      icon: <HelpCircle className="w-6 h-6 text-amber-600" />,
      label: 'Perlu Diperiksa Lebih Lanjut',
      levelDescription: 'Bukti belum cukup kuat untuk memastikan. Dibutuhkan konfirmasi dari sumber resmi atau pihak sekolah.',
      isHighRisk: false,
    },
    'Berisiko': {
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-950',
      badgeBorder: 'border-orange-300',
      cardBorder: 'border-orange-200 shadow-orange-100/50',
      icon: <AlertTriangle className="w-6 h-6 text-orange-600" />,
      label: 'Berisiko',
      levelDescription: 'Terindikasi adanya upaya penipuan, hoaks, pancingan akun (phishing), atau potensi perselisihan.',
      isHighRisk: true,
    },
    'Bahaya Serius': {
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-950',
      badgeBorder: 'border-rose-400',
      cardBorder: 'border-rose-300 shadow-rose-200/60 ring-2 ring-rose-200',
      icon: <AlertOctagon className="w-6 h-6 text-rose-600 animate-bounce" />,
      label: 'Bahaya Serius',
      levelDescription: 'Mengandung ancaman nyata, perundungan siber (cyberbullying) berat, pelecehan, atau pemerasan yang membahayakan!',
      isHighRisk: true,
    },
  };

  const config = categoryConfig[result.kategori_risiko] || categoryConfig['Perlu Diperiksa Lebih Lanjut'];

  // Format summary text for copy/sharing
  const formattedShareText = `🔍 [Hasil Pemeriksaan Detektif Share]
Kategori: ${result.kategori_risiko}
Temuan: ${result.judul_temuan}

💡 Ringkasan:
${result.ringkasan}

⚠️ Verifikasi Fakta:
${result.status_verifikasi_kebenaran}

📋 Saran Tindakan:
${result.saran_tindakan.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Catatan: Analisis AI edukasi untuk siswa SMP. Periksa Sebelum Berbagi!`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedShareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Copy failed', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Detektif Share: ${result.kategori_risiko}`,
          text: formattedShareText,
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2500);
      } catch (err) {
        // User aborted share or not supported
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className={`bg-white rounded-3xl p-5 sm:p-8 border shadow-lg transition-all ${config.cardBorder}`}>
      
      {/* Emergency Banner if Serious Hazard */}
      {result.deteksi_bahaya_khusus?.adalah_bahaya_serius && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-600 text-white shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <p className="font-extrabold text-sm sm:text-base text-rose-950">
                Peringatan Darurat: {result.deteksi_bahaya_khusus.jenis_bahaya || 'Konten Berbahaya'}
              </p>
              <p className="text-xs sm:text-sm text-rose-800 mt-0.5">
                {result.deteksi_bahaya_khusus.pesan_darurat || 'Jangan hadapi sendiri! Segera ceritakan kepada Guru BK atau Orang Tuamu.'}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenHelp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-colors shrink-0"
          >
            <PhoneCall className="w-4 h-4" />
            Hubungi Guru / Orang Tua
          </button>
        </div>
      )}

      {/* Header Result Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className={`w-13 h-13 rounded-2xl flex items-center justify-center border shadow-xs ${config.badgeBg} ${config.badgeBorder}`}>
            {config.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold border ${config.badgeBg} ${config.badgeText} ${config.badgeBorder}`}>
                {config.label}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                Skor Risiko: {result.skor_risiko}/10
              </span>
              <span className="text-xs font-medium text-slate-400">
                • {result.tingkat_keyakinan}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
              {result.judul_temuan}
            </h3>
          </div>
        </div>

        {/* Recheck / Reset button */}
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Periksa Konten Lain
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="py-6 space-y-6">
        
        {/* Ringkasan & Deskripsi */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>📋 Ringkasan Analisis Detektif:</span>
          </h4>
          <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
            {result.ringkasan}
          </p>
          <p className="text-xs text-slate-500 mt-2 italic">
            {config.levelDescription}
          </p>
        </div>

        {/* Separate Section: Verifikasi Kebenaran Fakta vs Penilaian Risiko */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: Verifikasi Kebenaran Informasi */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/70">
            <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span>🔍 Status Verifikasi Kebenaran:</span>
            </h4>
            <p className="text-xs sm:text-sm text-sky-950 font-medium leading-normal">
              {result.status_verifikasi_kebenaran}
            </p>
          </div>

          {/* Card 2: Bagian yang Belum Pasti */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Bagian yang Belum Dapat Dipastikan:</span>
            </h4>
            <p className="text-xs sm:text-sm text-amber-950 font-medium leading-normal">
              {result.bagian_belum_pasti}
            </p>
          </div>

        </div>

        {/* Indikator / Bukti yang Ditemukan */}
        {result.alasan_indikator && result.alasan_indikator.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              🎯 Indikator &amp; Tanda yang Ditemukan:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {result.alasan_indikator.map((indikator, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800"
                >
                  <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="font-medium leading-relaxed">{indikator}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saran Tindakan Aman untuk Siswa */}
        {result.saran_tindakan && result.saran_tindakan.length > 0 && (
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70">
            <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Saran Tindakan Cerdas Siswa SMP:</span>
            </h4>
            <ul className="space-y-2">
              {result.saran_tindakan.map((saran, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-emerald-900 font-medium">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span>{saran}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* AI Disclaimer Notice */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-700">Penting Diingat:</span> Analisis AI bertujuan membantu kamu berpikir kritis dan mendeteksi tanda bahaya. Jangan menganggap suatu pesan 100% aman hanya berdasarkan hasil sistem. Jika ragu mengenai urusan sekolah, biaya, atau masalah pertemanan, selalu tanyakan langsung kepada guru atau orang tua.
          </div>
        </div>

      </div>

      {/* Footer Actions: Chatbot, Ask Help, and Safe Sharing */}
      <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* CTA: Tanya Detektif AI */}
            <button
              onClick={() => onAskDetective(result)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-200 transition-all group"
            >
              <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Tanya Detektif AI</span>
            </button>

            {/* CTA: Minta Bantuan Guru/Ortu */}
            <button
              onClick={onOpenHelp}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs sm:text-sm transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-rose-600" />
              <span>Minta Bantuan</span>
            </button>
          </div>

          {/* Sharing Section */}
          <div className="w-full sm:w-auto">
            {config.isHighRisk ? (
              // For High Risk & Serious Danger: HIDE fast share by default as instructed!
              <div className="text-right">
                {!showOverrideShare ? (
                  <div className="inline-flex items-center gap-2 p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-left">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <div className="text-[11px]">
                      <span className="font-bold">Jangan Bagikan Cepat:</span> Konten berisiko. Lebih baik diskusikan dengan guru atau orang tua.
                    </div>
                    <button
                      onClick={() => setShowOverrideShare(true)}
                      className="text-[10px] font-bold text-indigo-700 underline hover:text-indigo-900 whitespace-nowrap ml-1"
                    >
                      Salin Edukasi
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Tersalin!' : 'Salin Peringatan'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // For Safe / Need further check: Standard share options
              <div className="flex items-center gap-2 w-full justify-end">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Teks Tersalin!' : 'Salin Hasil'}</span>
                </button>

                <button
                  onClick={handleNativeShare}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{shareSuccess ? 'Dibagikan!' : 'Bagikan Edukasi'}</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
