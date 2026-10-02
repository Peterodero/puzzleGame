"use client";

import { useEffect, useRef } from "react";

interface TimerProps {
  secondsLeft: number;
  totalSeconds: number;
  running: boolean;
  onTick: (nextSecondsLeft: number) => void;
  onExpire: () => void;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function Timer({
  secondsLeft,
  totalSeconds,
  running,
  onTick,
  onExpire,
}: TimerProps) {
  const expiredRef = useRef(false);

  /* Tick every second */
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      onTick(Math.max(0, secondsLeft - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [running, secondsLeft, onTick]);

  /* Trigger expiry exactly once when the counter hits 0 */
  useEffect(() => {
    if (secondsLeft <= 0 && running && !expiredRef.current) {
      expiredRef.current = true;
      onExpire();
    }
    if (secondsLeft > 0) expiredRef.current = false;
  }, [secondsLeft, running, onExpire]);

  const ratio  = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
  const urgent = ratio <= 0.2;

  return (
    <div
      className="shrink-0 flex flex-col items-center justify-center
                 bg-white rounded-2xl shadow-lg border border-neutral-200"
      style={{
        minWidth: "clamp(140px, 10vw, 260px)",
        padding: "clamp(0.6rem, 1.5vh, 1.2rem) clamp(1rem, 2.5vw, 2rem)",
      }}
    >
      {/* Label */}
      <span className="font-black uppercase tracking-widest text-neutral-500"
            style={{ fontSize: "clamp(0.6rem, 1vw, 0.8rem)" }}>
        TIME REMAINING
      </span>

      {/* Digits */}
      <span
        className={`font-mono font-black tabular-nums leading-none transition-colors
                    ${urgent ? "text-[#e30613] animate-pulse" : "text-neutral-900"}`}
        style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)", marginTop: "0.2rem" }}
      >
        {formatTime(secondsLeft)}
      </span>

      {/* Progress bar */}
      <div className="w-full mt-2 rounded-full bg-neutral-200 overflow-hidden"
           style={{ height: "clamp(6px, 0.8vw, 12px)" }}>
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear
                      ${urgent ? "bg-[#e30613]" : "bg-emerald-500"}`}
          style={{ width: `${Math.max(0, Math.min(100, ratio * 100))}%` }}
        />
      </div>
    </div>
  );
}
