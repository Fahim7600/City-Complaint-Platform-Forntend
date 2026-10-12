"use client";

import * as React from "react";
import { GoogleOAuthProvider as BaseGoogleOAuthProvider } from "@react-oauth/google";
import { env } from "@/lib/env";

interface GoogleOAuthProviderProps {
  children: React.ReactNode;
}

export function GoogleOAuthProvider({ children }: GoogleOAuthProviderProps) {
  // Use client ID from env or a non-empty fallback during development so the provider does not fail
  const clientId = env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "pending-google-client-id.apps.googleusercontent.com";

  return (
    <BaseGoogleOAuthProvider clientId={clientId}>
      {children}
    </BaseGoogleOAuthProvider>
  );
}
