import React from 'react';
import { ShieldCheck, MessageCircle, AlertCircle, Sparkles, BookOpen, Lock } from 'lucide-react';
import { ServerStatus } from '../types';

interface HeaderProps {
  activeTab: 'checker' | 'chat' | 'help' | 'guide';
  setActiveTab: (tab: 'checker' | 'chat' | 'help' | 'guide') => void;
  serverStatus: ServerStatus | null;
  onOpenPrivacy: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  serverStatus,
  onOpenPrivacy,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Slogan */}
          <button
            onClick={() => setActiveTab('checker')}
            className="flex items-center gap-3 text-left group focus:outline-hidden"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-linear-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform duration-200">
              <span className="text-2xl" role="img" aria-label="detective">🕵️‍♂️</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Detektif Share
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  Untuk Siswa SMP
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-indigo-600 tracking-wide">
                Periksa Sebelum Berbagi! ✨
              </p>
            </div>
          </button>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('checker')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'checker'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Periksa Konten
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'chat'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              Tanya Detektif AI
            </button>
            <button
              onClick={() => setActiveTab('help')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'help'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <AlertCircle className="w-4 h-4 text-rose-600" />
              Minta Bantuan
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'guide'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-600" />
              Panduan Aman
            </button>
          </nav>

          {/* Right Action: Privacy & AI Status */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPrivacy}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              title="Komitmen Privasi: Bebas Sandi, Tidak Melacak, & Tidak Menyimpan Data Pribadi"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">100% Aman &amp; Privat</span>
            </button>

            {serverStatus && (
              <div
                className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  serverStatus.configured
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
                title={serverStatus.configured ? 'AI Detektif Siap Bertugas' : 'Kunci AI belum aktif di server'}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    serverStatus.configured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                <span>{serverStatus.configured ? 'AI Aktif' : 'AI Offline'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar at bottom or secondary row */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 gap-1">
          <button
            onClick={() => setActiveTab('checker')}
            className={`flex flex-col items-center py-1 px-2 text-xs font-semibold rounded-lg ${
              activeTab === 'checker' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500'
            }`}
          >
            <ShieldCheck className="w-4 h-4 mb-0.5" />
            Periksa
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center py-1 px-2 text-xs font-semibold rounded-lg ${
              activeTab === 'chat' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500'
            }`}
          >
            <MessageCircle className="w-4 h-4 mb-0.5" />
            Tanya AI
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`flex flex-col items-center py-1 px-2 text-xs font-semibold rounded-lg ${
              activeTab === 'help' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500'
            }`}
          >
            <AlertCircle className="w-4 h-4 mb-0.5" />
            Bantuan
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex flex-col items-center py-1 px-2 text-xs font-semibold rounded-lg ${
              activeTab === 'guide' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500'
            }`}
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            Panduan
          </button>
        </div>

      </div>
    </header>
  );
};
