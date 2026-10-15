import * as React from "react";

export default function AboutLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-20 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="h-6 w-32 rounded-full bg-muted/60" />
          <div className="h-12 w-3/4 rounded-2xl bg-muted/60" />
          <div className="space-y-3">
            <div className="h-4 w-full rounded-md bg-muted/40" />
            <div className="h-4 w-5/6 rounded-md bg-muted/40" />
            <div className="h-4 w-4/6 rounded-md bg-muted/40" />
          </div>
        </div>
        <div className="h-80 rounded-3xl bg-muted/50" />
      </div>

      <div className="space-y-6">
        <div className="h-8 w-48 rounded-xl bg-muted/60 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-72 rounded-3xl bg-muted/40" />
          ))}
        </div>
      </div>
    </div>
  );
}
