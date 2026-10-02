"use client";

import { useEffect, useRef, useState } from "react";
import { playSound } from "@/lib/sound";

const GRID_SIZE = 4;
const HOLD_MS = 1500;        // how long the red brand grid sits still
const ROW_STAGGER = 0.09;    // seconds between each row starting its flip
const PREVIEW_SECONDS = 5;   // memorize countdown once target is revealed

type Phase = "brand" | "revealed" | "breaking";

interface BrandScreenProps {
  imageUrl: string;
  onContinue: () => void; // called once the puzzle grid is ready to play
}

export default function BrandScreen({ imageUrl, onContinue }: BrandScreenProps) {
  const [phase, setPhase] = useState<Phase>("brand");
  const [countdown, setCountdown] = useState(PREVIEW_SECONDS);
  const triggeredBreakRef = useRef(false);

  // Phase 1: hold on brand face, then flip every tile to the target image.
  useEffect(() => {
    const t = setTimeout(() => setPhase("revealed"), HOLD_MS);
    return () => clearTimeout(t);
  }, []);

  // Phase 2: countdown while target is shown.
  useEffect(() => {
    if (phase !== "revealed") return;
    if (countdown <= 0) { triggerBreakup(); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, countdown]);

  function triggerBreakup() {
    if (triggeredBreakRef.current) return;
    triggeredBreakRef.current = true;
    playSound("breakup");
    setPhase("breaking");
    const lastRowDone = (3 * ROW_STAGGER + 0.52) * 1000;
    setTimeout(onContinue, lastRowDone + 150);
  }

  const flipped = phase !== "brand";
  const breaking = phase === "breaking";

  return (
    <div
      className="w-full flex flex-col items-center animate-pop-in text-center mx-auto"
      style={{
        gap: "clamp(0.3rem, 1vh, 0.8rem)",
        maxWidth: "min(90vw, calc(44vh + 1.5rem), 580px)",
      }}
    >
      {/* ── Badge ─────────────────────────────────────────────── */}
      <div
        className="rounded-full bg-[#e30613] text-white font-black uppercase tracking-widest
                   shadow-lg shadow-red-900/40"
        style={{
          fontSize: "clamp(0.65rem, 1.2vw, 0.95rem)",
          padding: "clamp(0.3rem, 0.8vh, 0.6rem) clamp(1rem, 2.5vw, 2rem)",
        }}
      >
        {phase === "brand" ? "SIDE 1 · BRAND" : "SIDE 2 · YOUR TARGET"}
      </div>

      {/* ── Instruction line (only shown once target is revealed) ── */}
      <p
        className={`font-bold ${breaking ? "text-orange-400" : "text-white"} transition-colors duration-300`}
        style={{
          fontSize: "clamp(0.75rem, 1.4vw, 1.1rem)",
          minHeight: phase === "brand" ? 0 : undefined,
        }}
      >
        {phase === "brand"
          ? "\u00A0" /* placeholder so layout doesn't jump when this line appears */
          : breaking
            ? "Turning into puzzle pieces…"
            : `Memorize this image! You have ${countdown}s to study it.`}
      </p>

      {/* ── Physical display unit (never unmounts between phases) ── */}
      <div className="w-full overflow-hidden rounded-3xl border-4 border-neutral-300 bg-white shadow-2xl">

        <div
          className="bg-[#e30613] text-center text-white border-b-2 border-red-700"
          style={{ padding: "clamp(0.35rem, 0.9vh, 0.75rem) 1.5rem" }}
        >
          <p className="font-black italic tracking-tight leading-none" style={{ fontSize: "clamp(1.5rem, 3.2vw, 2.6rem)" }}>
            Colgate
          </p>
          <p className="font-bold tracking-widest uppercase opacity-90" style={{ fontSize: "clamp(0.5rem, 0.85vw, 0.75rem)", marginTop: "0.15rem" }}>
            MORE TO SMILE ABOUT
          </p>
        </div>

        <div className="bg-neutral-200 flex justify-center" style={{ padding: "clamp(2px, 0.3vh, 6px)" }}>
          <div
            className="grid grid-cols-4 bg-neutral-400 rounded-xl mx-auto"
            style={{
              width: "min(85vw, 44vh, 560px)",
              height: "min(85vw, 44vh, 560px)",
              gap: "clamp(2px, 0.25vmin, 4px)",
              padding: "clamp(2px, 0.25vmin, 4px)",
              gridTemplateRows: "repeat(4, 1fr)",
              perspective: "1200px",
              overflow: "visible",
            }}
          >
            {Array.from({ length: 16 }).map((_, i) => {
              const row = Math.floor(i / GRID_SIZE);
              const col = i % GRID_SIZE;
              const bgPos = `${(col / 3) * 100}% ${(row / 3) * 100}%`;
              const flipDelay = row * ROW_STAGGER;
              const breakDelay = row * ROW_STAGGER;

              return (
                <div key={i} className="relative" style={{ transformStyle: "preserve-3d" }}>
                  {/* Outer: handles the second (breakup / exit) flip */}
                  <div
                    className="absolute inset-0"
                    style={{
                      transformStyle: "preserve-3d",
                      transition: breaking
                        ? `transform 0.5s cubic-bezier(0.55,0,0.1,1) ${breakDelay}s, opacity 0.25s ease-in ${breakDelay + 0.22}s`
                        : "none",
                      transform: breaking ? "rotateX(-110deg) scale(0.92)" : "rotateX(0deg)",
                      opacity: breaking ? 0 : 1,
                    }}
                  >
                    {/* Inner: handles the first (brand -> target) flip */}
                    <div
                      className="absolute inset-0 rounded-sm"
                      style={{
                        transformStyle: "preserve-3d",
                        transition: `transform 0.52s cubic-bezier(0.65,0,0.35,1) ${flipDelay}s`,
                        transform: flipped ? "rotateX(-180deg)" : "rotateX(0deg)",
                      }}
                    >
                      {/* Front face — brand image */}
                      <div
                        className="absolute inset-0 rounded-sm"
                        style={{
                          backfaceVisibility: "hidden",
                          backgroundImage: "url('/side1-brand.svg')",
                          backgroundSize: "400% 400%",
                          backgroundPosition: bgPos,
                        }}
                      />
                      {/* Back face — target image, pre-rotated so it lands upright */}
                      <div
                        className="absolute inset-0 rounded-sm"
                        style={{
                          backfaceVisibility: "hidden",
                          transform: "rotateX(180deg)",
                          backgroundImage: `url('${imageUrl}')`,
                          backgroundSize: "400% 400%",
                          backgroundPosition: bgPos,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#e30613] text-center text-white border-t-2 border-red-700" style={{ padding: "clamp(0.6rem, 1.5vh, 1.2rem) 2rem" }}>
          <p className="font-black tracking-widest uppercase" style={{ fontSize: "clamp(0.65rem, 1.2vw, 1rem)" }}>
            TURN. MATCH. SMILE.
          </p>
          <svg className="mx-auto" style={{ width: "clamp(36px, 5vw, 64px)", height: "clamp(10px, 1.5vw, 18px)", marginTop: "0.25rem" }} viewBox="0 0 100 25" fill="none" stroke="white" strokeWidth="5">
            <path d="M 10 5 Q 50 25 90 5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* ── Tagline/dots pre-reveal, Continue button post-reveal ── */}
      {phase === "brand" ? (
        <div>
          <p className="font-bold text-white" style={{ fontSize: "clamp(1rem, 2.2vw, 1.6rem)" }}>
            Smile Your Way to Savings!
          </p>
          <p className="text-slate-300" style={{ fontSize: "clamp(0.8rem, 1.6vw, 1.2rem)", maxWidth: "36ch", margin: "0.5rem auto 0" }}>
            Play our puzzle, match all tiles, and unlock an exclusive Colgate price drop.
          </p>
          <div className="flex justify-center gap-3" style={{ marginTop: "clamp(0.5rem, 1vh, 1rem)" }}>
            <span className="text-[#e30613] font-bold" style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}>●</span>
            <span className="text-neutral-500" style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}>○</span>
            <span className="text-neutral-500" style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}>○</span>
            <span className="text-neutral-500" style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}>○</span>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-center gap-3">
            <span className="text-neutral-500" style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.4rem)" }}>○</span>
            <span className="text-[#e30613] font-bold" style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.4rem)" }}>●</span>
            <span className="text-neutral-500" style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.4rem)" }}>○</span>
            <span className="text-neutral-500" style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.4rem)" }}>○</span>
          </div>

          <div className="flex items-center" style={{ gap: "clamp(1rem, 3vw, 2rem)" }}>
            <div
              className={`relative flex items-center justify-center rounded-full border-4 transition-colors duration-500
                          ${breaking ? "border-orange-400/50" : countdown <= 2 ? "border-[#e30613] animate-pulse" : "border-white/30"}`}
              style={{ width: "clamp(56px, 8vw, 96px)", height: "clamp(56px, 8vw, 96px)" }}
            >
              <span className={`font-black tabular-nums transition-colors ${breaking ? "text-orange-400" : "text-white"}`} style={{ fontSize: "clamp(1.25rem, 3vw, 2.25rem)" }}>
                {breaking ? "🔄" : countdown}
              </span>
            </div>

            <button
              id="btn-preview-continue"
              onClick={triggerBreakup}
              disabled={breaking}
              className="rounded-full text-white font-black uppercase tracking-wider shadow-xl
                         transition-all duration-200 active:scale-95
                         disabled:opacity-40 disabled:cursor-not-allowed
                         bg-[#e30613] hover:bg-red-700 shadow-red-950/50"
              style={{
                fontSize: "clamp(1rem, 2.5vw, 1.75rem)",
                paddingLeft: "clamp(2rem, 5vw, 4.5rem)",
                paddingRight: "clamp(2rem, 5vw, 4.5rem)",
                paddingTop: "clamp(0.8rem, 2vh, 1.4rem)",
                paddingBottom: "clamp(0.8rem, 2vh, 1.4rem)",
              }}
            >
              {breaking ? "Flipping…" : "CONTINUE →"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}