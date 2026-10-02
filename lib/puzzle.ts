import type { Tile } from "./types";

export const GRID_SIZE = 4; // 4x4 = 16 tiles, matches the physical cube display
export const TILE_COUNT = GRID_SIZE * GRID_SIZE;

/** Build the ordered list of tiles (0..15) with their correct row/col. */
export function createTiles(): Tile[] {
  const tiles: Tile[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      tiles.push({
        id: row * GRID_SIZE + col,
        correctRow: row,
        correctCol: col,
      });
    }
  }
  return tiles;
}

/** Fisher-Yates shuffle, returning a new array (never mutates the input). */
export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Shuffle tiles, guaranteeing that at least a few tiles do NOT start on
 * their correct slot (otherwise a lucky shuffle could feel too easy /
 * finish instantly and undercut the "puzzle" feeling).
 */
export function shuffleTiles(tiles: Tile[]): Tile[] {
  let shuffled = shuffle(tiles);
  let attempts = 0;
  const misplaced = () =>
    shuffled.filter((t) => t.id !== t.correctRow * GRID_SIZE + t.correctCol).length;

  while (misplaced() < TILE_COUNT - 2 && attempts < 20) {
    shuffled = shuffle(tiles);
    attempts++;
  }
  return shuffled;
}

/**
 * CSS background-image styles that make one element show only the
 * row/col slice of the full target image, using the classic
 * "spritesheet" background-size trick. Works at any element size because
 * background-size percentages are relative to the element itself, so a
 * tiny tray thumbnail and a full-size board slot line up identically.
 */
export function tileBackgroundStyle(
  row: number,
  col: number,
  imageUrl: string
): { backgroundImage: string; backgroundSize: string; backgroundPosition: string } {
  const step = GRID_SIZE - 1;
  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
    backgroundPosition: `${(col / step) * 100}% ${(row / step) * 100}%`,
  };
}

/** Percentage discounts available on the "price drop" reveal face. */
export const DISCOUNT_LADDER = [
  5, 8, 10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 40, 45, 50,
];

/** Pick the discount awarded for a win: better performance -> better discount. */
export function discountForResult(secondsLeft: number, totalSeconds: number): number {
  const ratio = Math.max(0, Math.min(1, secondsLeft / totalSeconds));
  const index = Math.min(
    DISCOUNT_LADDER.length - 1,
    Math.floor(ratio * (DISCOUNT_LADDER.length - 1))
  );
  return DISCOUNT_LADDER[index];
}
