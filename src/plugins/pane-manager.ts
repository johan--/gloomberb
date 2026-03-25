import type { PaneLayoutEntry } from "../types/config";
import type { PaneDef } from "../types/plugin";

export interface ResolvedPane {
  def: PaneDef;
  layout: PaneLayoutEntry;
}

/** Resolve layout entries against registered panes */
export function resolvePanes(
  layout: PaneLayoutEntry[],
  registeredPanes: ReadonlyMap<string, PaneDef>,
): ResolvedPane[] {
  const resolved: ResolvedPane[] = [];

  for (const entry of layout) {
    const def = registeredPanes.get(entry.paneId);
    if (def) {
      resolved.push({ def, layout: entry });
    }
  }

  return resolved;
}

/** Get panes by position */
export function getPanesByPosition(
  panes: ResolvedPane[],
  position: "left" | "right" | "bottom",
): ResolvedPane[] {
  return panes.filter((p) => p.layout.position === position);
}

/** Parse a width string (e.g., "40%") into a flex value or character count */
export function parseWidth(width: string | undefined, totalWidth: number): number | undefined {
  if (!width) return undefined;
  if (width.endsWith("%")) {
    const pct = parseInt(width, 10);
    return Math.floor((pct / 100) * totalWidth);
  }
  return parseInt(width, 10);
}
