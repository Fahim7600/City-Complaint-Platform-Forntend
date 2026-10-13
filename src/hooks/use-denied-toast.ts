"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function useDeniedToast() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasTriggeredRef = React.useRef(false);

  React.useEffect(() => {
    const isDenied = searchParams.get("denied") === "1";

    if (isDenied && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      toast.error("You don't have access to that page.");

      // Clean up ?denied=1 from the URL without triggering navigation reload
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("denied");
      const qs = newParams.toString();
      const cleanUrl = qs ? `${pathname}?${qs}` : pathname;
      router.replace(cleanUrl, { scroll: false });
    }
  }, [pathname, router, searchParams]);
}
