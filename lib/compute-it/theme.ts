import type { CellColor } from "./types";

export const PLAYFIELD_BG = "#5c6d7e";

export const CELL_DEFAULT = "#d4dde4";
export const DOT_GOAL = "#78B0DD";
/** @deprecated use DOT_GOAL */
export const CELL_GOAL = "#78B0DD";

export const CELL_BG: Record<CellColor, string> = {
  normal: "#d4dde4",
  blue: "#26c6da",
  green: "#aed581",
  red: "#ef5350",
  orange: "#ffa726",
  purple: "#ab47bc",
  yellow: "#ffee58",
};

export const CODE_TEXT_LIGHT = "#f5f8fa";
export const CODE_TEXT_DIM = "rgba(255, 255, 255, 0.5)";

/** @deprecated use CODE_TEXT_LIGHT / CODE_TEXT_DIM in UI */
export const CODE_TEXT = "#2c3e50";
/** @deprecated use CODE_TEXT_DIM in UI */
export const CODE_TEXT_MUTED = "#4a6278";
/** @deprecated no longer used in CodePanel */
export const CODE_HIGHLIGHT_BG = "rgba(255, 255, 255, 0.92)";
