import type { Metadata } from "next";
import { SubscriptionView } from "@/components/citizen/subscription";

export const metadata: Metadata = {
  title: "Premium Subscription | CityFix",
  description:
    "Upgrade to CityFix Premium Citizen for automatic high priority complaint dispatch, enhanced photo uploads, and comprehensive monthly resolution audits.",
};

export default function SubscriptionPage() {
  return <SubscriptionView />;
}
