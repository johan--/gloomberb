/** Format a number as currency (e.g., $1,234.56) */
export function formatCurrency(value: number | undefined, currency = "USD"): string {
  if (value === undefined || value === null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Format a number as percentage (e.g., +1.23%) */
export function formatPercent(value: number | undefined): string {
  if (value === undefined || value === null) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${(value * 100).toFixed(2)}%`;
}

/** Format a percentage that's already in percent form (e.g., 1.23 -> +1.23%) */
export function formatPercentRaw(value: number | undefined): string {
  if (value === undefined || value === null) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

/** Format large numbers compactly (e.g., 1.5T, 234B, 12.3M) */
export function formatCompact(value: number | undefined): string {
  if (value === undefined || value === null) return "—";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1e12) return `${sign}${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}${(abs / 1e3).toFixed(1)}K`;
  return `${sign}${abs.toFixed(2)}`;
}

/** Format a plain number with commas */
export function formatNumber(value: number | undefined, decimals = 2): string {
  if (value === undefined || value === null) return "—";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Pad/truncate a string to a fixed width */
export function padTo(str: string, width: number, align: "left" | "right" = "left"): string {
  if (str.length > width) return str.slice(0, width);
  if (align === "right") return str.padStart(width);
  return str.padEnd(width);
}
