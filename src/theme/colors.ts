export const colors = {
  bg: "#000000",
  panel: "#0a0a14",
  border: "#1a3a5c",
  borderFocused: "#ff8800",

  text: "#ff8800", // amber primary
  textDim: "#886622",
  textBright: "#ffaa00",
  textMuted: "#555555",

  positive: "#00cc66", // green for gains
  negative: "#ff3333", // red for losses
  neutral: "#888888",

  header: "#0044aa",
  headerText: "#ffffff",

  selected: "#1a3a5c",
  selectedText: "#ffaa00",

  commandBg: "#111122",
  commandBorder: "#ff8800",
} as const;

export type ColorKey = keyof typeof colors;

/** Returns green for positive, red for negative, neutral for zero */
export function priceColor(value: number): string {
  if (value > 0) return colors.positive;
  if (value < 0) return colors.negative;
  return colors.neutral;
}
