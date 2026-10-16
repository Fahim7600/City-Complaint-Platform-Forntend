import type { Metadata } from "next";
import { SetPasswordForm } from "@/components/auth/set-password-form";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Set New Password — ${siteConfig.name}`,
  description:
    "Set a secure password for your invited CityFix staff account to complete onboarding.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SetPasswordPage() {
  return <SetPasswordForm />;
}
