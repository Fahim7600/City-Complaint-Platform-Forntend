import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Forgot Password — ${siteConfig.name}`,
  description: "Request a 6-digit verification code to reset your CityFix account password.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
