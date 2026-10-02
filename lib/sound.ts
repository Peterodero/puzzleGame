/**
 * Sound effects utility for Colgate Puzzle Game.
 * Plays WebM sound effects using HTML5 Audio with autoplay fallback.
 */

const SOUND_PATHS = {
  tap: "/sounds/common/button1.webm",
  swap: "/sounds/score.webm",
  correct: "/sounds/level.webm",
  win: "/sounds/game-win.webm",
  lose: "/sounds/game-lose.webm",
  breakup: "/sounds/popup.webm",
  click: "/sounds/common/button2.webm",
} as const;

export type SoundEffect = keyof typeof SOUND_PATHS;

export function playSound(effect: SoundEffect) {
  if (typeof window === "undefined") return;

  try {
    const audio = new Audio(SOUND_PATHS[effect]);
    audio.volume = 0.7; // Pleasant default volume
    audio.currentTime = 0;
    audio.play().catch(() => {
      /* Browser autoplay policies may block sound prior to first user gesture */
    });
  } catch {
    /* Silent fallback if audio context unavailable */
  }
}
