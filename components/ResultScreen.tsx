"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { DISCOUNT_LADDER } from "@/lib/puzzle";
import { playSound } from "@/lib/sound";

interface ResultScreenProps {
  won: boolean;
  imageUrl: string;
  awardedDiscount: number | null;
  onPlayAgain: () => void;
}

export default function ResultScreen({
  won,
  imageUrl,
  awardedDiscount,
  onPlayAgain,
}: ResultScreenProps) {

  /* Fire win or lose sound on mount */
  useEffect(() => {
    playSound(won ? "win" : "lose");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Fire celebration confetti on win */
  useEffect(() => {
    if (!won) return;
    try {
      /* First burst */
      confetti({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.55 },
        colors: ["#e30613", "#10b981", "#ffd700", "#ffffff", "#3b82f6"],
      });
      /* Second burst after short delay for a layered effect */
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 60,
          angle: 60,
          origin: { x: 0.1, y: 0.6 },
          colors: ["#e30613", "#ffd700", "#ffffff"],
        });
        confetti({
          particleCount: 80,
          spread: 60,
          angle: 120,
          origin: { x: 0.9, y: 0.6 },
          colors: ["#e30613", "#ffd700", "#ffffff"],
        });
      }, 400);
    } catch {
      /* canvas-confetti unavailable — fail silently */
    }
  }, [won]);

  return (
    <div
      className={`w-full flex flex-col items-center text-center mx-auto
                  ${won ? "animate-pop-in" : "animate-shake"}`}
      style={{
        gap: "clamp(0.25rem, 0.6vh, 0.55rem)",
        maxWidth: "min(90vw, calc(40vh + 2rem), 540px)",
      }}
    >

      {/* ── Status banner ─────────────────────────────────────────── */}
      <div
        className={`rounded-full font-black uppercase tracking-widest text-white shadow-lg
                    ${won
                      ? "bg-emerald-600 shadow-emerald-950/50"
                      : "bg-[#e30613] shadow-red-950/50"}`}
        style={{
          fontSize: "clamp(0.65rem, 1.2vw, 0.95rem)",
          padding:  "clamp(0.3rem, 0.8vh, 0.6rem) clamp(1.2rem, 3vw, 2.2rem)",
        }}
      >
        {won ? "VICTORY — REWARD UNLOCKED!" : "TIME EXPIRED"}
      </div>

      {/* ── Outcome headline & message ─────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(0.1rem, 0.3vh, 0.3rem)" }}>
        <h1
          className={`font-black tracking-tight leading-none
                      ${won ? "text-emerald-400" : "text-rose-400"}`}
          style={{ fontSize: "clamp(1.3rem, 3.2vw, 2.4rem)" }}
        >
          {won ? "YOU MATCHED IT!" : "Time Beat You This Round"}
        </h1>
        <p className="text-slate-300 font-medium leading-tight"
           style={{ fontSize: "clamp(0.7rem, 1.3vw, 1.0rem)", maxWidth: "38ch", margin: "0 auto" }}>
          {won
            ? "Fantastic! You rebuilt the Colgate campaign poster before time ran out."
            : "The clock ran out before all tiles were matched. Give it another shot!"}
        </p>
      </div>

      {/* ── Physical display unit — discount reveal ───────────────── */}
      <div
        className={`w-full overflow-hidden rounded-2xl border-4 bg-slate-900 shadow-2xl transition-all
                    ${won
                      ? "border-emerald-500/80 animate-victory-glow"
                      : "border-red-500/60 animate-defeat-pulse"}`}
      >

        {/* Unit header */}
        <div className="bg-[#e30613] text-center text-white border-b-2 border-red-700"
             style={{ padding: "clamp(0.2rem, 0.6vh, 0.5rem) 1rem" }}>
          <p className="font-black italic tracking-tight leading-none"
             style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.8rem)" }}>
            Colgate
          </p>
          <p className="font-bold tracking-widest uppercase opacity-90"
             style={{ fontSize: "clamp(0.4rem, 0.75vw, 0.65rem)", marginTop: "0.05rem" }}>
            MORE TO SMILE ABOUT
          </p>
        </div>

        {/* 4×4 discount-ladder grid */}
        <div className="bg-slate-950 flex justify-center"
             style={{ padding: "clamp(2px, 0.3vh, 5px)" }}>
          <div
            className="grid grid-cols-4 bg-slate-900 rounded-xl"
            style={{
              width:  "min(80vw, 28vh, 380px)",
              height: "min(80vw, 28vh, 380px)",
              gap:     "clamp(2px, 0.3vmin, 4px)",
              padding: "clamp(2px, 0.3vmin, 4px)",
              gridTemplateRows: "repeat(4, 1fr)",
            }}
          >
            {DISCOUNT_LADDER.map((value) => {
              const isAward = won && value === awardedDiscount;
              return (
                <div
                  key={value}
                  className={[
                    "flex flex-col items-center justify-center rounded-lg",
                    "transition-all duration-300 select-none border",
                    isAward
                      ? "bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 text-white border-emerald-300 shadow-xl ring-4 ring-emerald-400/60 scale-105 z-10 animate-badge-award"
                      : "bg-slate-900 border-white/10 text-rose-500 opacity-85",
                  ].join(" ")}
                >
                  <span
                    className={`font-black tracking-tighter leading-none
                                ${isAward ? "text-white" : "text-rose-400"}`}
                    style={{ fontSize: "clamp(0.75rem, 1.8vmin, 1.3rem)" }}
                  >
                    {value}%
                  </span>
                  <span
                    className={`font-black leading-none mt-0.5
                                ${isAward ? "text-white" : "text-rose-500"}`}
                    style={{ fontSize: "clamp(0.5rem, 1.1vmin, 0.85rem)" }}
                  >
                    ▼
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Unit footer */}
        <div className="bg-[#e30613] text-center text-white border-t-2 border-red-700"
             style={{ padding: "clamp(0.2rem, 0.6vh, 0.5rem) 1rem" }}>
          <p className="font-black tracking-widest uppercase"
             style={{ fontSize: "clamp(0.48rem, 0.85vw, 0.75rem)" }}>
            {won && awardedDiscount
              ? `UNLOCKED ${awardedDiscount}% PRICE DROP!`
              : "TURN. MATCH. SMILE."}
          </p>
          <svg
            className="mx-auto"
            style={{ width: "clamp(22px, 3vw, 36px)", height: "clamp(6px, 0.8vw, 10px)", marginTop: "0.08rem" }}
            viewBox="0 0 100 25"
            fill="none"
            stroke="white"
            strokeWidth="5"
          >
            <path d="M 10 5 Q 50 25 90 5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* ── Page dots ─────────────────────────────────────────────── */}
      <div className="flex justify-center gap-2">
        <span className="text-neutral-500" style={{ fontSize: "clamp(0.75rem, 1.3vw, 1.1rem)" }}>○</span>
        <span className="text-neutral-500" style={{ fontSize: "clamp(0.75rem, 1.3vw, 1.1rem)" }}>○</span>
        <span className={`font-bold ${won ? "text-emerald-400" : "text-[#e30613]"}`}
              style={{ fontSize: "clamp(0.75rem, 1.3vw, 1.1rem)" }}>●</span>
      </div>

      {/* ── Play again CTA ─────────────────────────────────────────── */}
      <button
        id="btn-play-again"
        onClick={onPlayAgain}
        className={`rounded-full font-black uppercase tracking-wider text-white shadow-xl
                    transition-all duration-200 active:scale-95
                    ${won
                      ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-950/50"
                      : "bg-[#e30613] hover:bg-red-700 shadow-red-950/50"}`}
        style={{
          fontSize:      "clamp(0.75rem, 1.5vw, 1.1rem)",
          paddingLeft:   "clamp(1.5rem, 4vw, 2.8rem)",
          paddingRight:  "clamp(1.5rem, 4vw, 2.8rem)",
          paddingTop:    "clamp(0.45rem, 1vh, 0.75rem)",
          paddingBottom: "clamp(0.45rem, 1vh, 0.75rem)",
        }}
      >
        {won ? "PLAY AGAIN & WIN MORE" : "TRY AGAIN NOW"}
      </button>
    </div>
  );
}
