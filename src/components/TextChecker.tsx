import React, { useState } from 'react';
import { Send, Clipboard, Trash2, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import { SAMPLE_TEXTS, TextSample } from '../data/samples';
import { AnalysisResult } from '../types';

interface TextCheckerProps {
  onAnalyze: (text: string, contextNote?: string) => Promise<void>;
  isLoading: boolean;
  loadingStep: string;
}

export const TextChecker: React.FC<TextCheckerProps> = ({
  onAnalyze,
  isLoading,
  loadingStep,
}) => {
  const [inputText, setInputText] = useState('');
  const [contextNote, setContextNote] = useState('');
  const [showSamples, setShowSamples] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputText(text);
          setValidationError(null);
        }
      } else {
        alert('Fitur tempel otomatis belum diizinkan browser. Silakan tekan Ctrl+V atau tahan pada kotak teks.');
      }
    } catch (err) {
      console.warn('Clipboard read failed:', err);
    }
  };

  const handleClear = () => {
    setInputText('');
    setContextNote('');
    setValidationError(null);
  };

  const handleSelectSample = (sample: TextSample) => {
    setInputText(sample.text);
    setContextNote(sample.description);
    setShowSamples(false);
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setValidationError('Silakan tempel atau ketik pesan yang ingin kamu periksa terlebih dahulu.');
      return;
    }
    if (inputText.trim().length < 5) {
      setValidationError('Pesan terlalu singkat untuk dianalisis. Mohon masukkan kalimat atau potongan pesan yang lengkap.');
      return;
    }
    setValidationError(null);
    onAnalyze(inputText.trim(), contextNote.trim() || undefined);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>📝 Periksa Pesan &amp; Teks Berantai</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Salin dan tempel pesan dari WhatsApp, grup kelas, DM Instagram, atau SMS di sini.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setShowSamples(!showSamples)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-200/70"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{showSamples ? 'Tutup Contoh' : 'Coba Contoh Kasus'}</span>
          </button>

          <button
            type="button"
            onClick={handlePaste}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            title="Tempel teks yang baru disalin"
          >
            <Clipboard className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Tempel Teks</span>
          </button>

          {inputText && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-rose-600 hover:bg-rose-50 transition-colors"
              title="Bersihkan kolom input"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Hapus</span>
            </button>
          )}
        </div>
      </div>

      {/* Preset Samples Accordion */}
      {showSamples && (
        <div className="mb-6 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 animate-fadeIn">
          <p className="text-xs font-bold text-indigo-900 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Pilih contoh kasus nyata yang sering beredar di kalangan pelajar SMP:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SAMPLE_TEXTS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="text-left p-3 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 transition-all text-xs group shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 group-hover:text-indigo-700">
                    {sample.title}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${sample.badgeColor}`}>
                    {sample.tag}
                  </span>
                </div>
                <p className="text-slate-500 line-clamp-1">{sample.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="message-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Isi Pesan atau Obrolan:
          </label>
          <div className="relative">
            <textarea
              id="message-input"
              rows={5}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="Contoh: 'Selamat kamu dapat kuota 50GB, klik link ini...' atau tempel pesan yang bikin kamu ragu/takut..."
              className="w-full p-4 rounded-2xl bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-sm text-slate-800 placeholder-slate-400 transition-all resize-y font-normal"
            />
            <div className="absolute right-3 bottom-3 text-[11px] font-medium text-slate-400 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
              {inputText.length} karakter
            </div>
          </div>
        </div>

        {/* Optional Context Note */}
        <div>
          <label htmlFor="context-input" className="block text-xs font-semibold text-slate-600 mb-1 flex items-center justify-between">
            <span>Catatan Tambahan (Opsional):</span>
            <span className="text-[11px] font-normal text-slate-400">Membantu AI memahami situasi</span>
          </label>
          <input
            id="context-input"
            type="text"
            value={contextNote}
            onChange={(e) => setContextNote(e.target.value)}
            placeholder="Misal: Pesan ini diteruskan ke grup kelas oleh nomor yang tidak dikenal"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-all"
          />
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Submit Button & Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Pesan dianalisis secara privat &amp; tidak disimpan ke basis data manapun.</span>
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{loadingStep || 'Detektif Memeriksa...'}</span>
              </>
            ) : (
              <>
                <span>Periksa Pesan Sekarang</span>
                <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
