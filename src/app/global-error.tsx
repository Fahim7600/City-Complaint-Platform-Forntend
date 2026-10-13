"use client";

import * as React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[CityFix Global Root Error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full text-center space-y-6 rounded-2xl border border-red-500/20 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-md">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
            <svg
              className="size-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Critical System Error
            </h1>
            <p className="text-sm text-slate-400">
              The root application layout failed to render. Please try again.
            </p>
          </div>

          {error.message && (
            <div className="rounded-lg border border-red-500/30 bg-red-950/30 p-3 text-xs text-red-300 font-mono break-words text-left">
              {error.message}
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-teal-500 active:scale-[0.98] transition-all"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
