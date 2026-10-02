# Colgate — Turn. Match. Smile.

A drag-and-drop picture puzzle built with **Next.js 16 (App Router)**, **React 19**,
**TypeScript 7**, and **Tailwind CSS v4**. It mirrors the physical "Turn. Match.
Smile." cube display: Side 1 is the brand intro, Side 2's picture is what the
player reconstructs against a countdown timer, and Side 3's price-drop grid is
the reward reveal at the end.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

For a production build:

```bash
npm run build
npm start
```

## How the game works

1. **Intro (Side 1)** — brand splash with a "Play" button.
2. **Playing (Side 2)** — the target picture is sliced into a 4×4 grid of 16
   tiles. All 16 start shuffled in the tray at the bottom. A 90-second
   countdown timer runs at the top.
   - **Drag** a tile from the tray onto any empty grid slot.
   - Or **tap** a tile to select it, then tap a slot to place it (works on
     touch devices where native drag is unreliable).
   - Tap a placed tile to pick it back up, or drag it to another slot / back
     to the tray.
   - A small reference thumbnail of the finished picture is always visible,
     and every empty (and filled) slot shows a faint outline of the piece
     that belongs there, so the target is never hidden.
   - Correctly placed tiles get a green ring.
3. **Result (Side 3)**
   - **Win** — if the grid is completely correct before time runs out, the
     player is shown the price-drop grid with one discount highlighted. The
     faster they finish, the better the discount (see `discountForResult`
     in `lib/puzzle.ts`).
   - **Lose** — if the timer hits zero before the grid is solved, the round
     ends and the player can try again with a freshly shuffled picture.

## Where to customize

- **`public/target.svg`** — swap this for your real campaign artwork (any
  square image works — JPG/PNG/WebP included, just update `TARGET_IMAGE` in
  `app/page.tsx`). It's currently a generic illustrated placeholder since I
  didn't have rights to reuse the real campaign photo.
- **`DURATION_SECONDS`** in `app/page.tsx` — round length.
- **`GRID_SIZE`** in `lib/puzzle.ts` — change from 4×4 to another grid size
  (e.g. 3×3 for an easier round). Everything else (slicing, shuffling,
  win-check) adapts automatically.
- **`DISCOUNT_LADDER`** and **`discountForResult`** in `lib/puzzle.ts` — the
  reward tiers and how finishing time maps to a discount.
- **Colors** — `--color-colgate-red` / `--color-colgate-red-dark` in
  `app/globals.css` (Tailwind v4's `@theme` block). Change these and every
  `bg-colgate-red` / `text-colgate-red` utility updates automatically.

## Project structure

```
app/
  layout.tsx        Root layout + metadata
  page.tsx           Stage machine: intro -> playing -> won/lost
  globals.css         Tailwind v4 import + theme tokens
components/
  IntroScreen.tsx      Side 1 splash
  PuzzleGame.tsx       Side 2 board + tray + drag/drop + tap-to-place
  Timer.tsx            Countdown bar used inside PuzzleGame
  ResultScreen.tsx      Side 3 win/lose reveal
lib/
  puzzle.ts            Tile generation, shuffling, image-slicing, discount math
  types.ts             Shared types
public/
  target.svg           Placeholder square target image (replace with real art)
```

## Notes

- No external UI libraries — drag-and-drop uses the native HTML5 Drag and
  Drop API, with a tap-to-select/tap-to-place fallback for phones and
  tablets where native DnD is unreliable.
- Image slicing uses a single `background-image` per tile with a
  percentage-based `background-size`/`background-position` (the classic
  sprite-sheet trick), so any square image can be dropped in without
  pre-cutting 16 separate files.
