/**
 * Points for a bulb's sand-fill trapezoid: `fraction` (0..1) of the bulb's
 * height, measured from `baseY` (the bar end) toward `apexY` (the neck).
 * Used by the favicon/apple-icon routes, which pre-compute the filled
 * shape directly rather than relying on <clipPath> (unconfirmed support
 * in the ImageResponse/Satori renderer those routes use).
 */
export function bulbFillPoints(
  baseY: number,
  apexY: number,
  baseXStart: number,
  baseXEnd: number,
  fraction: number,
): string {
  const cx = (baseXStart + baseXEnd) / 2;
  const baseHalfWidth = (baseXEnd - baseXStart) / 2;
  const cutY = baseY + (apexY - baseY) * fraction;
  const cutHalfWidth = baseHalfWidth * (1 - fraction);
  return `${baseXStart},${baseY} ${baseXEnd},${baseY} ${cx + cutHalfWidth},${cutY} ${cx - cutHalfWidth},${cutY}`;
}
