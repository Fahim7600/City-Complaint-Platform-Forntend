import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Reset Password — ${siteConfig.name}`,
  description: "Set a new secure password for your CityFix account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
