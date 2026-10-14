"use client";

import * as React from "react";
import { Check, Copy, CreditCard, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TestModeCard() {
  const [copied, setCopied] = React.useState(false);
  const testCardNumber = "4242 4242 4242 4242";

  const handleCopy = () => {
    navigator.clipboard.writeText("4242424242424242");
    setCopied(true);
    toast.success("Test card number copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border border-teal-500/30 bg-teal-500/5 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
            <CreditCard className="size-4" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <Sparkles className="size-3 text-teal-500" />
              <span>Stripe Test Mode Evaluator Notice</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Use card{" "}
              <code className="font-mono font-bold text-foreground bg-background/80 px-1.5 py-0.5 rounded border border-border">
                {testCardNumber}
              </code>
              , any future expiration date (e.g. <strong className="text-foreground">12/34</strong>), and any 3-digit CVC (e.g. <strong className="text-foreground">123</strong>).
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="shrink-0 text-xs border-teal-500/40 hover:bg-teal-500/10 text-teal-700 dark:text-teal-300"
        >
          {copied ? (
            <>
              <Check className="size-3.5 mr-1.5 text-emerald-500" />
              Card Copied
            </>
          ) : (
            <>
              <Copy className="size-3.5 mr-1.5" />
              Copy Card
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
