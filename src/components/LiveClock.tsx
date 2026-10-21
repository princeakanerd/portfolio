"use client";

import { useEffect, useState } from "react";
import { person } from "@/lib/data";

const formatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: person.timezone,
});

/**
 * His local time, ticking. Rendered empty on the server and filled on mount so
 * the clock can never trip a hydration mismatch.
 */
export default function LiveClock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={`font-mono tabular-nums ${className}`} suppressHydrationWarning>
      {time ?? "--:--:--"}
    </span>
  );
}
