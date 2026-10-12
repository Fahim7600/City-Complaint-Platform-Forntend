import type { User } from "./user";

export const SubscriptionStatus = {
  ACTIVE: "ACTIVE",
  CANCELED: "CANCELED",
  PAST_DUE: "PAST_DUE",
  INCOMPLETE: "INCOMPLETE",
} as const;

export type SubscriptionStatus =
  (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export const PaymentStatus = {
  PENDING: "PENDING",
  SUCCEEDED: "SUCCEEDED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

export type PaymentStatus =
  (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentPurpose = {
  PREMIUM_SUBSCRIPTION: "PREMIUM_SUBSCRIPTION",
} as const;

export type PaymentPurpose =
  (typeof PaymentPurpose)[keyof typeof PaymentPurpose];

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  stripePaymentIntentId: string | null;
  stripeInvoiceId: string | null;
  status: PaymentStatus;
  purpose: PaymentPurpose;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface PremiumPrice {
  amount: number;
  currency: string;
  interval: string | null;
}

export interface PublicPremiumInfo {
  benefits: string[];
  price: PremiumPrice | null;
}

export interface AdminPremiumPricing {
  priceId: string;
  productName: string;
  amount: number;
  currency: string;
  interval: string | null;
  active: boolean;
}

export interface CheckoutSessionResult {
  checkoutUrl: string;
}

export interface ConfirmSessionInput {
  sessionId: string;
}

export interface ListPaymentsQuery {
  page?: number;
  limit?: number;
  status?: SubscriptionStatus;
  userId?: string;
}
