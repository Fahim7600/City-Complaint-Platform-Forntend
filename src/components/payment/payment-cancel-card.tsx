"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, RefreshCw, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PaymentCancelCard() {
  const hasToasted = React.useRef(false);

  React.useEffect(() => {
    if (!hasToasted.current) {
      hasToasted.current = true;
      toast.info("Payment cancelled — no charge was made");
    }
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 overflow-hidden">
      {/* Background Graphic elements matching public theme */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#03604c]/30 via-background to-[#7c3aed]/20 pointer-events-none" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-80 opacity-[0.06] dark:opacity-[0.1] select-none">
        <Image
          src="/stacked-steps-haikei.svg"
          alt=""
          fill
          className="object-cover object-bottom"
        />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        <Card className="border border-border/80 bg-card/90 backdrop-blur-xl shadow-2xl p-6 sm:p-8 space-y-6 text-center">
          {/* Amber/Red X Icon */}
          <div className="flex size-18 mx-auto items-center justify-center rounded-3xl bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
            <XCircle className="size-9" />
          </div>

          <div className="space-y-1.5">
            <h1 className="font-heading text-2xl font-bold text-foreground">
              Payment Cancelled
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
              No charge was made to your card. You can explore or upgrade your subscription anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link href="/dashboard/subscription" className="w-full">
              <Button
                className={cn(
                  "w-full text-xs font-bold text-white shadow-lg",
                  "bg-gradient-to-r from-teal-500 via-primary to-violet-600 hover:opacity-95 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                )}
              >
                <RefreshCw className="size-3.5 mr-1.5" />
                Try Again
              </Button>
            </Link>

            <Link href="/dashboard" className="w-full">
              <Button variant="outline" className="w-full text-xs font-semibold">
                <ArrowLeft className="size-3.5 mr-1.5" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
