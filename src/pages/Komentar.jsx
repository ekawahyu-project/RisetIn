import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, MessageCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import PageHeader from "../components/PageHeader";
import Container from "../components/Container";
import RisetThumb from "../components/RisetThumb";

export default function Komentar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { riset, comments, addComment, user } = useApp();
  const [text, setText] = useState("");

  const r = riset.find((x) => x.id === id);
  const list = comments[id] || [];

  if (!r) {
    return (
      <Container>
        <p className="py-16 text-center text-[13px] text-sub">Riset tidak ditemukan</p>
      </Container>
    );
  }

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addComment(id, text.trim());
    setText("");
  };

  return (
    <Container>
      <PageHeader title="Komentar" back subtitle={`${list.length} komentar pada riset ini`} />

      <div className="mx-auto max-w-2xl space-y-5">
        <button
          onClick={() => navigate(`/riset/${r.id}`)}
          className="tap lift flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-card dark:bg-[#101f2e]"
        >
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl">
            <RisetThumb img={r.img} imgUrl={r.imgUrl} kategori={r.kategori} className="h-full w-full" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-ink dark:text-white">{r.judul}</p>
            <p className="truncate text-[11.5px] text-sub">{r.kampus}</p>
          </div>
        </button>

        <form onSubmit={submit} className="rounded-2xl bg-white p-4 shadow-card dark:bg-[#101f2e]">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
              {user.inisial}
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tulis komentar atau pertanyaan Anda..."
              rows={3}
              className="input resize-none dark:bg-white/5 dark:border-white/10 dark:text-white"
            />
          </div>
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={!text.trim()}
              className="tap flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-[12.5px] font-bold text-white disabled:opacity-40"
            >
              <Send size={14} /> Kirim
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {list.length === 0 ? (
            <div className="flex flex-col items-center py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-card dark:bg-[#101f2e]">
                <MessageCircle size={22} className="text-brand-300" />
              </div>
              <p className="mt-3 text-[13px] text-sub">Belum ada komentar. Jadilah yang pertama berkomentar.</p>
            </div>
          ) : (
            list.map((c) => (
              <div key={c.id} className="fade-up flex gap-3 rounded-2xl bg-white p-4 shadow-card dark:bg-[#101f2e]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-[11px] font-bold text-white">
                  {c.inisial}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[13px] font-bold text-ink dark:text-white">{c.nama}</p>
                    <span className="shrink-0 text-[10.5px] text-brand-300">{c.time}</span>
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink/80 dark:text-white/75">{c.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Container>
  );
}
