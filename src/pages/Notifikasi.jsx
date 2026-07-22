import React, { useEffect } from "react";
import { Info, MessageCircle, HandHeart, PartyPopper } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Container from "../components/Container";
import { useApp } from "../context/AppContext";

const iconFor = {
  success: { Icon: PartyPopper, cls: "bg-leaf/10 text-leaf" },
  info: { Icon: Info, cls: "bg-brand-500/10 text-brand-600" },
  chat: { Icon: MessageCircle, cls: "bg-gold/10 text-gold" },
  request: { Icon: HandHeart, cls: "bg-berry/10 text-berry" },
};

export default function Notifikasi() {
  const { notifications, markAllRead } = useApp();

  useEffect(() => {
    markAllRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <PageHeader title="Notifikasi" subtitle="Pembaruan seputar riset dan kolaborasi Anda" />
      <div className="space-y-3">
        {notifications.map((n, i) => {
          const { Icon, cls } = iconFor[n.type] || iconFor.info;
          return (
            <div
              key={n.id}
              style={{ animationDelay: `${i * 40}ms` }}
              className="fade-up flex gap-3 rounded-2xl bg-white p-4 shadow-card dark:bg-[#101f2e] dark:ring-1 dark:ring-white/5 sm:p-5"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cls}`}>
                <Icon size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13.5px] font-bold leading-snug text-ink dark:text-white">{n.title}</p>
                  {n.unread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-berry" />}
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-sub">{n.body}</p>
                <p className="mt-2 text-[11px] text-brand-400">{n.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
