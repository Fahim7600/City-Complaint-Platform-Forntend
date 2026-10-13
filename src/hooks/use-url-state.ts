"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface SetParamsOptions {
  resetPage?: boolean;
  scroll?: boolean;
}

export function useUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getParam = React.useCallback(
    (key: string, defaultValue = ""): string => {
      return searchParams.get(key) ?? defaultValue;
    },
    [searchParams]
  );

  const getNumberParam = React.useCallback(
    (key: string, defaultValue = 1): number => {
      const val = searchParams.get(key);
      if (!val) return defaultValue;
      const num = Number.parseInt(val, 10);
      return Number.isNaN(num) ? defaultValue : num;
    },
    [searchParams]
  );

  const setParams = React.useCallback(
    (
      updates: Record<string, string | number | boolean | null | undefined>,
      options: SetParamsOptions = {}
    ) => {
      const params = new URLSearchParams(searchParams.toString());
      const hasPageUpdate = "page" in updates;

      // If we are updating search/filter criteria and not explicitly setting page, reset page to 1
      const shouldResetPage = options.resetPage ?? (!hasPageUpdate);

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }

      if (shouldResetPage && !hasPageUpdate && params.has("page")) {
        params.set("page", "1");
      }

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(targetUrl, { scroll: options.scroll ?? false });
    },
    [pathname, router, searchParams]
  );

  const setParam = React.useCallback(
    (
      key: string,
      value: string | number | boolean | null | undefined,
      options: SetParamsOptions = {}
    ) => {
      setParams({ [key]: value }, options);
    },
    [setParams]
  );

  const removeParam = React.useCallback(
    (key: string, options: SetParamsOptions = {}) => {
      setParams({ [key]: null }, options);
    },
    [setParams]
  );

  return {
    searchParams,
    getParam,
    getNumberParam,
    setParam,
    setParams,
    removeParam,
  };
}
