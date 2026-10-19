import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Body parsing with 15MB limit for image uploads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

const apiKey = process.env.GEMINI_API_KEY;

// Server-side Gemini initialization with required telemetry header
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// JSON schema for structured analysis
const analysisResponseSchema = {
  type: Type.OBJECT,
  properties: {
    kategori_risiko: {
      type: Type.STRING,
      description: "Wajib salah satu dari: 'Aman Berdasarkan Pemeriksaan', 'Perlu Diperiksa Lebih Lanjut', 'Berisiko', 'Bahaya Serius'",
    },
    skor_risiko: {
      type: Type.INTEGER,
      description: "Nilai risiko skala 1-10 (1 aman, 10 sangat berbahaya)",
    },
    tingkat_keyakinan: {
      type: Type.STRING,
      description: "Kepastian bukti AI: 'Cukup Bukti', 'Bukti Terbatas', atau 'Perlu Fakta Luar'",
    },
    status_verifikasi_kebenaran: {
      type: Type.STRING,
      description: "Penjelasan terpisah mengenai status kebenaran fakta (apakah terindikasi hoaks, fakta resmi, atau belum dapat dipastikan)",
    },
    judul_temuan: {
      type: Type.STRING,
      description: "Judul temuan singkat, jelas, ramah untuk siswa SMP",
    },
    ringkasan: {
      type: Type.STRING,
      description: "Ringkasan analisis yang mudah dipahami anak usia SMP (2-3 kalimat)",
    },
    alasan_indikator: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Indikator atau keanehan yang terdeteksi (gaya bahasa urgensi, iming-iming, ejekan, data rahasia, link phising)",
    },
    bagian_belum_pasti: {
      type: Type.STRING,
      description: "Bagian yang belum dapat dipastikan hanya dari gambar/pesan ini dan butuh kewaspadaan ekstra",
    },
    saran_tindakan: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Tindakan praktis dan aman untuk siswa SMP (jangan klik link, bicarakan guru BK, lapor ortu, blokir)",
    },
    deteksi_bahaya_khusus: {
      type: Type.OBJECT,
      properties: {
        adalah_bahaya_serius: { type: Type.BOOLEAN },
        jenis_bahaya: { type: Type.STRING, description: "Kategori bahaya spesifik: cyberbullying, pemerasan, pelecehan, phising, penipuan uang, atau tidak ada" },
        pesan_darurat: { type: Type.STRING, description: "Instruksi bantuan darurat bila perlu menghubungi orang tua atau guru" },
      },
      required: ["adalah_bahaya_serius", "jenis_bahaya", "pesan_darurat"],
    },
    teks_ekstraksi: {
      type: Type.STRING,
      description: "Teks atau transkrip utama yang terbaca jika konten berupa gambar/screenshot",
    },
  },
  required: [
    "kategori_risiko",
    "skor_risiko",
    "tingkat_keyakinan",
    "status_verifikasi_kebenaran",
    "judul_temuan",
    "ringkasan",
    "alasan_indikator",
    "bagian_belum_pasti",
    "saran_tindakan",
    "deteksi_bahaya_khusus",
  ],
};

