export interface TextSample {
  id: string;
  title: string;
  tag: string;
  badgeColor: string;
  text: string;
  description: string;
}

export const SAMPLE_TEXTS: TextSample[] = [
  {
    id: 'kuota-phishing',
    title: 'Penipuan Kuota Belajar 50GB',
    tag: 'Waspada Phishing',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    description: 'Modus pesan berantai iming-iming bantuan kuota internet gratis dari Kemdikbud.',
    text: `🚨 RESMI KEMDIKBUD BAGI-BAGI KUOTA BELAJAR 50GB & PULSA 100RB TAHUN AJARAN INI! 🚨

Khusus untuk seluruh siswa SD, SMP, SMA dan Guru di Indonesia!
Klaim segera sebelum tanggal 25 bulan ini! Batas kuota terbatas hanya untuk 10.000 pendaftar pertama!

👉 Klik link pendaftaran di bawah ini:
http://kemdikbud-kuota-gratis-terbaru2026.online/klaim-sekarang?user=smp

Bagikan pesan ini ke 5 grup WhatsApp kamu agar kuota langsung aktif dalam 5 menit. Jangan sampai ketinggalan!`,
  },
  {
    id: 'cyberbullying-ancaman',
    title: 'Cyberbullying & Ancaman di Grup',
    tag: 'Bullying / Pelecehan',
    badgeColor: 'bg-red-100 text-red-800 border-red-200',
    description: 'Pesan perundungan siber yang menghina fisik dan mengancam siswa di luar sekolah.',
    text: `Eh lu jangan sok jagoan ya di kelas! Udah jelek, item, miskin lagi. Nama bapak lu si Joko tukang rongsok kan? Hahaha najis banget. Besok pulang sekolah lu tunggu di gerbang belakang samping warnet, awas aja kalo lu kabur atau ngadu ke bu guru, foto aib lu bakal kita sebarin ke seluruh angkatan biar lu malu seumur hidup!`,
  },
  {
    id: 'hoaks-bencana',
    title: 'Hoaks Gempa & Tsunami Megathrust',
    tag: 'Disinformasi Bencana',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
    description: 'Broadcast berantai tanpa konfirmasi BMKG yang memicu kepanikan warga sekolah.',
    text: `PENTING DARI BMKG PUSAT & KEPOLISIAN!! ⚠️⚠️
Diberitahukan kepada seluruh warga dan wali murid, malam ini pukul 02.30 WIB dini hari akan terjadi gempa susulan megathrust berkekuatan 8.9 SR yang berpotensi tsunami besar setinggi 15 meter.
Semua warga diimbau keluar rumah dan mematikan seluruh aliran listrik serta kompor sekarang juga.
Tolong teruskan pesan ini ke semua keluarga dan grup WA agar selamat!! JANGAN DIHAPUS SEBELUM DIBAGIKAN!`,
  },
  {
    id: 'pengumuman-osis',
    title: 'Pengumuman Resmi Rapat OSIS',
    tag: 'Informasi Resmi Sekolah',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'Informasi kegiatan rapat persiapan lomba Class Meeting dari pengurus OSIS.',
    text: `Assalamu'alaikum Wr. Wb. dan salam sejahtera untuk teman-teman pengurus OSIS SMP Negeri 1.
Mengingatkan kembali bahwa hari Jumat, 24 Oktober 2026 pukul 14.00 WIB (setelah sholat Jumat), kita akan mengadakan rapat koordinasi panitia Class Meeting semester ganjil di Ruang Rapat OSIS lantai 2.
Agenda rapat:
1. Pembagian jadwal cabang olahraga dan e-sport
2. Anggaran hadiah dan sertifikat
Bagi perwakilan seksi bidang diharapkan hadir tepat waktu dan membawa buku catatan.
Terima kasih,
Ketua OSIS - Raka Pratama
(Pembina OSIS: Bpk. Haryanto, S.Pd)`,
  },
];

