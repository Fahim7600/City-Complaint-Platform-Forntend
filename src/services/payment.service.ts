import apiClient from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  CheckoutSessionResult,
  ConfirmSessionInput,
  Payment,
  Subscription,
} from "@/types/payment";

export const paymentService = {
  /**
   * Create a Stripe Checkout session for Citizen Premium subscription.
   * Returns the Stripe checkout redirect URL.
   */
  async createPremiumCheckout(): Promise<CheckoutSessionResult> {
    const res = await apiClient.post<ApiResponse<CheckoutSessionResult>>(
      "/payments/checkout-session"
    );
    return res.data.data!;
  },

  /**
   * Get the authenticated user's current subscription status and period end.
   */
  async getMySubscription(): Promise<Subscription | null> {
    const res = await apiClient.get<ApiResponse<Subscription | null>>(
      "/payments/subscription"
    );
    return res.data.data ?? null;
  },

  /**
   * Schedule subscription cancellation at the end of the current billing period.
   */
  async cancelSubscription(): Promise<Subscription> {
    const res = await apiClient.post<ApiResponse<Subscription>>(
      "/payments/cancel"
    );
    return res.data.data!;
  },

  /**
   * Confirm and synchronize a Stripe Checkout session after redirect back.
   */
  async confirmSession(
    data: ConfirmSessionInput
  ): Promise<{ status: string; subscription?: Subscription }> {
    const res = await apiClient.post<
      ApiResponse<{ status: string; subscription?: Subscription }>
    >("/payments/confirm-session", data);
    return res.data.data!;
  },

  /**
   * Get receipt/payment details by ID.
   */
  async getPaymentById(id: string): Promise<Payment> {
    const res = await apiClient.get<ApiResponse<Payment>>(`/payments/${id}`);
    return res.data.data!;
  },
};