const SYSTEM_INSTRUCTION_ANALYSIS = `
Anda adalah "Detektif Share", asisten kecerdasan buatan pelindung literasi digital untuk siswa Sekolah Menengah Pertama (SMP) di Indonesia usia 12-15 tahun.
Slogan Anda: "Periksa Sebelum Berbagi!".

Tugas utama Anda:
1. Memeriksa pesan teks, tangkapan layar (screenshot WhatsApp, Instagram, TikTok, Facebook, SMS, grup chat kelas) dan gambar untuk mendeteksi potensi:
   - Hoaks & disinformasi (berita palsu, isu sekolah palsu, kuota/dana gratis, undian bodong)
   - Penipuan & Phishing (link mencurigakan, pencurian akun, minta OTP, minta pulsa/transfer)
   - Cyberbullying & Ujaran Kebencian (ejekan fisik, perundungan nama orang tua, kata-kata kasar, pengucilan, ancaman tawuran/kekerasan)
   - Pelanggaran Privasi & Doxxing (penyebaran nomor HP teman, foto memalukan, KTP orang tua, alamat)
   - Konten Tidak Pantas (judi online terselubung, ajakan berbahaya, konten dewasa)

Pedoman penting yang HARUS dipatuhi:
- Kategori risiko WAJIB persis salah satu dari 4 kategori ini:
  1. "Aman Berdasarkan Pemeriksaan"
  2. "Perlu Diperiksa Lebih Lanjut"
  3. "Berisiko"
  4. "Bahaya Serius"
- Jangan pernah menjamin suatu konten 100% aman hanya berdasarkan analisis AI! Selalu ingatkan siswa untuk tetap kritis.
- Jika bukti kurang atau konteks tidak lengkap, jelaskan dengan jujur bahwa hasil belum dapat dipastikan (kategori minimal "Perlu Diperiksa Lebih Lanjut" atau beri catatan eksplisit pada bagian_belum_pasti).
- Pisahkan penilaian risiko konten dari verifikasi kebenaran informasi. Jelaskan secara mandiri di "status_verifikasi_kebenaran".
- Gaya bahasa: Ramah, suportif, edukatif, mudah dipahami siswa SMP, tidak menggurui atau memakai jargon rumit.
- Jika ada ancaman fisik, pemerasan, atau cyberbullying parah, wajib tandai "Bahaya Serius", aktifkan "adalah_bahaya_serius: true", dan berikan instruksi tegas untuk bicara dengan Guru BK, Wali Kelas, atau Orang Tua.
- Jangan mengarang fakta sejarah atau sumber berita yang tidak nyata.
- Berikan saran tindakan praktis: jangan teruskan pesan (jangan forward), simpan bukti screenshot, blokir akun pengirim jika asing/jahat, konfirmasi langsung ke orang yang bersangkutan.
`;

// Health and configuration status endpoint
app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    configured: Boolean(apiKey && apiKey.trim().length > 0),
    model: 'gemini-3.8-flash',
    appName: 'Detektif Share',
  });
});

// Analyze Text Endpoint
app.post('/api/analyze-text', async (req: Request, res: Response) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: 'Layanan AI belum aktif. Konfigurasi GEMINI_API_KEY pada server belum tersedia.',
      });
    }

    const { text, contextNote } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Teks pesan tidak boleh kosong.' });
    }

    if (text.length > 10000) {
      return res.status(400).json({ error: 'Teks terlalu panjang (maksimal 10.000 karakter).' });
    }

    const promptText = `
Analisis pesan berikut yang diterima oleh seorang siswa SMP di media sosial/chat:
"""
${text.trim()}
"""
${contextNote ? `Konteks tambahan dari siswa: "${contextNote}"` : ''}

Lakukan evaluasi menyeluruh dan kembalikan JSON sesuai struktur skema.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_ANALYSIS,
        responseMimeType: 'application/json',
        responseSchema: analysisResponseSchema,
      },
    });

    const rawJson = response.text?.trim() || '{}';
    const analysisResult = JSON.parse(rawJson);

    return res.json({ success: true, data: analysisResult });
  } catch (error: any) {
    console.error('Error analyzing text:', error);
    return res.status(500).json({
      error: 'Terjadi kendala saat menganalisis pesan dengan AI. Silakan coba beberapa saat lagi.',
      details: error?.message || 'Unknown error',
    });
  }
});

// Analyze Image Endpoint
app.post('/api/analyze-image', async (req: Request, res: Response) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: 'Layanan AI belum aktif. Konfigurasi GEMINI_API_KEY pada server belum tersedia.',
      });
    }

    const { imageBase64, mimeType, note } = req.body;
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'Data gambar wajib disertakan.' });
    }

    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const resolvedMime = allowedMimes.includes(mimeType) ? mimeType : 'image/png';

    // Remove data URL prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9-+.]+;base64,/, '');

    const imagePart = {
      inlineData: {
        mimeType: resolvedMime,
        data: cleanBase64,
      },
    };

    const textPart = {
      text: `Periksa tangkapan layar/gambar ini yang didapatkan oleh siswa SMP di media sosial atau aplikasi perpesanan.
