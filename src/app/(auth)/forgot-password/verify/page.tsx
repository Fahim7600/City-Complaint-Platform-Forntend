import { Suspense } from "react";
import type { Metadata } from "next";
import { VerifyCodeForm } from "@/components/auth/verify-code-form";
import { siteConfig } from "@/lib/site-config";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: `Verify Reset Code — ${siteConfig.name}`,
  description: "Enter your 6-digit verification code to reset your account password.",
  robots: {
    index: false,
    follow: false,
  },
};

function VerifyLoadingFallback() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      <div className="space-y-2 text-center sm:text-left">
        <Skeleton className="size-11 rounded-2xl mx-auto sm:mx-0" />
        <Skeleton className="h-8 w-60 mx-auto sm:mx-0" />
        <Skeleton className="h-4 w-80 mx-auto sm:mx-0" />
      </div>

      <Card className="border border-border/80 shadow-md">
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-center gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="size-12 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-10 w-full rounded-xl" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyResetCodePage() {
  return (
    <Suspense fallback={<VerifyLoadingFallback />}>
      <VerifyCodeForm />
    </Suspense>
  );
}
