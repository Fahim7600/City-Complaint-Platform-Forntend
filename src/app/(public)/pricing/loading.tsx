import * as React from "react";

export default function PricingLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-16 animate-pulse">
      <div className="max-w-xl mx-auto space-y-4 text-center">
        <div className="h-6 w-32 rounded-full bg-muted/60 mx-auto" />
        <div className="h-10 w-3/4 rounded-2xl bg-muted/60 mx-auto" />
        <div className="h-4 w-1/2 rounded-md bg-muted/40 mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div className="h-96 rounded-3xl bg-muted/50" />
        <div className="h-96 rounded-3xl bg-muted/60" />
      </div>

      <div className="max-w-5xl mx-auto h-72 rounded-3xl bg-muted/40" />
    </div>
  );
}
