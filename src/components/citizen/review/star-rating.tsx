"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StarRating({
  rating,
  maxStars = 5,
  onChange,
  readOnly = false,
  size = "md",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const activeRating = hoverRating !== null ? hoverRating : rating;

  const starSizeClass = {
    sm: "size-4",
    md: "size-6",
    lg: "size-8",
  }[size];

  const handleKeyDown = (e: React.KeyboardEvent, starIndex: number) => {
    if (readOnly || !onChange) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(starIndex);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = Math.min(maxStars, rating + 1);
      onChange(next);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = Math.max(1, rating - 1);
      onChange(prev);
    }
  };

  return (
    <div
      role={readOnly ? "img" : "radiogroup"}
      aria-label={readOnly ? `${rating} out of ${maxStars} stars` : "Rate service"}
      className="inline-flex items-center gap-1.5"
      onMouseLeave={() => !readOnly && setHoverRating(null)}
    >
      {Array.from({ length: maxStars }).map((_, i) => {
        const starNumber = i + 1;
        const isFilled = starNumber <= activeRating;

        if (readOnly) {
          return (
            <Star
              key={`star-${starNumber}`}
              className={cn(
                starSizeClass,
                "transition-colors duration-200",
                isFilled
                  ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]"
                  : "fill-muted text-muted-foreground/40"
              )}
            />
          );
        }

        return (
          <button
            key={`star-btn-${starNumber}`}
            type="button"
            role="radio"
            aria-checked={rating === starNumber}
            aria-label={`Rate ${starNumber} star${starNumber > 1 ? "s" : ""}`}
            tabIndex={rating === starNumber || (rating === 0 && starNumber === 1) ? 0 : -1}
            onMouseEnter={() => setHoverRating(starNumber)}
            onClick={() => onChange?.(starNumber)}
            onKeyDown={(e) => handleKeyDown(e, starNumber)}
            className="p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 transition-transform hover:scale-110 active:scale-95"
          >
            <Star
              className={cn(
                starSizeClass,
                "transition-all duration-200",
                isFilled
                  ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                  : "fill-muted text-muted-foreground/40 hover:text-amber-400/60"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
