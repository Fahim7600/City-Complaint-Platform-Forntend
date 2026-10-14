import apiClient from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  CancelSubscriptionResult,
  CheckoutSessionResult,
  ConfirmSessionInput,
  ConfirmSessionResult,
  Payment,
  SubscriptionResponse,
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
    const data = res.data.data;
    return {
      url: data?.url || data?.checkoutUrl || "",
      checkoutUrl: data?.url || data?.checkoutUrl || "",
    };
  },

  /**
   * Get the authenticated user's current subscription status and period end.
   */
  async getMySubscription(): Promise<SubscriptionResponse> {
    const res = await apiClient.get<ApiResponse<SubscriptionResponse>>(
      "/payments/subscription"
    );
    return res.data.data || { subscription: null, isPremium: false };
  },

  /**
   * Schedule subscription cancellation at the end of the current billing period.
   */
  async cancelSubscription(): Promise<CancelSubscriptionResult> {
    const res = await apiClient.post<ApiResponse<CancelSubscriptionResult>>(
      "/payments/cancel"
    );
    return res.data.data!;
  },

  /**
   * Confirm and synchronize a Stripe Checkout session after redirect back.
   */
  async confirmSession(
    data: ConfirmSessionInput
  ): Promise<ConfirmSessionResult> {
    const res = await apiClient.post<ApiResponse<ConfirmSessionResult>>(
      "/payments/confirm-session",
      data
    );
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
