export function applyHexOpacity(hex: string, alphaPercent: number): string {
  const alpha = Math.round((alphaPercent / 100) * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();

  return `${hex}${alpha}`;
}
