import { Activity } from "lucide-react";

export default function EngineHealth() {
  return (
    <div className="flex items-center gap-2 p-4 rounded-xl bg-background border border-border">
      <Activity className="w-5 h-5 text-primary" />
      <span className="text-foreground font-medium">Engine Health</span>
    </div>
  );
}
