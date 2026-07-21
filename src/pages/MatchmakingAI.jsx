import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Plus, Mic, ArrowUp } from "lucide-react";
import { useApp } from "../context/AppContext";
import { matchmakingResults } from "../data/mockData";
import RisetThumb from "../components/RisetThumb";
import { CategoryBadge } from "../components/Badge";
import Container from "../components/Container";
import PageHeader from "../components/PageHeader";

export default function MatchmakingAI() {
  const navigate = useNavigate();
  const { riset } = useApp();
  const [text, setText] = useState("");
  const [stage, setStage] = useState("idle"); // idle | thinking | result
  const [query, setQuery] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    setQuery(text);
    setText("");
    setStage("thinking");
    setTimeout(() => setStage("result"), 1300);
  };

  return (
    <Container wide>
      <PageHeader title="Matchmaking AI" subtitle="Ceritakan kebutuhan bisnis Anda, temukan riset yang paling cocok" />

      <div className="mx-auto flex h-[calc(100vh-11rem)] max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-card lg:h-[calc(100vh-9rem)]">
        <div className="no-scrollbar flex-1 overflow-y-auto p-6">
          {stage === "idle" && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-soft">
                <Sparkles size={24} />
              </div>
              <p className="max-w-xs text-[16px] font-bold text-ink">Temukan kecocokan riset dengan kebutuhan industri</p>
              <p className="max-w-sm text-[12.5px] text-sub">
                Contoh: "Lahan pertanian industri kami butuh modernisasi manajemen air yang adaptif dan hemat."
              </p>
            </div>
          )}

          {stage !== "idle" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-brand-600 px-4 py-3 text-[13px] leading-relaxed text-white shadow-card fade-up">
                  {query}
                </div>
              </div>

              {stage === "thinking" && (
                <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-md bg-sky-50 px-4 py-3 shadow-card">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-300 [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-300 [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-300" />
                </div>
              )}

              {stage === "result" && (
                <div className="fade-up space-y-4">
                  <p className="text-[13px] leading-relaxed text-ink">
                    Berikut adalah hasil rekomendasi berdasarkan Matchmaking AI dari kebutuhan yang telah Anda ceritakan.
                  </p>
                  <p className="text-[13.5px] font-bold text-ink">Hasil Rekomendasi</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {matchmakingResults.map((m) => {
                      const r = riset.find((x) => x.id === m.risetId);
                      if (!r) return null;
                      return (
                        <button
                          key={m.risetId}
                          onClick={() => navigate(`/riset/${r.id}`)}
                          className="tap flex w-full items-center gap-3 rounded-2xl bg-sky-50 p-3 text-left"
                        >
                          <RisetThumb img={r.img} kategori={r.kategori} className="h-14 w-14 shrink-0 rounded-xl" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[12.5px] font-semibold text-ink">{r.judul}</p>
                            <p className="truncate text-[11px] text-sub">{r.kampus}</p>
                            <div className="mt-1.5 flex items-center gap-1.5">
                              <CategoryBadge kategori={r.kategori} />
                              <span className="rounded-full bg-leaf/10 px-2 py-0.5 text-[10.5px] font-bold text-leaf">
                                Kecocokan {m.score}%
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-line p-4">
          <div className="mx-auto flex max-w-xl items-center gap-2 rounded-full bg-sky-100 px-4 py-2">
            <button className="tap flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-brand-600">
              <Plus size={15} />
            </button>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Ceritakan kebutuhan Anda"
              className="w-full bg-transparent py-1.5 text-[13px] text-ink placeholder:text-brand-300 focus:outline-none"
            />
            <button className="tap shrink-0 text-brand-400">
              <Mic size={17} />
            </button>
            {text && (
              <button onClick={submit} className="tap flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                <ArrowUp size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
