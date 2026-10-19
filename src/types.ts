export type RiskCategory =
  | 'Aman Berdasarkan Pemeriksaan'
  | 'Perlu Diperiksa Lebih Lanjut'
  | 'Berisiko'
  | 'Bahaya Serius';

export interface AnalysisResult {
  kategori_risiko: RiskCategory;
  skor_risiko: number; // 1 - 10
  tingkat_keyakinan: string; // 'Cukup Bukti' | 'Bukti Terbatas' | 'Perlu Fakta Luar'
  status_verifikasi_kebenaran: string;
  judul_temuan: string;
  ringkasan: string;
  alasan_indikator: string[];
  bagian_belum_pasti: string;
  saran_tindakan: string[];
  deteksi_bahaya_khusus: {
    adalah_bahaya_serius: boolean;
    jenis_bahaya: string;
    pesan_darurat: string;
  };
  teks_ekstraksi?: string;
  waktu_periksa?: string;
  tipe_konten?: 'teks' | 'gambar';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface ContactSettings {
  teacherName: string;
  teacherRole: string;
  teacherPhone: string;
  parentName: string;
  parentRole: string;
  parentPhone: string;
}

export interface ServerStatus {
  status: string;
  configured: boolean;
  model: string;
  appName: string;
}
