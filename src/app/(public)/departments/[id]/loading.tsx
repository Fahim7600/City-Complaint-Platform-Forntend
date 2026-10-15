import * as React from "react";

export default function DepartmentDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-pulse">
      <div className="h-4 w-28 rounded-md bg-muted/60" />

      {/* Header skeleton */}
      <div className="rounded-3xl border border-border/80 bg-card/60 p-8 space-y-6">
        <div className="flex items-center gap-5">
          <div className="size-20 rounded-3xl bg-muted/60 shrink-0" />
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-muted/60" />
            <div className="h-8 w-64 rounded-xl bg-muted/60" />
          </div>
        </div>
        <div className="h-12 w-full rounded-xl bg-muted/40" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border/50">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-2xl bg-muted/40" />
          ))}
        </div>
      </div>

      {/* Techs skeleton */}
      <div className="space-y-6">
        <div className="h-6 w-48 rounded bg-muted/60" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-muted/40" />
          ))}
        </div>
      </div>
    </div>
  );
}
