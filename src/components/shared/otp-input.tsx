"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  hasError = false,
  autoFocus = true,
  className,
}: OtpInputProps) {
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

  // Autofocus first input on mount
  React.useEffect(() => {
    if (autoFocus && inputsRef.current[0] && !disabled) {
      inputsRef.current[0].focus();
    }
  }, [autoFocus, disabled]);

  const digits = React.useMemo(() => {
    const arr: string[] = [];
    for (let i = 0; i < length; i++) {
      arr.push(value[i] || "");
    }
    return arr;
  }, [value, length]);

  const handleChange = (index: number, char: string) => {
    // Only accept numeric characters
    const cleanChar = char.replace(/\D/g, "");
    if (!cleanChar && char !== "") return;

    const newDigits = [...digits];
    newDigits[index] = cleanChar.slice(-1); // Take last digit if multiple

    const newValue = newDigits.join("");
    onChange(newValue);

    // Auto-advance
    if (cleanChar && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
      inputsRef.current[index + 1]?.select();
    }

    // Auto-complete
    if (newValue.length === length) {
      onComplete?.(newValue);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // Move to previous box and delete
        e.preventDefault();
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        const newValue = newDigits.join("");
        onChange(newValue);
        inputsRef.current[index - 1]?.focus();
      } else {
        // Clear current box
        const newDigits = [...digits];
        newDigits[index] = "";
        onChange(newDigits.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
      inputsRef.current[index - 1]?.select();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
      inputsRef.current[index + 1]?.select();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text/plain").trim();
    const cleanNumbers = pastedText.replace(/\D/g, "").slice(0, length);

    if (cleanNumbers) {
      onChange(cleanNumbers);
      const targetIndex = Math.min(cleanNumbers.length, length - 1);
      inputsRef.current[targetIndex]?.focus();

      if (cleanNumbers.length === length) {
        onComplete?.(cleanNumbers);
      }
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 sm:gap-3",
        hasError && "motion-safe:animate-shake",
        className
      )}
      style={
        hasError
          ? {
              animation: "shake 0.5s cubic-bezier(.36,.07,.19,.97) both",
            }
          : undefined
      }
    >
      <style jsx global>{`
        @keyframes shake {
          10%,
          90% {
            transform: translate3d(-1px, 0, 0);
          }
          20%,
          80% {
            transform: translate3d(2px, 0, 0);
          }
          30%,
          50%,
          70% {
            transform: translate3d(-4px, 0, 0);
          }
          40%,
          60% {
            transform: translate3d(4px, 0, 0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-shake {
            animation: none !important;
          }
        }
      `}</style>

      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputsRef.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={idx === 0 ? "one-time-code" : "off"}
          pattern="[0-9]*"
          maxLength={1}
          value={digits[idx]}
          disabled={disabled}
          aria-label={`Digit ${idx + 1} of ${length}`}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={cn(
            "size-11 sm:size-13 text-center font-mono text-xl sm:text-2xl font-bold rounded-xl transition-all duration-200 outline-none select-none",
            "border border-border/80 bg-background/80 text-foreground",
            "focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 focus:shadow-[0_0_15px_rgba(168,85,247,0.35)]",
            hasError &&
              "border-destructive text-destructive focus:border-destructive focus:ring-destructive/20 focus:shadow-none",
            disabled && "opacity-50 cursor-not-allowed bg-muted/40"
          )}
        />
      ))}
    </div>
  );
}
