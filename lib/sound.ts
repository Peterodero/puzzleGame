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
let isAudioUnlocked = false;

function unlockAudioPipeline() {
  if (isAudioUnlocked || typeof window === "undefined") return;
  isAudioUnlocked = true;

  if (bgmAudio && bgmAudio.paused && !bgmMuted) {
    bgmAudio.play().catch(() => {});
  }
}

export function startBgm() {
  if (typeof window === "undefined") return;

  if (!bgmAudio) {
    bgmAudio = new Audio("/sounds/Game_Music.webm");
    bgmAudio.loop = true;
    bgmAudio.volume = 0.35; // Ambient volume level
  }

  /* Try immediate autoplay */
  if (bgmAudio.paused && !bgmMuted) {
    bgmAudio.play().catch(() => {
      /* Blocked by browser autoplay policy until user gesture */
    });
  }

  /* Attach global capture listeners to unlock audio on ANY user touch/click/key */
  const events = ["pointerdown", "touchstart", "mousedown", "click", "keydown"];
  const handleFirstGesture = () => {
    unlockAudioPipeline();
    events.forEach((evt) => {
      window.removeEventListener(evt, handleFirstGesture, true);
    });
  };

  events.forEach((evt) => {
    window.addEventListener(evt, handleFirstGesture, true);
  });
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

  /* If audio hasn't been unlocked yet by user gesture, unlock it now */
  unlockAudioPipeline();

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
