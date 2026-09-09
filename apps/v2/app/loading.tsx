import { LifeElapsed } from "./_components/portfolio/LifeElapsed";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-v3-bg">
      <LifeElapsed className="w-6 h-9 animate-pulse" />
    </div>
  );
}
