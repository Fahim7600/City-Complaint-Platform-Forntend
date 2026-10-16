import * as React from "react";
import { RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DataUnavailableCardProps {
  title?: string;
  message?: string;
  className?: string;
}

export function DataUnavailableCard({
  title = "Live data is temporarily unavailable — refreshing shortly",
  message = "The municipal data service is synchronizing. This page automatically updates every few minutes via ISR.",
  className = "",
}: DataUnavailableCardProps) {
  return (
    <Card className={`border border-border/80 bg-card/60 backdrop-blur-md shadow-sm ${className}`}>
      <CardContent className="p-6 sm:p-8 text-center space-y-3">
        <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/25 text-teal-600 dark:text-teal-400 mx-auto">
          <RefreshCw className="size-5 animate-spin [animation-duration:6s]" />
        </div>
        <div className="space-y-1">
          <h3 className="font-heading font-bold text-base text-foreground">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            {message}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
