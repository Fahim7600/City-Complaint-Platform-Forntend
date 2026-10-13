import { Suspense } from "react";
import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Register a citizen account on CityFix to file complaints and track community civic services.",
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
