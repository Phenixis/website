import { HourglassIcon } from "./_components/HourglassIcon";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-v3-bg">
      <HourglassIcon className="w-6 h-9 animate-pulse" />
    </div>
  );
}
