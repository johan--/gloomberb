import matter from "gray-matter";
import type { TickerFile, TickerFrontmatter } from "../types/ticker";

const DEFAULT_FRONTMATTER: Omit<TickerFrontmatter, "ticker" | "exchange" | "currency" | "name"> = {
  portfolios: [],
  watchlists: [],
  positions: [],
  custom: {},
  tags: [],
};

export function parseTicker(filePath: string, content: string): TickerFile {
  const { data, content: body } = matter(content);
  const frontmatter: TickerFrontmatter = {
    ...DEFAULT_FRONTMATTER,
    ticker: "",
    exchange: "",
    currency: "USD",
    name: "",
    ...data,
    portfolios: data.portfolios ?? [],
    watchlists: data.watchlists ?? [],
    positions: data.positions ?? [],
    custom: data.custom ?? {},
    tags: data.tags ?? [],
  };
  return { frontmatter, notes: body.trim(), filePath };
}

export function serializeTicker(ticker: TickerFile): string {
  const fm = { ...ticker.frontmatter };
  // Clean up empty arrays for cleaner files
  if (fm.positions.length === 0) delete (fm as any).positions;
  if (fm.tags.length === 0) delete (fm as any).tags;
  if (Object.keys(fm.custom).length === 0) delete (fm as any).custom;
  return matter.stringify(ticker.notes ? `\n${ticker.notes}\n` : "\n", fm);
}
