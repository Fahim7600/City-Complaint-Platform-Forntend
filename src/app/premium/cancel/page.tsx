import type { Metadata } from "next";
import { PaymentCancelCard } from "@/components/payment";

export const metadata: Metadata = {
  title: "Subscription Cancelled | CityFix",
  description: "Your CityFix subscription checkout session was cancelled.",
};

export default function PremiumCancelPage() {
  return <PaymentCancelCard />;
}