// Helper to generate sample image data URLs (SVG converted to base64) for instant testing
export function createSampleImageBase64(type: 'giveaway' | 'bullying' | 'osis'): { base64: string; mimeType: string; note: string } {
  let svg = '';
  let note = '';

  if (type === 'giveaway') {
    note = 'Screenshot pesan DM Instagram dari akun mengatasnamakan undian smartphone gratis.';
    svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="700" viewBox="0 0 600 700">
      <rect width="600" height="700" fill="#1e1e2d"/>
      <rect x="30" y="30" width="540" height="640" rx="20" fill="#2b2b3d" stroke="#3b3b52" stroke-width="2"/>
      <circle cx="80" cy="80" r="30" fill="#ec4899"/>
      <text x="80" y="88" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">🎁</text>
      <text x="130" y="75" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#ffffff">Official_Giveaway_ID</text>
      <text x="130" y="98" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af">Pesan Langsung (DM)</text>
      
      <rect x="50" y="140" width="500" height="420" rx="16" fill="#1a1a24" stroke="#ff4444" stroke-width="2"/>
      <text x="75" y="180" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#ff4444">SELAMAT! KAMU MEMENANGKAN IPHONE 16 PRO MAX!</text>
      <text x="75" y="220" font-family="Arial, sans-serif" font-size="15" fill="#e5e7eb">Halo kak! Akun kamu terpilih sebagai pemenang</text>
      <text x="75" y="245" font-family="Arial, sans-serif" font-size="15" fill="#e5e7eb">undian spesial akhir tahun dari sponsor kami.</text>
      
      <rect x="75" y="280" width="450" height="90" rx="12" fill="#312e81"/>
      <text x="95" y="315" font-family="Arial, sans-serif" font-size="14" fill="#a5b4fc">Syarat pengambilan hadiah:</text>
      <text x="95" y="340" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#ffffff">1. Transfer biaya admin pengiriman Rp 150.000</text>
      <text x="95" y="360" font-family="Arial, sans-serif" font-size="13" fill="#fca5a5">2. Batas waktu hanya 30 menit! Jika lewat hadiah hangus!</text>
      
      <text x="75" y="410" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af">Kirim foto KTP orang tua kamu &amp; bukti transfer ke no WA:</text>
      <text x="75" y="440" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#38bdf8">WA: 0895-3921-XXXX (Admin Klaim Cepat)</text>
      
      <rect x="75" y="470" width="450" height="45" rx="8" fill="#e11d48"/>
      <text x="300" y="498" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">KLIK TAUTAN INI UNTUK VERIFIKASI SEKARANG</text>
      <text x="300" y="540" font-family="Arial, sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">http://undian-hadiah-cepat-resmi.xyz/login</text>
    </svg>
    `;
  } else if (type === 'bullying') {
    note = 'Tangkapan layar obrolan grup WhatsApp berisi ejekan dan doxxing nomor telepon.';
    svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="700" viewBox="0 0 600 700">
      <rect width="600" height="700" fill="#0b141a"/>
      <!-- Header WA -->
      <rect width="600" height="80" fill="#202c33"/>
      <circle cx="50" cy="40" r="22" fill="#00a884"/>
      <text x="50" y="47" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">7B</text>
      <text x="85" y="38" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#e9edef">Grup Murid Kelas 7B (No Guru)</text>
      <text x="85" y="58" font-family="Arial, sans-serif" font-size="13" fill="#8696a0">32 peserta</text>
      
      <!-- Bubble Chat 1 -->
      <rect x="40" y="120" width="420" height="95" rx="12" fill="#202c33"/>
      <text x="60" y="145" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#53bdeb">+62 812-3490-xxxx</text>
      <text x="60" y="170" font-family="Arial, sans-serif" font-size="14" fill="#e9edef">Woy liat deh si Budi kemarin nangis gara2 diomongin</text>
      <text x="60" y="195" font-family="Arial, sans-serif" font-size="14" fill="#e9edef">anak manja cengeng banget dah haha 🤣</text>
      
      <!-- Bubble Chat 2 -->
      <rect x="40" y="240" width="460" height="150" rx="12" fill="#202c33"/>
      <text x="60" y="265" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#e542a3">Fajar (Ketua Geng Belakang)</text>
      <text x="60" y="290" font-family="Arial, sans-serif" font-size="14" fill="#e9edef">Ini no HP bapaknya sama alamat rumahnya:</text>
      <text x="60" y="315" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#ff7675">0813-8899-xxxx (Jl. Melati No. 14 RT 02)</text>
      <text x="60" y="340" font-family="Arial, sans-serif" font-size="14" fill="#e9edef">Yuk kita spam orderan fiktif biar kapok tuh anak!</text>
      <text x="60" y="365" font-family="Arial, sans-serif" font-size="13" fill="#ff4d4d">Siapa yg temenan sm Budi gue musuhin!</text>
      
      <!-- Bubble Chat 3 -->
      <rect x="40" y="420" width="380" height="80" rx="12" fill="#202c33"/>
      <text x="60" y="445" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#00a884">Riko</text>
      <text x="60" y="475" font-family="Arial, sans-serif" font-size="14" fill="#e9edef">Gaskeun spam terus lur wkwkwk</text>
    </svg>
    `;
  } else {
    note = 'Poster pengumuman mading digital sekolah terkait jadwal ujian tengah semester.';
    svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="700" viewBox="0 0 600 700">
      <rect width="600" height="700" fill="#f8fafc"/>
      <rect x="30" y="30" width="540" height="640" rx="20" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
      <rect x="30" y="30" width="540" height="110" rx="20" fill="#1e40af"/>
      <text x="300" y="75" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#ffffff" text-anchor="middle">SMP NEGERI INDONESIA HEBAT</text>
      <text x="300" y="105" font-family="Arial, sans-serif" font-size="15" fill="#bfdbfe" text-anchor="middle">Jadwal Sumatif Tengah Semester (STS) Genap</text>
      
      <rect x="60" y="170" width="480" height="260" rx="12" fill="#f1f5f9" stroke="#e2e8f0"/>
      <text x="80" y="205" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#1e293b">Pemberitahuan Resmi Sekolah:</text>
      <text x="80" y="240" font-family="Arial, sans-serif" font-size="14" fill="#334155">• Pelaksanaan: 10 - 15 Maret 2026</text>
      <text x="80" y="270" font-family="Arial, sans-serif" font-size="14" fill="#334155">• Siswa hadir pukul 07.00 WIB berseragam lengkap</text>
      <text x="80" y="300" font-family="Arial, sans-serif" font-size="14" fill="#334155">• Kartu peserta ujian dicetak melalui wali kelas masing-masing</text>
      <text x="80" y="330" font-family="Arial, sans-serif" font-size="14" fill="#334155">• Tidak dipungut biaya apapun (Gratis)</text>
      <text x="80" y="380" font-family="Arial, sans-serif" font-size="13" font-style="italic" fill="#64748b">Informasi valid hanya diumumkan di mading sekolah &amp; situs resmi smphebat.sch.id</text>

      <line x1="60" y1="460" x2="540" y2="460" stroke="#e2e8f0" stroke-width="2"/>
      <text x="80" y="510" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Kepala Sekolah,</text>
      <text x="80" y="580" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#1e40af">Drs. H. Mulyono, M.Pd</text>
      <text x="80" y="600" font-family="Arial, sans-serif" font-size="12" fill="#64748b">NIP. 19740512 199903 1 002</text>
    </svg>
    `;
  }

  // Convert SVG string to base64
  const base64 = btoa(unescape(encodeURIComponent(svg)));
  return {
    base64: `data:image/svg+xml;base64,${base64}`,
    mimeType: 'image/svg+xml',
    note,
  };
}
