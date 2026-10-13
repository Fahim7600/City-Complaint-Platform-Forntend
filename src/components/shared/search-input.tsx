"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUrlState } from "@/hooks/use-url-state";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  /**
   * If provided, SearchInput binds directly to this URL search param.
   * Defaults to undefined (which allows controlled/uncontrolled mode).
   */
  paramKey?: string;
  value?: string;
  onChange?: (value: string) => void;
  debounceMs?: number;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  paramKey,
  value: controlledValue,
  onChange,
  debounceMs = 350,
  placeholder = "Search...",
  className,
  ...props
}: SearchInputProps) {
  const { getParam, setParam } = useUrlState();

  const urlValue = paramKey ? getParam(paramKey, "") : "";
  const [internalValue, setInternalValue] = React.useState<string>(
    controlledValue ?? urlValue
  );

  const [prevControlled, setPrevControlled] = React.useState(controlledValue);
  const [prevUrlValue, setPrevUrlValue] = React.useState(urlValue);

  // Sync state during render when controlledValue or external URL changes
  if (controlledValue !== undefined && controlledValue !== prevControlled) {
    setPrevControlled(controlledValue);
    setInternalValue(controlledValue);
  } else if (
    paramKey &&
    controlledValue === undefined &&
    urlValue !== prevUrlValue
  ) {
    setPrevUrlValue(urlValue);
    setInternalValue(urlValue);
  }

  const debouncedValue = useDebounce(internalValue, debounceMs);

  // Trigger onChange or update URL param when debounced value changes
  const isFirstMount = React.useRef(true);
  React.useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (onChange) {
      onChange(debouncedValue);
    }

    if (paramKey) {
      const currentInUrl = getParam(paramKey, "");
      if (currentInUrl !== debouncedValue) {
        setParam(paramKey, debouncedValue.trim() || null, { resetPage: true });
      }
    }
  }, [debouncedValue, onChange, paramKey, setParam, getParam]);

  const handleClear = () => {
    setInternalValue("");
    if (onChange) onChange("");
    if (paramKey) {
      setParam(paramKey, null, { resetPage: true });
    }
  };

  return (
    <div className={cn("relative flex items-center w-full max-w-sm", className)}>
      <Search className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9 h-9 bg-background/80 border-border/70 focus-visible:ring-primary/30"
        {...props}
      />
      {internalValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 p-0.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
