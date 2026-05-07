export const usd = (n: number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
export const pct = (n: number) => `${(n*100).toFixed(1).replace('.0','')}%`;
export const num = (n: number) => new Intl.NumberFormat('en-US').format(n);
export const compact = (n: number) => new Intl.NumberFormat('en-US',{notation:'compact',maximumFractionDigits:1}).format(n);
