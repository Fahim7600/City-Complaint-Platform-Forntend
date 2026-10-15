import { Suspense } from "react";
import type { Metadata } from "next";
import { PricingView } from "@/components/admin/pricing/pricing-view";
import { PageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "Premium Subscription Pricing | CityFix Administration",
  description:
    "Review platform premium pricing configuration, Stripe billing parameters, and citizen subscription privileges.",
};

export default function AdminPricingPage() {
  return (
    <Suspense fallback={<PageSkeleton hasStats={true} />}>
      <PricingView />
    </Suspense>
  );
}
