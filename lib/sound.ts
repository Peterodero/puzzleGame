/**
 Sound effects utility for Colgate Puzzle Game.
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

let bgmAudio: HTMLAudioElement | null = null;
let bgmMuted = false;

export function startBgm() {
  if (typeof window === "undefined") return;

  if (!bgmAudio) {
    bgmAudio = new Audio("/sounds/Game_Music.webm");
    bgmAudio.loop = true;
    bgmAudio.volume = 0.35; // Ambient volume level
  }

  if (bgmAudio.paused && !bgmMuted) {
    bgmAudio.play().catch(() => {
      /* Browser autoplay policies block audio before first user gesture */
      const handleUserGesture = () => {
        if (bgmAudio && bgmAudio.paused && !bgmMuted) {
          bgmAudio.play().catch(() => {});
        }
        window.removeEventListener("pointerdown", handleUserGesture);
        window.removeEventListener("touchstart", handleUserGesture);
        window.removeEventListener("keydown", handleUserGesture);
      };
      window.addEventListener("pointerdown", handleUserGesture);
      window.addEventListener("touchstart", handleUserGesture);
      window.addEventListener("keydown", handleUserGesture);
    });
  }
}

export function toggleBgm(): boolean {
  bgmMuted = !bgmMuted;
  if (bgmAudio) {
    if (bgmMuted) {
      bgmAudio.pause();
    } else {
      bgmAudio.play().catch(() => {});
    }
  }
  return bgmMuted;
}

export function isBgmMuted(): boolean {
  return bgmMuted;
}

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
