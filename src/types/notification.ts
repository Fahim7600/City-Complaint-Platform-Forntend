export interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface ListNotificationsQuery {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}
