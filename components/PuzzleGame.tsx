"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  GRID_SIZE,
  TILE_COUNT,
  createTiles,
  shuffleTiles,
  tileBackgroundStyle,
} from "@/lib/puzzle";
import Timer from "./Timer";
import { playSound } from "@/lib/sound";

interface PuzzleGameProps {
  imageUrl: string;
  durationSeconds: number;
  secondsLeft: number;
  onTick: (next: number) => void;
  onSolved: () => void;
  onExpire: () => void;
}

export default function PuzzleGame({
  imageUrl,
  durationSeconds,
  secondsLeft,
  onTick,
  onSolved,
  onExpire,
}: PuzzleGameProps) {
  const allTiles = useMemo(() => createTiles(), []);

  const [board,        setBoard]        = useState<number[]>(() =>
    shuffleTiles(allTiles).map((t) => t.id)
  );
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [hoverSlot,    setHoverSlot]    = useState<number | null>(null);

  /* ─── Drag state stored in a plain ref so global listeners never go stale ── */
  const dragRef = useRef<{
    from:       number;
    startX:     number;
    startY:     number;
    currentOver: number | null;
  } | null>(null);

  /* ─── Stable function refs (updated every render) ──────────────────────── */
  /*
   * These let the global window listeners (attached once in useEffect)
   * always call the latest version of swap / tapSelect, which already
   * use the functional form of setBoard so they never read stale board state.
   */
  const swapRef    = useRef<(from: number, to: number) => void>(() => {});
  const tapSelRef  = useRef<(idx: number) => void>(() => {});

  /* ─── Win check ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (board.length === TILE_COUNT && board.every((id, i) => id === i)) {
      playSound("win");
      onSolved();
    }
  }, [board, onSolved]);

  /* Play game start chime */
  useEffect(() => {
    playSound("correct");
  }, []);

  /* ─── Swap two tiles ────────────────────────────────────────────────────── */
  function swap(from: number, to: number) {
    if (from === to) { setSelectedSlot(null); return; }
    setBoard((prev) => {
      const next = [...prev];
      [next[from], next[to]] = [next[to], next[from]];

      const newlyCorrect = next[from] === from || next[to] === to;
      if (newlyCorrect) {
        playSound("correct");
      } else {
        playSound("swap");
      }
      return next;
    });
    setSelectedSlot(null);
    setHoverSlot(null);
  }

  /* ─── Tap-select / tap-swap ─────────────────────────────────────────────── */
  function tapSelect(idx: number) {
    if (selectedSlot === null) {
      playSound("tap");
      setSelectedSlot(idx);
    } else if (selectedSlot === idx) {
      setSelectedSlot(null);
    } else {
      swap(selectedSlot, idx);
    }
  }

  /* Update stable refs so global listeners use the latest closures */
  swapRef.current   = swap;
  tapSelRef.current = tapSelect;

  /* ─── Global pointer listeners (attached once) ──────────────────────────── */
  /*
   * We use window-level listeners instead of per-tile handlers so the
   * pointer can freely leave the source tile during a drag and still be
   * tracked.  setBoard uses functional updates → never stale.
   * setHoverSlot / setSelectedSlot are stable references from useState.
   */
  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!dragRef.current) return;

      const el      = document.elementFromPoint(e.clientX, e.clientY);
      const target  = el?.closest<HTMLElement>("[data-slot]");
      const over    = target ? Number(target.dataset.slot) : null;

      dragRef.current.currentOver = over;
      setHoverSlot(over);          /* setHoverSlot is stable → safe in closure */
    }

    function onUp(e: PointerEvent) {
      const drag = dragRef.current;
      if (!drag) return;
      dragRef.current = null;
      setHoverSlot(null);

      const dist = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY);

      if (dist > 10) {
        /* Drag completed → swap source with whatever tile is under the pointer */
        const to = drag.currentOver;
        if (to !== null && to !== drag.from) {
          swapRef.current(drag.from, to);
        }
      } else {
        /* Tap (no movement) → selection flow */
        tapSelRef.current(drag.from);
      }
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup",   onUp);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup",   onUp);
    };
  }, []); /* Empty deps OK: only stable references used inside */

  const correctCount = board.filter((id, idx) => id === idx).length;

  return (
    <div
      className="w-full flex flex-col items-center animate-pop-in mx-auto"
      style={{
        gap: "clamp(0.3rem, 0.9vh, 0.75rem)",
        maxWidth: "min(90vw, calc(44vh + 1.5rem), 580px)",
      }}
    >
      {/* ── Top bar ──────────────────────────────────────────────── */}
      <div className="w-full flex items-center justify-between"
           style={{ gap: "clamp(0.4rem, 1vw, 1rem)" }}>

        <div className="flex items-center" style={{ gap: "clamp(0.3rem, 0.8vw, 0.6rem)" }}>
          <div
            className="rounded-full bg-[#e30613] text-white font-black uppercase tracking-widest shrink-0"
            style={{
              fontSize: "clamp(0.5rem, 0.95vw, 0.75rem)",
              padding:  "clamp(0.25rem, 0.5vh, 0.45rem) clamp(0.6rem, 1.4vw, 1.1rem)",
            }}
          >
            PUZZLE
          </div>
          <span
            className="font-black text-emerald-400 bg-emerald-900/40 rounded-xl
                       border border-emerald-700/50 shrink-0"
            style={{
              fontSize: "clamp(0.65rem, 1.1vw, 0.85rem)",
              padding:  "clamp(0.2rem, 0.4vh, 0.45rem) clamp(0.5rem, 1.1vw, 0.9rem)",
            }}
          >
            {correctCount}/{TILE_COUNT} ✓
          </span>
        </div>

        <Timer
          secondsLeft={secondsLeft}
          totalSeconds={durationSeconds}
          running
          onTick={onTick}
          onExpire={onExpire}
        />
      </div>

      {/* ── Physical display unit ────────────────────────────────── */}
      <div className="w-full overflow-hidden rounded-3xl border-4 border-neutral-300 bg-white shadow-2xl">

        {/* Unit header */}
        <div
          className="bg-[#e30613] text-center text-white border-b-2 border-red-700"
          style={{ padding: "clamp(0.3rem, 0.8vh, 0.6rem) 1.5rem" }}
        >
          <p className="font-black italic tracking-tight leading-none"
             style={{ fontSize: "clamp(1.3rem, 2.8vw, 2.2rem)" }}>
            Colgate
          </p>
          <p className="font-bold tracking-widest uppercase opacity-90"
             style={{ fontSize: "clamp(0.45rem, 0.8vw, 0.7rem)", marginTop: "0.1rem" }}>
            MORE TO SMILE ABOUT
          </p>
        </div>

        {/* 4×4 puzzle grid */}
        <div className="bg-neutral-200 flex justify-center"
             style={{ padding: "clamp(2px, 0.3vh, 6px)" }}>
          <div
            className="grid grid-cols-4 bg-neutral-400 rounded-xl"
            style={{
              width:  "min(85vw, 44vh, 560px)",
              height: "min(85vw, 44vh, 560px)",
              gap:     "clamp(2px, 0.25vmin, 4px)",
              padding: "clamp(2px, 0.25vmin, 4px)",
              gridTemplateRows: "repeat(4, 1fr)",
            }}
          >
            {board.map((tileId, slotIndex) => {
              const isCorrect  = tileId === slotIndex;
              const row        = Math.floor(tileId / GRID_SIZE);
              const col        = tileId % GRID_SIZE;
              const isSelected = selectedSlot === slotIndex;
              const isOver     = hoverSlot === slotIndex
                                 && dragRef.current !== null
                                 && dragRef.current.from !== slotIndex;

              return (
                <div
                  key={slotIndex}
                  /* Data attribute used by elementFromPoint to identify the slot */
                  data-slot={String(slotIndex)}
                  onPointerDown={(e) => {
                    /*
                     * e.preventDefault() stops:
                     *   • text/image selection (desktop)
                     *   • long-press context menu (mobile)
                     *   • browser taking over the touch for scrolling
                     */
                    e.preventDefault();
                    dragRef.current = {
                      from:        slotIndex,
                      startX:      e.clientX,
                      startY:      e.clientY,
                      currentOver: null,
                    };
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                  style={{
                    ...tileBackgroundStyle(row, col, imageUrl),
                    /*
                     * touch-action: none  →  tells the browser "don't scroll
                     * or zoom from touches on this element"; pointer events
                     * then fire normally for drag gestures on touch screens.
                     */
                    touchAction: "none",
                    userSelect:  "none",
                    cursor:      isSelected ? "pointer" : "grab",
                  }}
                  className={[
                    "relative transition duration-150 rounded-sm overflow-hidden",
                    isOver
                      ? "ring-[5px] ring-[#e30613] scale-95 z-20 brightness-110"
                      : isSelected
                      ? "ring-[5px] ring-sky-400 scale-95 z-20"
                      : isCorrect
                      ? "ring-[4px] ring-inset ring-emerald-500"
                      : "",
                  ].join(" ")}
                >
                  {isCorrect && (
                    <div
                      className="absolute top-1 right-1 flex items-center justify-center
                                 rounded-full bg-emerald-500 text-white font-black shadow-md
                                 pointer-events-none"
                      style={{
                        width:    "clamp(14px, 2vmin, 26px)",
                        height:   "clamp(14px, 2vmin, 26px)",
                        fontSize: "clamp(7px, 1.2vmin, 13px)",
                      }}
                    >
                      ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Unit footer */}
        <div
          className="bg-[#e30613] text-center text-white border-t-2 border-red-700"
          style={{ padding: "clamp(0.35rem, 0.9vh, 0.75rem) 2rem" }}
        >
          <p className="font-black tracking-widest uppercase"
             style={{ fontSize: "clamp(0.5rem, 1vw, 0.85rem)" }}>
            TURN. MATCH. SMILE.
          </p>
          <svg className="mx-auto"
               style={{ width: "clamp(28px, 4vw, 56px)", height: "clamp(7px, 1vw, 14px)", marginTop: "0.1rem" }}
               viewBox="0 0 100 25" fill="none" stroke="white" strokeWidth="5">
            <path d="M 10 5 Q 50 25 90 5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Page dots */}
      <div className="flex justify-center gap-3">
        {["○","○","●","○"].map((d, i) => (
          <span key={i}
                className={d === "●" ? "text-[#e30613] font-bold" : "text-neutral-500"}
                style={{ fontSize: "clamp(0.8rem, 1.6vw, 1.3rem)" }}>
            {d}
          </span>
        ))}
      </div>

      {/* Hint — bottom */}
      <p className="font-bold text-slate-400 pb-2"
         style={{ fontSize: "clamp(0.7rem, 1.4vw, 1rem)" }}>
        Drag a tile onto another to swap, or tap two tiles!
      </p>
    </div>
  );
}
