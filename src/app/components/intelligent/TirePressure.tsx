import { Circle } from "lucide-react";

export default function TirePressure() {
  return (
    <div className="flex items-center gap-2 p-4 rounded-xl bg-background border border-border">
      <Circle className="w-5 h-5 text-primary" />
      <span className="text-foreground font-medium">Tire Pressure</span>
    </div>
  );
}
