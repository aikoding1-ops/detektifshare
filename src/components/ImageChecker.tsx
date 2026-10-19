import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Trash2, AlertCircle, Sparkles, CheckCircle2, FileWarning } from 'lucide-react';
import { createSampleImageBase64 } from '../data/samples';

interface ImageCheckerProps {
  onAnalyze: (imageBase64: string, mimeType: string, note?: string) => Promise<void>;
  isLoading: boolean;
  loadingStep: string;
}

export const ImageChecker: React.FC<ImageCheckerProps> = ({
  onAnalyze,
  isLoading,
  loadingStep,
}) => {
  const [selectedImage, setSelectedImage] = useState<{
    dataUrl: string;
    mimeType: string;
    name: string;
    sizeFormatted: string;
  } | null>(null);

  const [note, setNote] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  const processFile = (file: File) => {
    setErrorMsg(null);

    // Validate type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setErrorMsg('Format file tidak didukung. Mohon unggah gambar berformat JPG, PNG, atau WebP.');
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMsg(`Ukuran file (${(file.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas maksimal 5 MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setSelectedImage({
          dataUrl: result,
          mimeType: file.type,
          name: file.name,
          sizeFormatted: `${(file.size / 1024).toFixed(0)} KB`,
        });
      }
    };
    reader.onerror = () => {
      setErrorMsg('Gagal membaca file gambar. Silakan coba lagi.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setNote('');
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const loadSampleImage = (type: 'giveaway' | 'bullying' | 'osis') => {
    const sample = createSampleImageBase64(type);
    setSelectedImage({
      dataUrl: sample.base64,
      mimeType: sample.mimeType,
      name: `Simulasi_${type}.png`,
      sizeFormatted: '35 KB',
    });
    setNote(sample.note);
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) {
      setErrorMsg('Silakan pilih atau unggah gambar/screenshot terlebih dahulu.');
      return;
    }
    setErrorMsg(null);
    onAnalyze(selectedImage.dataUrl, selectedImage.mimeType, note.trim() || undefined);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>🖼️ Periksa Tangkapan Layar (Screenshot)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Unggah screenshot obrolan WhatsApp, DM Instagram, postingan medsos, atau poster info sekolah.
          </p>
        </div>

        {/* Preset sample buttons for quick testing without personal files */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-400">Coba Screenshot:</span>
          <button
            type="button"
            onClick={() => loadSampleImage('giveaway')}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60 transition-colors"
          >
            🎁 Scam Hadiah
          </button>
          <button
            type="button"
            onClick={() => loadSampleImage('bullying')}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60 transition-colors"
          >
            💬 Bullying Grup
          </button>
          <button
            type="button"
            onClick={() => loadSampleImage('osis')}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 transition-colors"
          >
            🏫 Pengumuman Resmi
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp, image/gif"
          className="hidden"
        />

        {/* Upload Dropzone or Preview */}
        {!selectedImage ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
                : 'border-slate-200 bg-slate-50/50 hover:bg-indigo-50/20 hover:border-indigo-300'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-inner">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                Pilih Gambar atau Tarik File ke Sini
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Mendukung screenshot format PNG, JPG, atau WebP (Maksimal 5 MB)
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-indigo-600 border border-slate-200 shadow-2xs">
              <ImageIcon className="w-3.5 h-3.5" />
              Jelajahi Galeri HP / Komputer
            </span>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800 truncate max-w-xs">
                  {selectedImage.name}
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  ({selectedImage.sizeFormatted})
                </span>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Pratinjau</span>
              </button>
            </div>

            {/* Image Preview Container */}
            <div className="relative rounded-xl overflow-hidden bg-slate-900 max-h-80 flex items-center justify-center border border-slate-200">
              <img
                src={selectedImage.dataUrl}
                alt="Pratinjau screenshot untuk diperiksa"
                className="max-h-80 w-auto object-contain"
              />
            </div>
          </div>
        )}

        {/* Optional Context Note */}
        <div>
          <label htmlFor="image-note-input" className="block text-xs font-semibold text-slate-600 mb-1">
            Ceritakan Situasinya (Opsional):
          </label>
          <input
            id="image-note-input"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Misal: Dikirim ke grup kelas 7B, banyak teman yang panik atau merasa tersinggung"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-all"
          />
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <FileWarning className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <p className="text-[11px] text-slate-400">
            🔒 Gambar diproses sementara oleh AI dan langsung dibersihkan setelah selesai dianalisis.
          </p>

          <button
            type="submit"
            disabled={isLoading || !selectedImage}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{loadingStep || 'Menganalisis Gambar...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Periksa Screenshot Ini</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
