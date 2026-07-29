import React from "react";
import {
  SlidersHorizontal,
  ShieldCheck,
  Lock,
  Blocks,
  MessageSquareText,
  Eye,
  Languages,
  Accessibility,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import Container from "../components/Container";

const items = [
  { icon: SlidersHorizontal, label: "Preferensi akun" },
  { icon: ShieldCheck, label: "Login & Keamanan" },
  { icon: Lock, label: "Privasi data" },
  { icon: Blocks, label: "Otorisasi aplikasi" },
  { icon: MessageSquareText, label: "Obrolan" },
  { icon: Eye, label: "Tampilan" },
  { icon: Accessibility, label: "Aksesibilitas" },
  { icon: Languages, label: "Bahasa" },
  { icon: HelpCircle, label: "Bantuan" },
];

export default function Pengaturan() {
  return (
    <Container wide>
      <PageHeader title="Pengaturan" back />
      <div className="grid gap-3 w-full rounded-2xl bg-white dark:bg-[#101f2e] p-3 shadow-card dark:shadow-none dark:ring-1 dark:ring-white/5 sm:grid-cols-2 sm:p-4">
        {items.map((it) => (
          <button key={it.label} className="tap flex items-center gap-3 rounded-xl px-3 py-3.5 text-left hover:bg-sky-50 dark:hover:bg-white/10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 dark:bg-white/5 text-brand-600">
              <it.icon size={17} />
            </div>
            <span className="flex-1 text-[13.5px] font-medium text-ink dark:text-white">{it.label}</span>
            <ChevronRight size={16} className="text-brand-300" />
          </button>
        ))}
      </div>
    </Container>
  );
}
