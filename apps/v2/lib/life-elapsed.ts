export type LifeElapsedData = { daysSpent: number; daysLeft: number; totalDays: number };

const BIRTH_DATE = new Date(2005, 3, 18, 10, 1, 0, 0);

function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 3600 * 24));
}

/** Ported from apps/v1/components/big/life-elapsed.tsx — same day-count math. */
function generateHourglassData(year: number, birthDate: Date) {
  const startOfYear = new Date(Date.UTC(year, birthDate.getMonth(), birthDate.getDate()));
  const endOfYear = new Date(Date.UTC(year + 1, birthDate.getMonth(), birthDate.getDate()));
  const daysInYear = daysBetween(startOfYear, endOfYear);
  const now = new Date();

  const effectiveStart = year === birthDate.getFullYear() ? birthDate : startOfYear;
  const effectiveEnd = endOfYear < now ? endOfYear : now < endOfYear ? now : endOfYear;

  let daysSpent = Math.max(0, daysBetween(effectiveStart, effectiveEnd));
  if (year === birthDate.getFullYear()) {
    daysSpent = Math.max(0, daysSpent + 1);
  }
  const daysLeft = daysInYear - daysSpent;

  return { daysSpent, daysLeft };
}

/** Current "life year" — the ~365-day span since the most recent birthday. */
export function getLifeElapsed(birthDate: Date = BIRTH_DATE): LifeElapsedData {
  const now = new Date();
  const birthdayThisYear = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  let currentLifeYear = now.getFullYear() - birthDate.getFullYear();
  if (now < birthdayThisYear) currentLifeYear--;
  currentLifeYear = Math.max(0, currentLifeYear);

  const currentYear = birthDate.getFullYear() + currentLifeYear;
  const { daysSpent, daysLeft } = generateHourglassData(currentYear, birthDate);
  return { daysSpent, daysLeft, totalDays: daysSpent + daysLeft };
}
