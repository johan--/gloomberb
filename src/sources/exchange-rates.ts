import type { YahooFinanceClient } from "./yahoo-finance";
import type { SqliteCache } from "../data/sqlite-cache";

/** Convert a value from one currency to the base currency */
export async function convertToBase(
  value: number,
  fromCurrency: string,
  baseCurrency: string,
  yahoo: YahooFinanceClient,
): Promise<number> {
  if (fromCurrency === baseCurrency) return value;

  // Convert: fromCurrency -> USD -> baseCurrency
  const fromToUsd = await yahoo.getExchangeRate(fromCurrency);
  const baseToUsd = await yahoo.getExchangeRate(baseCurrency);

  if (baseToUsd === 0) return value;
  return (value * fromToUsd) / baseToUsd;
}
