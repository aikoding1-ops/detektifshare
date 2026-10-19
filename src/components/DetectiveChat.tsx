import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle, PhoneCall, RotateCcw, HelpCircle } from 'lucide-react';
import { AnalysisResult, ChatMessage } from '../types';

interface DetectiveChatProps {
  currentContext: AnalysisResult | null;
  onOpenHelp: () => void;
}

export const DetectiveChat: React.FC<DetectiveChatProps> = ({
  currentContext,
  onOpenHelp,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      role: 'assistant',
      text: currentContext
        ? `Halo Sobat Detektif! 🕵️‍♂️ Kamu baru saja memeriksa konten "${currentContext.judul_temuan}" dengan status: ${currentContext.kategori_risiko}. Ada bagian yang ingin kamu tanyakan lebih dalam, misalnya cara lapor atau memastikan sumbernya?`
        : 'Halo Sobat Detektif! 🕵️‍♂️ Aku siap membantumu memahami bahaya di media sosial, cara mengecek hoaks, atau langkah aman saat ada pesan mencurigakan. Mau tanya apa hari ini?',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Quick starter questions tailored for Indonesian junior high students
  const quickQuestions = [
    'Bagaimana cara memastikan berita itu bukan hoaks?',
    'Apa bahayanya mengklik link dari nomor tak dikenal?',
    'Bagaimana cara lapor ke guru jika ada teman di-bully di grup?',
    'Apa tanda-tanda akun medsos teman sedang diretas (di-hack)?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isSending) return;

    setErrorMsg(null);
    setInput('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);

    try {
      // Prepare history for API
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        text: m.text,
      }));
      historyPayload.push({ role: 'user', text: query });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          contextData: currentContext || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menghubungi Detektif AI.');
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: data.reply || 'Maaf, Detektif belum bisa menjawab saat ini. Coba tanyakan lagi ya!',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMsg(err.message || 'Terjadi gangguan saat berbicara dengan Detektif AI.');
    } finally {
      setIsSending(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        text: 'Obrolan telah direset. Ada hal lain tentang keamanan media sosial yang ingin kamu diskusikan?',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col h-[650px] max-h-[80vh] overflow-hidden">
      
      {/* Chat Header */}
      <div className="px-5 py-4 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
              <span>Tanya Detektif AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-xs text-slate-500">
              {currentContext
                ? `Membahas: "${currentContext.judul_temuan.slice(0, 30)}..."`
                : 'Konsultasi keamanan siber & literasi digital siswa'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenHelp}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Minta Bantuan</span>
          </button>
          <button
            onClick={handleResetChat}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            title="Reset percakapan"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.role === 'user'
                  ? 'bg-slate-800 text-white'
                  : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-xs'
                  : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200/60'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>
              <div
                className={`text-[10px] mt-1.5 ${
                  msg.role === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-200">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-100 rounded-2xl rounded-tl-xs px-4 py-3 border border-slate-200/60 text-xs text-slate-500 flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              <span>Detektif sedang menyusun jawaban...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions pills */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          Tanya Cepat:
        </span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(q)}
            disabled={isSending}
            className="shrink-0 px-3 py-1 rounded-full text-xs bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input box */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        {errorMsg && (
          <div className="mb-2 p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan hal yang membuatmu ragu atau khawatir..."
            disabled={isSending}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100/80 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-all"
          />
          <button
            type="submit"
            disabled={isSending || !input.trim()}
            className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-md shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            title="Kirim pertanyaan"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
