import { Suspense } from "react";
import type { Metadata } from "next";
import { PaymentsView } from "@/components/admin/payments/payments-view";
import { PageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "Payment History & Revenue | CityFix Administration",
  description:
    "Audit platform payment records, recurring citizen subscriptions, Stripe transactions, and municipal revenue.",
};

export default function AdminPaymentsPage() {
  return (
    <Suspense fallback={<PageSkeleton hasStats={true} />}>
      <PaymentsView />
    </Suspense>
  );
}
