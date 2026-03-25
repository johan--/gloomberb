export interface TickerPosition {
  portfolio: string;
  shares: number;
  avg_cost: number;
  date_acquired?: string;
  broker: string; // "ibkr-flex" | "manual" | future broker plugin IDs
}

export interface TickerFrontmatter {
  ticker: string;
  exchange: string;
  currency: string;
  name: string;
  sector?: string;
  industry?: string;
  portfolios: string[];
  watchlists: string[];
  positions: TickerPosition[];
  custom: Record<string, unknown>;
  tags: string[];
}

export interface TickerFile {
  frontmatter: TickerFrontmatter;
  notes: string; // markdown body
  filePath: string;
}

export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  currency: string;
}

export interface Watchlist {
  id: string;
  name: string;
  description?: string;
}
