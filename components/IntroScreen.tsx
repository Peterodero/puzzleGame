"use client";

interface IntroScreenProps {
  onStart: () => void;
  durationSeconds: number;
}

export default function IntroScreen({ onStart, durationSeconds }: IntroScreenProps) {
  return (
    <div className="w-full flex flex-col items-center animate-pop-in text-center"
         style={{ gap: "clamp(1rem, 2.5vh, 2rem)", maxWidth: "min(900px, 90vw)" }}>

      {/* ── Badge ─────────────────────────────────────────────────── */}
      <div className="rounded-full bg-[#e30613] text-white font-black uppercase tracking-widest
                      shadow-lg shadow-red-900/40 px-8 py-3"
           style={{ fontSize: "clamp(0.75rem, 1.5vw, 1.1rem)" }}>
        SIDE 1 · BRAND EXPERIENCE
      </div>

      {/* ── Physical display unit ─────────────────────────────────── */}
      <div className="w-full overflow-hidden rounded-3xl border-4 border-neutral-300 bg-white shadow-2xl">

        {/* Unit header */}
        <div className="bg-[#e30613] text-center text-white border-b-2 border-red-700"
             style={{ padding: "clamp(0.75rem, 2vh, 1.5rem) 2rem" }}>
          <p className="font-black italic tracking-tight leading-none"
             style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            Colgate
          </p>
          <p className="font-bold tracking-widest uppercase opacity-90"
             style={{ fontSize: "clamp(0.65rem, 1.2vw, 1rem)", marginTop: "0.25rem" }}>
            MORE TO SMILE ABOUT
          </p>
        </div>

        {/* 4×4 assembled preview — the image the player must recreate */}
        <div className="bg-neutral-200 flex justify-center"
             style={{ padding: "clamp(0.5rem, 1.2vh, 1rem)" }}>
          <div
            className="grid grid-cols-4 bg-neutral-400 rounded-xl mx-auto overflow-hidden"
            style={{
              width:  "clamp(280px, 38vmin, 560px)",
              height: "clamp(280px, 38vmin, 560px)",
              gap: "clamp(2px, 0.3vmin, 5px)",
              padding: "clamp(2px, 0.3vmin, 5px)",
              gridTemplateRows: "repeat(4, 1fr)",
            }}
          >
            {Array.from({ length: 16 }).map((_, i) => {
              const row = Math.floor(i / 4);
              const col = i % 4;
              return (
                <div
                  key={i}
                  className="rounded-sm overflow-hidden"
                  style={{
                    backgroundImage: "url('/target.jpg')",
                    backgroundSize: "400% 400%",
                    backgroundPosition: `${(col / 3) * 100}% ${(row / 3) * 100}%`,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Unit footer */}
        <div className="bg-[#e30613] text-center text-white border-t-2 border-red-700"
             style={{ padding: "clamp(0.6rem, 1.5vh, 1.2rem) 2rem" }}>
          <p className="font-black tracking-widest uppercase"
             style={{ fontSize: "clamp(0.65rem, 1.2vw, 1rem)" }}>
            TURN. MATCH. SMILE.
          </p>
          <svg
            className="mx-auto"
            style={{
              width:  "clamp(36px, 5vw, 64px)",
              height: "clamp(10px, 1.5vw, 18px)",
              marginTop: "0.25rem",
            }}
            viewBox="0 0 100 25"
            fill="none"
            stroke="white"
            strokeWidth="5"
          >
            <path d="M 10 5 Q 50 25 90 5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* ── Description ───────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(0.5rem, 1vh, 1rem)" }}>
        <p className="font-bold text-white"
           style={{ fontSize: "clamp(1rem, 2.2vw, 1.6rem)" }}>
          Rebuild the Colgate campaign poster!
        </p>
        <p className="text-slate-300"
           style={{ fontSize: "clamp(0.8rem, 1.6vw, 1.2rem)", maxWidth: "36ch" }}>
          Rearrange the shuffled tiles to match the image and unlock an exclusive discount.
        </p>
        {/* Page-position dots */}
        <div className="flex justify-center gap-3"
             style={{ marginTop: "clamp(0.25rem, 0.6vh, 0.75rem)" }}>
          <span className="text-[#e30613] font-bold" style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}>●</span>
          <span className="text-neutral-500"          style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}>○</span>
          <span className="text-neutral-500"          style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}>○</span>
        </div>
      </div>

      {/* ── Start CTA ─────────────────────────────────────────────── */}
      <button
        id="btn-start-game"
        onClick={onStart}
        className="rounded-full bg-[#e30613] text-white font-black uppercase tracking-wider
                   shadow-2xl shadow-red-900/40 transition-all duration-200
                   hover:bg-red-700 active:scale-95 hover:shadow-red-500/20"
        style={{
          fontSize:      "clamp(1rem, 2.5vw, 1.75rem)",
          paddingLeft:   "clamp(2.5rem, 6vw, 5rem)",
          paddingRight:  "clamp(2.5rem, 6vw, 5rem)",
          paddingTop:    "clamp(0.9rem, 2.2vh, 1.6rem)",
          paddingBottom: "clamp(0.9rem, 2.2vh, 1.6rem)",
        }}
      >
        TAP TO PLAY — {durationSeconds}S
      </button>
    </div>
  );
}
