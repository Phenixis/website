import { HourglassIcon } from "../HourglassIcon";

/** Ported from apps/v1/components/big/life-elapsed.tsx — same day-count math. */
function generateHourglassData(year: number, birthDate: Date) {
  const startOfYear = new Date(Date.UTC(year, birthDate.getMonth(), birthDate.getDate()));
  const endOfYear = new Date(Date.UTC(year + 1, birthDate.getMonth(), birthDate.getDate()));

  const daysInYear = Math.floor((endOfYear.getTime() - startOfYear.getTime()) / (1000 * 3600 * 24));
  const now = new Date();

  const effectiveStart = year === birthDate.getFullYear() ? birthDate : startOfYear;
  const effectiveEnd = endOfYear < now ? endOfYear : now < endOfYear ? now : endOfYear;

  let daysSpent = Math.max(0, Math.floor((effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 3600 * 24)));
  if (year === birthDate.getFullYear()) {
    daysSpent = Math.max(0, daysSpent + 1);
  }
  const daysLeft = daysInYear - daysSpent;

  return { daysSpent, daysLeft };
}

export function LifeElapsed({ className = "w-[11px] h-4" }: { className?: string }) {
  const birthDate = new Date(2005, 3, 18, 10, 1, 0, 0);
  const now = new Date();
  const birthdayThisYear = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  let currentLifeYear = now.getFullYear() - birthDate.getFullYear();
  if (now < birthdayThisYear) currentLifeYear--;
  currentLifeYear = Math.max(0, currentLifeYear);

  const currentYear = birthDate.getFullYear() + currentLifeYear;
  const { daysSpent, daysLeft } = generateHourglassData(currentYear, birthDate);
  const totalDays = daysSpent + daysLeft;

  return (
    <span
      className="inline-flex"
      title={`Current life-year: ${((daysSpent / totalDays) * 100).toFixed(2)}% (${daysSpent}/${totalDays} days)`}
    >
      <HourglassIcon className={className} topFraction={daysLeft / totalDays} bottomFraction={daysSpent / totalDays} />
    </span>
  );
}
