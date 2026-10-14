import * as React from "react";
import type { Metadata } from "next";
import { Loader2 } from "lucide-react";
import { PaymentSuccessContent } from "@/components/payment";

export const metadata: Metadata = {
  title: "Premium Activated | CityFix",
  description: "Your CityFix Premium citizen subscription was activated successfully.",
};

function SuccessFallback() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-8 animate-spin text-violet-500" />
        <p className="text-xs text-muted-foreground font-medium">
          Loading payment confirmation…
        </p>
      </div>
    </div>
  );
}

export default function PremiumSuccessPage() {
  return (
    <React.Suspense fallback={<SuccessFallback />}>
      <PaymentSuccessContent />
    </React.Suspense>
  );
}
