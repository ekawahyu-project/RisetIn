import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Plus, ArrowUp, AlertCircle, RotateCcw } from "lucide-react";
import { useApp } from "../context/AppContext";
import { apiFetch } from "../lib/api";
import RisetThumb from "../components/RisetThumb";
import { CategoryBadge } from "../components/Badge";
import Container from "../components/Container";
import PageHeader from "../components/PageHeader";

const SUGGESTIONS = [
  "Lahan pertanian industri kami butuh modernisasi manajemen air yang hemat dan bisa jalan tanpa listrik PLN.",
  "Pabrik makanan kami butuh otomasi pengecekan kualitas produk dan sortasi bahan baku.",
  "Kami mencari solusi kemasan ramah lingkungan untuk UMKM pangan dan pemantauan polusi udara.",
];

export default function MatchmakingAI() {
  const navigate = useNavigate();
  const { riset } = useApp();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, loading]);

  const submit = async (overrideText) => {
    const prompt = (overrideText ?? text).trim();
    if (!prompt || loading) return;

    const history = messages
      .filter((m) => !m.error)
      .map((m) => ({ role: m.role, text: m.text }));

    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", text: prompt }]);
    setText("");
    setLoading(true);

    try {
      const data = await apiFetch("/api/matchmaking", {
        method: "POST",
        body: { query: prompt, history },
      });
      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          role: "model",
          text: data.reply,
          matches: data.matches || [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: "model",
          error: true,
          text: err.message || "Gagal memproses Matchmaking AI. Coba lagi.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    if (loading) return;
    setMessages([]);
    setText("");
  };

  return (
    <Container wide>
      <PageHeader
        title="Matchmaking AI"
        subtitle="Didukung Gemini AI — ceritakan kebutuhan bisnis Anda untuk menemukan riset kampus paling relevan"
        actions={
          messages.length > 0 && (
            <button
              onClick={resetChat}
              className="tap flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-[12px] font-semibold text-brand-700 shadow-card hover:bg-sky-50"
            >
              <RotateCcw size={13} /> Percakapan Baru
            </button>
          )
        }
      />

      <div className="mx-auto flex h-[calc(100vh-11rem)] w-full flex-col overflow-hidden rounded-2xl bg-white dark:bg-[#101f2e] shadow-card dark:shadow-none dark:ring-1 dark:ring-white/5 lg:h-[calc(100vh-9rem)]">
        <div className="no-scrollbar flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-soft">
                <Sparkles size={24} />
              </div>
              <div>
                <p className="mx-auto max-w-xs text-[16px] font-bold text-ink dark:text-white">
                  Temukan kecocokan riset dengan kebutuhan industri
                </p>
                <p className="mx-auto mt-1.5 max-w-md text-[12.5px] text-sub">
                  Gemini AI akan menganalisis kebutuhan Anda terhadap seluruh katalog riset di database RisetIn.
                </p>
              </div>
              <div className="mt-2 grid w-full max-w-2xl gap-2 sm:grid-cols-3">
                {SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => submit(s)}
                    className="tap rounded-xl border border-line bg-sky-50/70 p-3 text-left text-[12px] leading-relaxed text-ink/80 transition-colors hover:border-brand-300 hover:bg-sky-100/70"
                  >
                    &ldquo;{s}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((msg) =>
                msg.role === "user" ? (
                  <div key={msg.id} className="flex justify-end">
                    <div className="fade-up max-w-[80%] rounded-2xl rounded-br-md bg-brand-600 px-4 py-3 text-[13px] leading-relaxed text-white shadow-card">
                      {msg.text}
                    </div>
                  </div>
                ) : msg.error ? (
                  <div
                    key={msg.id}
                    className="fade-up flex max-w-xl items-start gap-2.5 rounded-2xl rounded-bl-md border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700"
                  >
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                ) : (
                  <div key={msg.id} className="fade-up space-y-3">
                    <div className="max-w-2xl rounded-2xl rounded-bl-md bg-sky-50 px-4 py-3 text-[13px] leading-relaxed text-ink dark:bg-white/5 dark:text-white">
                      {msg.text}
                    </div>

                    {msg.matches?.length > 0 && (
                      <div className="space-y-2.5">
                        <p className="text-[13px] font-bold text-ink dark:text-white">
                          Rekomendasi Riset ({msg.matches.length})
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {msg.matches.map((m) => {
                            const r = m.riset || riset.find((x) => x.id === m.risetId);
                            if (!r) return null;
                            return (
                              <button
                                key={m.risetId}
                                onClick={() => navigate(`/riset/${r.id}`)}
                                className="tap flex w-full flex-col gap-2 rounded-2xl bg-sky-50 p-3.5 text-left transition-colors hover:bg-sky-100/80 dark:bg-white/5"
                              >
                                <div className="flex w-full items-center gap-3">
                                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                                    <RisetThumb img={r.img} imgUrl={r.imgUrl} kategori={r.kategori} className="h-full w-full" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-[12.5px] font-semibold text-ink dark:text-white">{r.judul}</p>
                                    <p className="truncate text-[11px] text-sub">{r.kampus}</p>
                                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                      <CategoryBadge kategori={r.kategori} />
                                      <span className="rounded-full border border-brand-600 px-2 py-0.5 text-[10.5px] font-bold text-brand-600">
                                        Kecocokan {m.score}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {m.reason && (
                                  <p className="text-[11.5px] leading-relaxed text-sub">{m.reason}</p>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}

              {loading && (
                <div className="flex w-fit items-center gap-2 rounded-2xl rounded-bl-md bg-sky-50 dark:bg-white/5 px-4 py-3 text-[12px] text-sub shadow-card">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-400 [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-400 [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-400" />
                  <span className="ml-1">Gemini AI sedang mencocokkan riset...</span>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-line dark:border-white/10 p-4">
          <div className="flex w-full items-center gap-2 rounded-full bg-sky-100 dark:bg-white/5 px-4 py-2">
            <button
              type="button"
              title="Percakapan baru"
              onClick={resetChat}
              className="tap flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white dark:bg-[#101f2e] text-brand-600"
            >
              <Plus size={15} />
            </button>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              disabled={loading}
              placeholder="Ceritakan kebutuhan bisnis atau tantangan operasional Anda..."
              className="w-full bg-transparent py-1.5 text-[13px] text-ink dark:text-white placeholder:text-brand-300 focus:outline-none disabled:opacity-60"
            />
            {text.trim() && (
              <button
                type="button"
                onClick={() => submit()}
                disabled={loading}
                className="tap flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white disabled:opacity-50"
              >
                <ArrowUp size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
