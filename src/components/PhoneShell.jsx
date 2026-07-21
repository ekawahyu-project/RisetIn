import React from "react";
import { Wifi, Signal, BatteryFull } from "lucide-react";

export default function PhoneShell({ children }) {
  return (
    <div className="min-h-screen w-full bg-brand-900 flex items-center justify-center py-6 px-3 sm:py-10">
      <div className="relative w-full max-w-[420px]">
        <div className="rounded-[2.5rem] bg-brand-800 p-2 shadow-2xl">
          <div className="relative h-[820px] max-h-[88vh] w-full overflow-hidden rounded-[2rem] bg-sky-50 flex flex-col">
            {/* status bar */}
            <div className="flex shrink-0 items-center justify-between px-6 pt-3 pb-1 text-[13px] font-semibold text-ink z-20">
              <span>9:41</span>
              <div className="absolute left-1/2 top-1.5 h-5 w-28 -translate-x-1/2 rounded-full bg-black/90" />
              <div className="flex items-center gap-1.5">
                <Signal size={14} strokeWidth={2.5} />
                <Wifi size={14} strokeWidth={2.5} />
                <BatteryFull size={16} strokeWidth={2} />
              </div>
            </div>
            <div className="relative flex-1 overflow-hidden">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