${note ? `Catatan dari siswa: "${note}"` : ''}
Baca seluruh teks yang tampak pada gambar, periksa elemen visual, keaslian, indikasi hoaks, penipuan hadiah/tautan palsu, ujaran kebencian, perundungan siber (cyberbullying), atau ancaman.
Kembalikan evaluasi dalam format JSON sesuai skema.`,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_ANALYSIS,
        responseMimeType: 'application/json',
        responseSchema: analysisResponseSchema,
      },
    });

    const rawJson = response.text?.trim() || '{}';
    const analysisResult = JSON.parse(rawJson);

    return res.json({ success: true, data: analysisResult });
  } catch (error: any) {
    console.error('Error analyzing image:', error);
    return res.status(500).json({
      error: 'Gagal menganalisis gambar. Pastikan format gambar valid (JPG, PNG, WebP) dan ukuran wajar.',
      details: error?.message || 'Unknown error',
    });
  }
});

// Chatbot Endpoint (Tanya Detektif AI)
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: 'Layanan AI belum aktif. Konfigurasi GEMINI_API_KEY belum tersedia.',
      });
    }

    const { messages, contextData } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Daftar pesan tidak valid.' });
    }

    let systemChatPrompt = `
Anda adalah "Detektif AI" dari aplikasi "Detektif Share" (Slogan: "Periksa Sebelum Berbagi!").
Anda sedang berbincang dengan siswa SMP di Indonesia (usia 12-15 tahun).
Karakter Anda:
- Ramah, sopan, bijak, hangat, dan suportif seperti kakak pembina OSIS atau detektif muda yang bersahabat.
- Gunakan bahasa Indonesia santun yang santai dan akrab bagi siswa SMP (misal menyapa dengan "Halo Sobat Detektif!", gunakan kalimat yang jelas, hindari istilah teknis rumit).
- JANGAN mengarang sumber berita, tautan palsu, atau fakta yang tidak dapat Anda verifikasi.
- Jika siswa menanyakan apakah suatu hal aman, berikan pertimbangan rasional dan jangan menjamin 100% jika bukti tidak lengkap.
- Jika terdapat tanda-tanda ancaman fisik, pemerasan foto/uang, perundungan berat, atau pelecehan, WAJIB ingatkan dengan tegas namun menenangkan agar siswa segera bercerita dan meminta perlindungan dari Guru BK, Wali Kelas, atau Orang Tua.
`;

    if (contextData) {
      systemChatPrompt += `\nKonteks konten yang baru saja diperiksa siswa:\n- Kategori Risiko: ${contextData.kategori_risiko || '-'}\n- Ringkasan: ${contextData.ringkasan || '-'}\n- Indikator: ${(contextData.alasan_indikator || []).join('; ')}\n- Bagian belum pasti: ${contextData.bagian_belum_pasti || '-'}\n`;
    }

    // Convert messages into contents format for generateContent
    const formattedContents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction: systemChatPrompt,
      },
    });

    const replyText = response.text || 'Maaf, Detektif belum bisa merespons pertanyaan itu saat ini. Coba tanyakan lagi ya!';
    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Error in chat:', error);
    return res.status(500).json({
      error: 'Terjadi masalah pada koneksi chat Detektif AI.',
      details: error?.message || 'Unknown error',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Detektif Share server running on port ${PORT} (dev mode: ${isDev})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
