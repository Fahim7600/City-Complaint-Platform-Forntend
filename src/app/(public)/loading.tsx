import * as React from "react";

export default function HomeLoading() {
  return (
    <div className="min-h-screen space-y-16 animate-pulse pb-20">
      {/* Hero Skeleton */}
      <div className="h-[75vh] w-full bg-muted/40 flex items-center justify-center p-8">
        <div className="max-w-3xl w-full space-y-6 text-center">
          <div className="h-6 w-48 rounded-full bg-muted/60 mx-auto" />
          <div className="h-14 w-3/4 rounded-2xl bg-muted/60 mx-auto" />
          <div className="h-6 w-1/2 rounded-xl bg-muted/60 mx-auto" />
          <div className="flex justify-center gap-4 pt-4">
            <div className="h-12 w-36 rounded-xl bg-muted/60" />
            <div className="h-12 w-36 rounded-xl bg-muted/60" />
          </div>
        </div>
      </div>

      {/* Stats Strip Skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-3xl border border-border/60 bg-card/60">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-muted/40" />
          ))}
        </div>
      </div>

      {/* Steps Skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="h-8 w-64 rounded-xl bg-muted/50 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-muted/40" />
          ))}
        </div>
      </div>
    </div>
  );
}
