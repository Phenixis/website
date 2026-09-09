/**
 * Ported from apps/v1/components/big/life-elapsed.tsx — same day-count math,
 * restyled with v2's theme tokens (no dark-mode variants, no cn() helper).
 */
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

export function LifeElapsed({ className = "" }: { className?: string }) {
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
    <div
      className={`relative w-4 h-4 flex-none ${className}`}
      title={`Current life-year: ${((daysSpent / totalDays) * 100).toFixed(2)}% (${daysSpent}/${totalDays} days)`}
    >
      <svg className="absolute inset-0 stroke-v3-text-dim" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon points="0,0 100,0 50,50" fill="none" strokeWidth="3" />
        <polygon points="0,100 100,100 50,50" fill="none" strokeWidth="3" />
      </svg>
      {/* Top half: days left */}
      <div className="absolute top-0 left-0 w-full overflow-hidden" style={{ height: `${(daysLeft / totalDays) * 50}%` }}>
        <svg className="w-full h-full fill-v3-text-mute" viewBox="0 0 100 50" preserveAspectRatio="none">
          <polygon points="0,0 100,0 50,50" />
        </svg>
      </div>
      {/* Bottom half: days spent */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden" style={{ height: `${(daysSpent / totalDays) * 50}%` }}>
        <svg className="w-full h-full fill-v3-accent" viewBox="0 0 100 50" preserveAspectRatio="none">
          <polygon points="0,50 100,50 50,0" />
        </svg>
      </div>
    </div>
  );
}
