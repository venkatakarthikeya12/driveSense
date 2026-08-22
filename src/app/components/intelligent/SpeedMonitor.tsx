import { Gauge } from "lucide-react";

export default function SpeedMonitor() {
  return (
    <div className="flex items-center gap-2 p-4 rounded-xl bg-background border border-border">
      <Gauge className="w-5 h-5 text-primary" />
      <span className="text-foreground font-medium">Speed Monitor</span>
    </div>
  );
}
