import { Loader2 } from "lucide-react";

export default function PremiumLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-8 animate-spin text-violet-500" />
        <p className="text-xs text-muted-foreground font-medium">
          Processing subscription update…
        </p>
      </div>
    </div>
  );
}
