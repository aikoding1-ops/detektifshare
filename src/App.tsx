/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ApiStatusBanner } from './components/ApiStatusBanner';
import { TextChecker } from './components/TextChecker';
import { ImageChecker } from './components/ImageChecker';
import { ResultCard } from './components/ResultCard';
import { DetectiveChat } from './components/DetectiveChat';
import { HelpModal } from './components/HelpModal';
import { PrivacyNoticeModal } from './components/PrivacyNoticeModal';
import { SafetyGuide } from './components/SafetyGuide';
import { AnalysisResult, ServerStatus } from './types';
import {
  FileText,
  Image as ImageIcon,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'checker' | 'chat' | 'help' | 'guide'>('checker');
  const [checkerMode, setCheckerMode] = useState<'text' | 'image'>('text');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Modals
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Check server status on mount
  const checkStatus = async () => {
    setIsStatusLoading(true);
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setServerStatus(data);
    } catch (err) {
      console.error('Failed to fetch server status:', err);
      setServerStatus({
        status: 'error',
        configured: false,
        model: 'gemini-3.8-flash',
        appName: 'Detektif Share',
      });
    } finally {
      setIsStatusLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  // Text analysis handler
  const handleAnalyzeText = async (text: string, contextNote?: string) => {
    setIsLoading(true);
    setGlobalError(null);
    setAnalysisResult(null);

    const steps = [
      'Detektif sedang membaca pesan...',
      'Mengecek indikator hoaks & tautan mencurigakan...',
      'Meneliti potensi ujaran kebencian & bullying...',
      'Menyusun rekomendasi aman untuk siswa...',
    ];

    let stepIdx = 0;
    setLoadingStep(steps[0]);
    const stepInterval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setLoadingStep(steps[stepIdx]);
      }
    }, 1200);

    try {
      const response = await fetch('/api/analyze-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, contextNote }),
      });

      const json = await response.json();
      clearInterval(stepInterval);

      if (!response.ok) {
        throw new Error(json.error || 'Gagal menganalisis teks pesan.');
      }

      const result: AnalysisResult = {
        ...json.data,
        waktu_periksa: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        tipe_konten: 'teks',
      };

      setAnalysisResult(result);
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Analysis error:', err);
      setGlobalError(
        err.message || 'Terjadi gangguan saat memproses analisis. Silakan periksa koneksi internetmu.'
      );
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Image analysis handler
  const handleAnalyzeImage = async (imageBase64: string, mimeType: string, note?: string) => {
    setIsLoading(true);
    setGlobalError(null);
    setAnalysisResult(null);

    const steps = [
      'Detektif sedang memindai gambar & teks screenshot...',
      'Mendeteksi tanda manipulasi & pancingan hadiah...',
      'Memeriksa kemungkinan konten tidak pantas atau perundungan...',
      'Menyusun laporan pemeriksaan untuk siswa...',
    ];

    let stepIdx = 0;
    setLoadingStep(steps[0]);
    const stepInterval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setLoadingStep(steps[stepIdx]);
      }
    }, 1400);

    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mimeType, note }),
      });

      const json = await response.json();
      clearInterval(stepInterval);

      if (!response.ok) {
        throw new Error(json.error || 'Gagal memproses gambar screenshot.');
      }

      const result: AnalysisResult = {
        ...json.data,
        waktu_periksa: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        tipe_konten: 'gambar',
      };

      setAnalysisResult(result);
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Image analysis error:', err);
      setGlobalError(
        err.message || 'Gagal memproses gambar. Pastikan gambar tidak rusak dan coba lagi.'
      );
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleAskDetective = (result: AnalysisResult) => {
    setActiveTab('chat');
  };

  const handleResetAnalysis = () => {
    setAnalysisResult(null);
    setGlobalError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        serverStatus={serverStatus}
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
      />

      {/* API Unconfigured Banner if key is missing */}
      <ApiStatusBanner
        status={serverStatus}
        isLoading={isStatusLoading}
        onRefresh={checkStatus}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* Tab 1: Checker (Home Dashboard) */}
        {activeTab === 'checker' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Friendly Hero Banner for SMP Students */}
            {!analysisResult && (
              <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-10 shadow-lg border border-indigo-700/40">
                <div className="relative z-10 max-w-2xl space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 backdrop-blur-md">
                    <span>🕵️‍♀️ Sahabat Cerdas Pelajar SMP</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                    Dapat pesan aneh atau meragukan di medsos?
                  </h1>
                  <p className="text-indigo-200 text-xs sm:text-sm leading-relaxed">
                    Jangan buru-buru diteruskan ke grup kelas! Periksa screenshot chat atau teks pesanmu di sini untuk mendeteksi penipuan, berita bohong (hoaks), atau ancaman cyberbullying.
                  </p>
                  
                  {/* Quick stats pills */}
                  <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-indigo-300 font-medium">
                    <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs">
                      🔒 Tanpa Login &amp; Sandi
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs">
                      ⚡ Analisis Cepat AI
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs">
                      🛡️ Perlindungan Ramah Remaja
                    </span>
                  </div>
                </div>

                {/* Decorative background element */}
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block text-7xl select-none opacity-80">
                  🔍
                </div>
              </div>
            )}

            {/* Error Notice if any */}
            {globalError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start justify-between gap-3 animate-shake">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-xs sm:text-sm text-rose-950">Terjadi Kendala</p>
                    <p className="text-xs text-rose-800 mt-0.5">{globalError}</p>
                  </div>
                </div>
                <button
                  onClick={() => setGlobalError(null)}
                  className="text-xs font-bold text-rose-700 hover:underline"
                >
                  Tutup
                </button>
              </div>
            )}

            {/* If there's an inspection result, display ResultCard */}
            {analysisResult ? (
              <ResultCard
                result={analysisResult}
                onAskDetective={handleAskDetective}
                onOpenHelp={() => setIsHelpModalOpen(true)}
                onReset={handleResetAnalysis}
              />
            ) : (
              /* If no result yet, display Mode Switcher & Form */
              <div className="space-y-6">
                {/* Mode Selector: Teks vs Gambar */}
                <div className="flex items-center justify-center">
                  <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300/60 shadow-inner">
                    <button
                      onClick={() => setCheckerMode('text')}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        checkerMode === 'text'
                          ? 'bg-white text-indigo-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>Periksa Teks / Pesan</span>
                    </button>
                    <button
                      onClick={() => setCheckerMode('image')}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        checkerMode === 'image'
                          ? 'bg-white text-indigo-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4 text-sky-600" />
                      <span>Periksa Gambar / Screenshot</span>
                    </button>
                  </div>
                </div>

                {/* Checker Form Component */}
                {checkerMode === 'text' ? (
                  <TextChecker
                    onAnalyze={handleAnalyzeText}
                    isLoading={isLoading}
                    loadingStep={loadingStep}
                  />
                ) : (
                  <ImageChecker
                    onAnalyze={handleAnalyzeImage}
                    isLoading={isLoading}
                    loadingStep={loadingStep}
                  />
                )}
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Chatbot Tanya Detektif AI */}
        {activeTab === 'chat' && (
          <div className="animate-fadeIn">
            <DetectiveChat
              currentContext={analysisResult}
              onOpenHelp={() => setIsHelpModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 3: Help Section */}
        {activeTab === 'help' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center max-w-xl mx-auto space-y-2 mb-4">
              <span className="text-3xl">🆘</span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Pusat Pendampingan Siswa
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Jangan pendam ketakutan atau kebingunganmu sendirian. Kami siap membantumu terhubung dengan orang dewasa terpercaya.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              {/* Trigger the help modal view directly inside the page */}
              <button
                onClick={() => setIsHelpModalOpen(true)}
                className="w-full p-6 rounded-3xl bg-white border-2 border-dashed border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all text-center flex flex-col items-center justify-center gap-3 shadow-xs"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Buka Panel Kontak &amp; Nomor Darurat Sahabat Anak
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md">
                    Hubungi Guru BK, Orang Tua via WhatsApp/Telepon, atau akses layanan bebas pulsa SAPA 129 KemenPPPA.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md">
                  <span>Buka Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Guide & Education */}
        {activeTab === 'guide' && (
          <SafetyGuide
            onStartChecking={() => {
              setActiveTab('checker');
              setAnalysisResult(null);
            }}
            onOpenChat={() => setActiveTab('chat')}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">Detektif Share</span>
            <span>•</span>
            <span className="font-medium text-indigo-600">Periksa Sebelum Berbagi!</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="hover:text-indigo-600 transition-colors"
            >
              Komitmen Privasi
            </button>
            <span>•</span>
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="hover:text-indigo-600 transition-colors"
            >
              Hotline Anak 129
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('guide')}
              className="hover:text-indigo-600 transition-colors"
            >
              Panduan Edukasi
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        contextMessage={analysisResult ? analysisResult.judul_temuan : undefined}
      />

      <PrivacyNoticeModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

    </div>
  );
}
