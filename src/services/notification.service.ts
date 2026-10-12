import apiClient from "@/lib/axios";
import type { ApiResponse, PaginatedData } from "@/types/api";
import type {
  ListNotificationsQuery,
  Notification,
} from "@/types/notification";

export const notificationService = {
  /**
   * List the authenticated user's notifications.
   */
  async getMyNotifications(
    params?: ListNotificationsQuery
  ): Promise<PaginatedData<Notification>> {
    const res = await apiClient.get<ApiResponse<PaginatedData<Notification>>>(
      "/notifications",
      { params }
    );
    return res.data.data!;
  },

  /**
   * Mark all notifications as read.
   */
  async markAllAsRead(): Promise<{ count: number }> {
    const res = await apiClient.patch<ApiResponse<{ count: number }>>(
      "/notifications/read-all"
    );
    return res.data.data!;
  },

  /**
   * Mark a single notification as read by ID.
   */
  async markAsRead(id: string): Promise<Notification> {
    const res = await apiClient.patch<ApiResponse<Notification>>(
      `/notifications/${id}/read`
    );
    return res.data.data!;
  },
};
