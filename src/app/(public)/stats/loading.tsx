import * as React from "react";

export default function StatsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-12 animate-pulse">
      <div className="max-w-xl mx-auto space-y-4 text-center">
        <div className="h-6 w-32 rounded-full bg-muted/60 mx-auto" />
        <div className="h-10 w-3/4 rounded-2xl bg-muted/60 mx-auto" />
        <div className="h-4 w-1/2 rounded-md bg-muted/40 mx-auto" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-muted/50" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 h-80 rounded-3xl bg-muted/40" />
        <div className="lg:col-span-4 h-80 rounded-3xl bg-muted/40" />
      </div>
    </div>
  );
}
