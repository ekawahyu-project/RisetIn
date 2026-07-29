import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Phone, Send, Plus, Smile } from "lucide-react";
import { useApp } from "../context/AppContext";
import { chatSeed } from "../data/mockData";
import Container from "../components/Container";

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { riset, berjalan, indBerjalan } = useApp();
  const proyek = [...berjalan, ...indBerjalan].find((p) => p.id === id);
  const r = proyek ? riset.find((x) => x.id === proyek.risetId) : null;
  const lawan = proyek ? proyek.perusahaan || r?.kampus : "Mitra";

  const [messages, setMessages] = useState(chatSeed);
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { id: "m" + Date.now(), from: "me", text, time: "09:4" + m.length }]);
    setText("");
  };

  if (!proyek) {
    return (
      <Container>
        <p className="py-16 text-center text-[13px] text-sub">Percakapan tidak ditemukan</p>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mx-auto flex h-[calc(100vh-9rem)] w-full flex-col overflow-hidden rounded-2xl bg-white dark:bg-[#101f2e] shadow-card dark:shadow-none dark:ring-1 dark:ring-white/5 lg:h-[calc(100vh-7rem)]">
        <div className="flex shrink-0 items-center gap-3 border-b border-line dark:border-white/10 px-4 py-3.5">
          <button onClick={() => navigate(-1)} className="tap flex h-8 w-8 items-center justify-center rounded-full hover:bg-sky-100 dark:hover:bg-white/10">
            <ChevronLeft size={19} />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
            {lawan?.[0] || "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-bold text-ink dark:text-white">{lawan}</p>
            <p className="text-[11px] text-leaf">Online</p>
          </div>
          <button className="tap flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 dark:bg-white/5 text-brand-700">
            <Phone size={15} />
          </button>
        </div>

        <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto bg-sky-50 dark:bg-white/5 p-5">
          <div className="flex justify-center">
            <span className="rounded-full bg-white dark:bg-[#101f2e] px-3 py-1 text-[11px] text-sub shadow-card dark:shadow-none dark:ring-1 dark:ring-white/5">Hari ini</span>
          </div>
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-card dark:shadow-none dark:ring-1 dark:ring-white/5 ${
                  m.from === "me" ? "rounded-br-md bg-brand-600 text-white" : "rounded-bl-md bg-white dark:bg-[#101f2e] text-ink dark:text-white"
                }`}
              >
                {m.text}
                <div className={`mt-1 text-right text-[10px] ${m.from === "me" ? "text-white/70" : "text-brand-300"}`}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2 border-t border-line dark:border-white/10 p-3">
          <button className="tap flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 dark:bg-white/5 text-brand-600">
            <Plus size={16} />
          </button>
          <div className="flex flex-1 items-center gap-2 rounded-full bg-sky-100 dark:bg-white/5 px-4 py-2.5">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ketik pesan di sini..."
              className="w-full bg-transparent text-[13px] text-ink dark:text-white placeholder:text-brand-300 focus:outline-none"
            />
            <Smile size={16} className="shrink-0 text-brand-300" />
          </div>
          <button onClick={send} className="tap flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
            <Send size={15} />
          </button>
        </div>
      </div>
    </Container>
  );
}
