"use client";

import * as React from "react";
import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";
import { GoogleOAuthProvider } from "./google-provider";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <GoogleOAuthProvider>
          <TooltipProvider delay={200}>
            {children}
            <Toaster
              position="top-center"
              richColors
              closeButton
              duration={4000}
            />
          </TooltipProvider>
        </GoogleOAuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

export { ThemeProvider, QueryProvider, GoogleOAuthProvider };
