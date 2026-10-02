"use client";

import { useCallback, useState } from "react";
import BrandScreen   from "@/components/BrandScreen";
import PuzzleGame    from "@/components/PuzzleGame";
import ResultScreen  from "@/components/ResultScreen";
import type { GameStage } from "@/lib/types";
import { discountForResult } from "@/lib/puzzle";

const DURATION_SECONDS = 120;
const TARGET_IMAGE     = "/target.jpg";

export default function Home() {
  const [stage,       setStage]       = useState<GameStage>("brand");
  const [secondsLeft, setSecondsLeft] = useState(DURATION_SECONDS);
  const [runKey,      setRunKey]      = useState(0);

  /* Brand (incl. reveal + countdown + breakup) -> Playing */
  const handleStartGame = useCallback(() => {
    setSecondsLeft(DURATION_SECONDS);
    setRunKey((k) => k + 1);
    setStage("playing");
  }, []);

  const handleSolved = useCallback(() => setStage("won"),  []);
  const handleExpire = useCallback(() => setStage("lost"), []);
  const handlePlayAgain = useCallback(() => setStage("brand"), []);

  const awardedDiscount =
    stage === "won" ? discountForResult(secondsLeft, DURATION_SECONDS) : null;

  return (
    <main className="relative w-full h-screen overflow-hidden flex flex-col">
      <div className="pointer-events-none fixed left-1/2 top-0 -z-10 h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-red-600/20 blur-[200px]" />
      <div className="pointer-events-none fixed right-0 bottom-0 -z-10 h-[600px] w-[600px] rounded-full bg-indigo-600/15 blur-[180px]" />

      <header className="w-full shrink-0 flex items-center justify-between px-6 py-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-[#e30613]" />
          </span>
          <span className="font-extrabold italic tracking-tight text-white" style={{ fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)" }}>
            Colgate<span className="text-[#e30613]">.</span>
          </span>
        </div>

        <span className="font-bold text-slate-300 uppercase tracking-widest bg-slate-900/80 backdrop-blur-md rounded-full border border-white/10 px-4 py-1.5" style={{ fontSize: "clamp(0.6rem, 1vw, 0.85rem)" }}>
          {stage === "brand"   && "Welcome"}
          {stage === "playing" && "Puzzle Challenge"}
          {stage === "won"     && "Victory!"}
          {stage === "lost"    && "Time Up"}
        </span>
      </header>

      <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-4 py-1">
        {stage === "brand" && (
          <BrandScreen imageUrl={TARGET_IMAGE} onContinue={handleStartGame} />
        )}

        {stage === "playing" && (
          <PuzzleGame
            key={runKey}
            imageUrl={TARGET_IMAGE}
            durationSeconds={DURATION_SECONDS}
            secondsLeft={secondsLeft}
            onTick={setSecondsLeft}
            onSolved={handleSolved}
            onExpire={handleExpire}
          />
        )}

        {(stage === "won" || stage === "lost") && (
          <ResultScreen
            won={stage === "won"}
            imageUrl={TARGET_IMAGE}
            awardedDiscount={awardedDiscount}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </div>

      <footer className="w-full shrink-0 py-2 border-t border-white/5 text-center font-semibold text-slate-500 uppercase tracking-widest" style={{ fontSize: "clamp(0.5rem, 0.8vw, 0.7rem)" }}>
        Turn. Match. Smile. — Colgate Interactive Retail Experience
      </footer>
    </main>
  );
}