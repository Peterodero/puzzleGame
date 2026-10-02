export type GameStage = "brand" | "playing" | "won" | "lost";

/** A single jigsaw piece cut from the target image. */
export interface Tile {
  /** Stable identity for the piece, 0-indexed, row-major. Never changes. */
  id: number;
  /** Correct row/col this tile belongs in on the board. */
  correctRow: number;
  correctCol: number;
}

/** A tile currently sitting in the shuffled tray, waiting to be placed. */
export interface TrayTile extends Tile {
  /** Position in the tray for stable animation keys. */
  trayIndex: number;
}

export interface DiscountOption {
  label: string;
  value: number;
}

/** Where a tile is being dragged/tapped FROM. */
export type DragSource =
  | { origin: "tray"; tileId: number }
  | { origin: "board"; tileId: number; slotIndex: number };
