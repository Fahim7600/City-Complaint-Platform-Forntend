import type { Metadata } from "next";
import { PaymentCancelCard } from "@/components/payment";

export const metadata: Metadata = {
  title: "Payment Cancelled | CityFix",
  description: "Your CityFix subscription checkout session was cancelled.",
};

export default function PaymentCancelPage() {
  return <PaymentCancelCard />;
}
