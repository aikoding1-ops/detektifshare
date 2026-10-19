import React from 'react';
import { AlertTriangle, Key, RefreshCw, Info } from 'lucide-react';
import { ServerStatus } from '../types';

interface ApiStatusBannerProps {
  status: ServerStatus | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export const ApiStatusBanner: React.FC<ApiStatusBannerProps> = ({
  status,
  isLoading,
  onRefresh,
}) => {
  if (status && status.configured) {
    return null; // All good, no need to clutter UI
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-3 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-sm text-amber-950 flex items-center gap-1.5">
              <span>Layanan Analisis AI Belum Dikonfigurasi</span>
              <span className="text-xs font-normal px-2 py-0.5 rounded-md bg-amber-200/70 text-amber-900">
                Mode Uji Coba UI
              </span>
            </p>
            <p className="text-xs text-amber-800 mt-0.5">
              Kunci akses server (<code className="font-mono bg-amber-100 px-1 py-0.5 rounded">GEMINI_API_KEY</code>) belum terpasang di environment server. Aplikasi tidak akan berpura-pura memberikan hasil analisis nyata tanpa koneksi AI asli.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-200/80 hover:bg-amber-300 text-amber-950 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Periksa Koneksi
          </button>
        </div>
      </div>
    </div>
  );
};
