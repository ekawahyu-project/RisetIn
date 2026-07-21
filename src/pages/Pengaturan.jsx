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
    <Container>
      <PageHeader title="Pengaturan" back />
      <div className="grid gap-3 rounded-2xl bg-white p-3 shadow-card sm:grid-cols-2 sm:p-4">
        {items.map((it) => (
          <button key={it.label} className="tap flex items-center gap-3 rounded-xl px-3 py-3.5 text-left hover:bg-sky-50">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-brand-600">
              <it.icon size={17} />
            </div>
            <span className="flex-1 text-[13.5px] font-medium text-ink">{it.label}</span>
            <ChevronRight size={16} className="text-brand-300" />
          </button>
        ))}
      </div>
    </Container>
  );
}
