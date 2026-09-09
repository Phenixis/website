import { getLifeElapsed } from "@/lib/life-elapsed";
import { HourglassIcon } from "../HourglassIcon";

export function LifeElapsed({ className = "w-8 h-11" }: { className?: string }) {
  const { daysSpent, daysLeft, totalDays } = getLifeElapsed();

  return (
    <span
      className="inline-flex"
      title={`Current life-year: ${((daysSpent / totalDays) * 100).toFixed(2)}% (${daysSpent}/${totalDays} days)`}
    >
      <HourglassIcon className={className} topFraction={daysLeft / totalDays} bottomFraction={daysSpent / totalDays} />
    </span>
  );
}
