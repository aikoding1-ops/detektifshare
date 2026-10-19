import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, DatabaseZap, CheckCircle2 } from 'lucide-react';

interface PrivacyNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyNoticeModal: React.FC<PrivacyNoticeModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Jaminan Privasi &amp; Keamanan
              </h3>
              <p className="text-xs text-slate-500">Prinsip Perlindungan Detektif Share</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3.5 text-xs text-slate-600">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800">Tidak Pernah Meminta Password</p>
              <p className="text-slate-500 mt-0.5">
                Aplikasi ini tidak akan pernah meminta kata sandi Instagram, WhatsApp, TikTok, email, atau akun media sosial apapun milikmu.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <EyeOff className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800">Tidak Membaca Chat Pribadi Otomatis</p>
              <p className="text-slate-500 mt-0.5">
                Kami tidak memiliki akses ke inbox HP-mu. Detektif Share hanya memeriksa pesan atau screenshot yang secara sadar kamu tempelkan sendiri ke dalam kotak pemeriksaan.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <DatabaseZap className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800">Tanpa Basis Data &amp; Riwayat Permanen</p>
              <p className="text-slate-500 mt-0.5">
                Gambar dan teksmu diproses secara sementara di memori server untuk dianalisis oleh AI, lalu segera dihapus. Tidak ada riwayat yang disimpan di server.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800">Tanpa Registrasi / Akun</p>
              <p className="text-slate-500 mt-0.5">
                Kamu dapat langsung menggunakannya tanpa perlu login, memasukkan email, atau mendaftar nomor HP.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
        >
          Saya Paham &amp; Merasa Aman
        </button>
      </div>
    </div>
  );
};
