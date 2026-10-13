"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUrlState } from "@/hooks/use-url-state";
import { cn } from "@/lib/utils";

export interface FilterSelectOption {
  label: string;
  value: string;
}

export interface FilterSelectProps {
  paramKey: string;
  options: FilterSelectOption[];
  placeholder?: string;
  allLabel?: string;
  defaultValue?: string;
  className?: string;
  ariaLabel?: string;
}

export function FilterSelect({
  paramKey,
  options,
  placeholder = "Filter by...",
  allLabel = "All",
  defaultValue = "",
  className,
  ariaLabel,
}: FilterSelectProps) {
  const { getParam, setParam } = useUrlState();
  const currentVal = getParam(paramKey, defaultValue);

  // In Select, value cannot be empty string for SelectItem, so we use "__all__" for resetting
  const selectValue = currentVal || "__all__";

  const handleValueChange = (val: string | null) => {
    if (!val || val === "__all__") {
      setParam(paramKey, null, { resetPage: true });
    } else {
      setParam(paramKey, val, { resetPage: true });
    }
  };

  return (
    <Select
      value={selectValue}
      onValueChange={handleValueChange}
      aria-label={ariaLabel || placeholder}
    >
      <SelectTrigger
        className={cn(
          "h-9 w-full min-w-[140px] max-w-[200px] bg-background/80 border-border/70 text-xs focus:ring-primary/30",
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allLabel && (
          <SelectItem value="__all__" className="text-xs">
            {allLabel}
          </SelectItem>
        )}
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="text-xs">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
