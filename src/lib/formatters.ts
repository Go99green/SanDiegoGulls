export function currency(value: unknown, compact = false) {
  const number = Number(value || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: 0,
  }).format(number);
}

export function integer(value: unknown, compact = false) {
  const number = Number(value || 0);
  return new Intl.NumberFormat("en-US", {
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: 0,
  }).format(number);
}

export function decimal(value: unknown, digits = 1) {
  const number = Number(value || 0);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(number);
}

export function percent(value: unknown, digits = 1) {
  const number = Number(value || 0);
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(number);
}

export function formatByType(value: unknown, format?: string) {
  if (format === "currency") return currency(value);
  if (format === "percent") return percent(value);
  return integer(value);
}

export function safeNumber(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}
