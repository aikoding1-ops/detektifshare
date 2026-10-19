import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  MessageSquare,
  Settings,
  ShieldAlert,
  ExternalLink,
  Save,
  Check,
  AlertTriangle,
  UserCheck,
  HeartHandshake,
  HelpCircle,
} from 'lucide-react';
import { ContactSettings } from '../types';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextMessage?: string;
}

const DEFAULT_SETTINGS: ContactSettings = {
  teacherName: 'Bapak/Ibu Guru BK atau Wali Kelas',
  teacherRole: 'Guru Pembimbing Sekolah',
  teacherPhone: '',
  parentName: 'Ayah / Ibu',
  parentRole: 'Orang Tua / Wali Murid',
  parentPhone: '',
};

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  contextMessage,
}) => {
  const [contacts, setContacts] = useState<ContactSettings>(() => {
    try {
      const saved = localStorage.getItem('detektif_share_contacts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore
    }
    return DEFAULT_SETTINGS;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempContacts, setTempContacts] = useState<ContactSettings>(contacts);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Confirmation state before launching external phone/WhatsApp
  const [pendingAction, setPendingAction] = useState<{
    type: 'whatsapp' | 'phone';
    targetName: string;
    targetPhone: string;
    url: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPendingAction(null);
      setIsEditing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveContacts = (e: React.FormEvent) => {
    e.preventDefault();
    setContacts(tempContacts);
    try {
      localStorage.setItem('detektif_share_contacts', JSON.stringify(tempContacts));
    } catch (e) {
      // Ignore
    }
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const cleanPhoneNumber = (phone: string) => {
    // Standardize to Indonesian international format for wa.me if needed
    let cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.slice(1);
    }
    return cleaned;
  };

  const initiateWhatsApp = (name: string, rawPhone: string) => {
    if (!rawPhone.trim()) {
      setIsEditing(true);
      return;
    }

    const clean = cleanPhoneNumber(rawPhone);
    const textMsg = encodeURIComponent(
      `Halo ${name}, saya ingin meminta bimbingan dan bantuan terkait konten/pesan mencurigakan yang saya temukan di media sosial. Mohon bantuannya ya.`
    );
    const waUrl = `https://wa.me/${clean}?text=${textMsg}`;

    setPendingAction({
      type: 'whatsapp',
      targetName: name,
      targetPhone: rawPhone,
      url: waUrl,
    });
  };

  const initiatePhone = (name: string, rawPhone: string) => {
    if (!rawPhone.trim()) {
      setIsEditing(true);
      return;
    }

    setPendingAction({
      type: 'phone',
      targetName: name,
      targetPhone: rawPhone,
      url: `tel:${rawPhone.replace(/[^0-9+]/g, '')}`,
    });
  };

  const confirmAndOpen = () => {
    if (pendingAction) {
      window.open(pendingAction.url, '_blank', 'noopener,noreferrer');
      setPendingAction(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Pusat Bantuan &amp; Pendampingan
              </h3>
              <p className="text-xs text-slate-500">
                Hubungi Guru, Orang Tua, atau Layanan Sahabat Anak
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Confirmation Modal if triggered */}
        {pendingAction ? (
          <div className="p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <p className="font-bold text-amber-950 mb-1">
                    Konfirmasi Membuka {pendingAction.type === 'whatsapp' ? 'WhatsApp' : 'Panggilan Telepon'}
                  </p>
                  <p className="text-amber-800">
                    Aplikasi Detektif Share akan mengalihkan kamu ke aplikasi {pendingAction.type === 'whatsapp' ? 'WhatsApp' : 'Telepon'} untuk menghubungi <span className="font-bold text-amber-950">{pendingAction.targetName}</span> ({pendingAction.targetPhone}).
                  </p>
                  <div className="mt-2.5 p-2 rounded-lg bg-white/80 border border-amber-200 text-[11px] text-amber-900 font-medium">
                    ⚠️ <span className="font-bold">Perhatian:</span> Laporan belum otomatis terkirim. Pesan baru akan terkirim setelah kamu menekan tombol kirim di dalam aplikasi WhatsApp atau menekan tombol panggil di teleponmu.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPendingAction(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmAndOpen}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors"
              >
                <span>Buka {pendingAction.type === 'whatsapp' ? 'WhatsApp' : 'Telepon'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">

            {/* Quick reminder for students */}
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-950 text-xs flex items-start gap-3">
              <span className="text-xl">🤝</span>
              <div>
                <p className="font-bold">Jangan Merasa Sendiri!</p>
                <p className="text-indigo-800 mt-0.5 leading-relaxed">
                  Jika kamu menerima pesan berisi ancaman, ejekan berlebihan, pemerasan, atau merasa takut, bercerita ke orang dewasa yang kamu percaya adalah langkah yang sangat berani dan benar.
                </p>
              </div>
            </div>

            {/* Contact Settings Section (Edit vs View) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-slate-500" />
                  <span>Kontak Guru &amp; Orang Tua Kamu</span>
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setTempContacts(contacts);
                    setIsEditing(!isEditing);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Tutup Pengaturan' : 'Atur Nomor'}</span>
                </button>
              </div>

              {saveSuccess && (
                <div className="mb-3 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-1.5 animate-fadeIn">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Nomor kontak berhasil disimpan di browsermu!</span>
                </div>
              )}

              {isEditing ? (
                /* Form to set numbers */
                <form onSubmit={handleSaveContacts} className="space-y-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-500">
                    Masukkan nomor WhatsApp atau telepon Guru BK/Wali Kelas dan Orang Tuamu agar tombol bantuan siap dipakai sewaktu-waktu.
                  </p>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">1. Kontak Guru / Wali Kelas:</label>
                    <input
                      type="text"
                      value={tempContacts.teacherName}
                      onChange={(e) => setTempContacts({ ...tempContacts, teacherName: e.target.value })}
                      placeholder="Nama Guru BK / Wali Kelas"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800"
                    />
                    <input
                      type="tel"
                      value={tempContacts.teacherPhone}
                      onChange={(e) => setTempContacts({ ...tempContacts, teacherPhone: e.target.value })}
                      placeholder="Nomor HP/WA Guru (contoh: 08123456789)"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800"
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <label className="block text-xs font-bold text-slate-700">2. Kontak Orang Tua / Wali:</label>
                    <input
                      type="text"
                      value={tempContacts.parentName}
                      onChange={(e) => setTempContacts({ ...tempContacts, parentName: e.target.value })}
                      placeholder="Nama Ayah / Ibu"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800"
                    />
                    <input
                      type="tel"
                      value={tempContacts.parentPhone}
                      onChange={(e) => setTempContacts({ ...tempContacts, parentPhone: e.target.value })}
                      placeholder="Nomor HP/WA Orang Tua (contoh: 08129876543)"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Simpan Kontak
                    </button>
                  </div>
                </form>
              ) : (
                /* Contact Action Cards */
                <div className="space-y-3">
                  
                  {/* Card Guru */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{contacts.teacherName}</p>
                      <p className="text-[11px] text-slate-500">
                        {contacts.teacherPhone ? `No: ${contacts.teacherPhone}` : 'Nomor belum diatur'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => initiateWhatsApp(contacts.teacherName, contacts.teacherPhone)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat WA</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => initiatePhone(contacts.teacherName, contacts.teacherPhone)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Telepon</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Orang Tua */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{contacts.parentName}</p>
                      <p className="text-[11px] text-slate-500">
                        {contacts.parentPhone ? `No: ${contacts.parentPhone}` : 'Nomor belum diatur'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => initiateWhatsApp(contacts.parentName, contacts.parentPhone)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat WA</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => initiatePhone(contacts.parentName, contacts.parentPhone)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Telepon</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Official National Hotlines for Indonesian Students */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>Layanan Bantuan Resmi Nasional (Gratis)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                
                {/* SAPA 129 */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">SAPA 129 (KemenPPPA)</span>
                    <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-md font-semibold">Resmi</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Pengaduan kekerasan &amp; perlindungan anak.</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => initiatePhone('SAPA 129', '129')}
                      className="text-[11px] font-bold text-indigo-600 hover:underline"
                    >
                      📞 Hubungi 129
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      onClick={() => initiateWhatsApp('SAPA 129', '08111129129')}
                      className="text-[11px] font-bold text-emerald-600 hover:underline"
                    >
                      💬 WA 08111-129-129
                    </button>
                  </div>
                </div>

                {/* Halo Kemdikbud */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Halo Kemdikbud</span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-md font-semibold">Pendidikan</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Layanan bantuan seputar sekolah &amp; perundungan.</p>
                  <div className="mt-2">
                    <button
                      onClick={() => initiatePhone('Halo Kemdikbud', '177')}
                      className="text-[11px] font-bold text-indigo-600 hover:underline"
                    >
                      📞 Telepon 177
                    </button>
                  </div>
                </div>

                {/* Panggilan Darurat 112 */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Panggilan Darurat</span>
                    <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-md font-semibold">24 Jam</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Nomor darurat bebas pulsa.</p>
                  <div className="mt-2">
                    <button
                      onClick={() => initiatePhone('Panggilan Darurat', '112')}
                      className="text-[11px] font-bold text-rose-600 hover:underline"
                    >
                      🚨 Telepon 112
                    </button>
                  </div>
                </div>

                {/* Aduan Konten Kominfo */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Aduan Konten Kominfo</span>
                    <span className="text-[10px] bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded-md font-semibold">Siber</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Lapor penipuan online &amp; judi ilegal.</p>
                  <div className="mt-2">
                    <button
                      onClick={() => initiateWhatsApp('Aduan Kominfo', '08119224545')}
                      className="text-[11px] font-bold text-emerald-600 hover:underline"
                    >
                      💬 WA 0811-9224-545
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Disclaimer & Privacy Guarantee */}
            <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200 text-[11px] text-slate-500 space-y-1">
              <p className="font-bold text-slate-700">🔒 Catatan Keamanan Aplikasi:</p>
              <p>
                Aplikasi ini tidak menyimpan riwayat panggilanmu dan tidak mengklaim status laporan telah diterima pihak sekolah. Kontak tersimpan secara lokal di browsermu dan dapat diubah kapan saja.
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
