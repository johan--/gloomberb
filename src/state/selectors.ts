import type { AppState } from "./app-context";
import type { TickerFile } from "../types/ticker";

/** Get tickers belonging to a specific portfolio */
export function getPortfolioTickers(state: AppState, portfolioId: string): TickerFile[] {
  const result: TickerFile[] = [];
  for (const ticker of state.tickers.values()) {
    if (ticker.frontmatter.portfolios.includes(portfolioId)) {
      result.push(ticker);
    }
  }
  return result.sort((a, b) => a.frontmatter.ticker.localeCompare(b.frontmatter.ticker));
}

/** Get tickers belonging to a specific watchlist */
export function getWatchlistTickers(state: AppState, watchlistId: string): TickerFile[] {
  const result: TickerFile[] = [];
  for (const ticker of state.tickers.values()) {
    if (ticker.frontmatter.watchlists.includes(watchlistId)) {
      result.push(ticker);
    }
  }
  return result.sort((a, b) => a.frontmatter.ticker.localeCompare(b.frontmatter.ticker));
}

/** Get all tickers for the currently active left tab */
export function getActiveTabTickers(state: AppState): TickerFile[] {
  const { activeLeftTab, config } = state;

  // Check if it's a portfolio
  if (config.portfolios.some((p) => p.id === activeLeftTab)) {
    return getPortfolioTickers(state, activeLeftTab);
  }

  // Check if it's a watchlist
  if (config.watchlists.some((w) => w.id === activeLeftTab)) {
    return getWatchlistTickers(state, activeLeftTab);
  }

  return [];
}

/** Get the display name for the current left tab */
export function getActiveTabName(state: AppState): string {
  const { activeLeftTab, config } = state;
  const portfolio = config.portfolios.find((p) => p.id === activeLeftTab);
  if (portfolio) return portfolio.name;
  const watchlist = config.watchlists.find((w) => w.id === activeLeftTab);
  if (watchlist) return watchlist.name;
  return activeLeftTab;
}

/** Get all tab options for the left panel */
export function getLeftTabs(state: AppState): Array<{ id: string; name: string; type: "portfolio" | "watchlist" }> {
  const tabs: Array<{ id: string; name: string; type: "portfolio" | "watchlist" }> = [];
  for (const p of state.config.portfolios) {
    tabs.push({ id: p.id, name: p.name, type: "portfolio" });
  }
  for (const w of state.config.watchlists) {
    tabs.push({ id: w.id, name: w.name, type: "watchlist" });
  }
  return tabs;
}
