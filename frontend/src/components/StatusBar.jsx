import { useEffect, useState } from "react";

/**
 * Top status bar — mimics a tactical HUD readout: system name, live
 * clock, and a pulsing "LIVE" indicator to reinforce that this is a
 * monitoring system, not a static report.
 */
export default function StatusBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatted = time.toUTCString().split(" ").slice(0, 5).join(" ");

  return (
    <header className="border-b border-hud-line bg-hud-panel/60 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-hud-green shadow-glow animate-blink" />
        <span className="font-display font-700 text-lg tracking-widest text-hud-green">
          SENTRY
        </span>
        <span className="text-hud-dim text-xs tracking-wider hidden sm:inline">
          // BORDER ANOMALY DETECTION SYSTEM
        </span>
      </div>
      <div className="text-xs text-hud-dim tracking-wider">{formatted} UTC</div>
    </header>
  );
}
