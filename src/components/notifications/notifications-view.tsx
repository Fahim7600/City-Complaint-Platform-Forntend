"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  ExternalLink,
  Info,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { notificationService } from "@/services/notification.service";
import { useAuth } from "@/hooks/use-auth";
import { useUrlState } from "@/hooks/use-url-state";
import type { Notification } from "@/types/notification";
import type { Role } from "@/types/user";
import type { PaginatedData } from "@/types/api";
import { cn } from "@/lib/utils";

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getNotificationHref(
  notification: Notification,
  role?: Role | null
): string | null {
  if (!notification.relatedEntityId) return null;

  const id = notification.relatedEntityId;
  switch (role) {
    case "CITIZEN":
      return `/dashboard/complaints/${id}`;
    case "ADMIN":
      return `/admin/complaints/${id}`;
    case "TECHNICIAN":
      return `/technician?id=${id}`;
    case "MANAGER":
      return `/manager?id=${id}`;
    default:
      return `/dashboard/complaints/${id}`;
  }
}

function getNotificationIcon(type: string) {
  const t = type.toLowerCase();
  if (t.includes("status") || t.includes("resolve") || t.includes("success")) {
    return <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />;
  }
  if (t.includes("escalat") || t.includes("urgent") || t.includes("warning")) {
    return <AlertCircle className="size-5 text-rose-500 shrink-0" />;
  }
  if (t.includes("assign") || t.includes("staff")) {
    return <Clock className="size-5 text-sky-500 shrink-0" />;
  }
  return <Info className="size-5 text-violet-500 shrink-0" />;
}

export function NotificationsView() {
  const router = useRouter();
  const { role } = useAuth();
  const queryClient = useQueryClient();
  const { getParam, getNumberParam, setParam } = useUrlState();

  const filter = getParam("filter", "all");
  const isUnreadOnly = filter === "unread";
  const currentPage = getNumberParam("page", 1);
  const limit = 10;

  // Query notifications list
  const queryKey = ["notifications", { page: currentPage, unreadOnly: isUnreadOnly }];
  const { data, isLoading } = useQuery<PaginatedData<Notification>>({
    queryKey,
    queryFn: () =>
      notificationService.getMyNotifications({
        page: currentPage,
        limit,
        unreadOnly: isUnreadOnly ? true : undefined,
      }),
    refetchInterval: 60000,
  });

  const notifications = data?.items || [];
  const meta = {
    page: data?.page || currentPage,
    totalPages: data?.totalPages || 1,
    total: data?.total || 0,
    limit: data?.limit || limit,
  };

  const hasUnread = notifications.some((n) => !n.isRead);

  // Optimistic Mark All As Read
  const markAllMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previous = queryClient.getQueryData<PaginatedData<Notification>>(queryKey);

      if (previous) {
        queryClient.setQueryData<PaginatedData<Notification>>(queryKey, {
          ...previous,
          items: previous.items.map((n) => ({ ...n, isRead: true })),
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
      toast.error("Failed to mark notifications as read.");
    },
    onSuccess: () => {
      toast.success("All notifications marked as read.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // Optimistic Single Item Read
  const markSingleMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previous = queryClient.getQueryData<PaginatedData<Notification>>(queryKey);

      if (previous) {
        queryClient.setQueryData<PaginatedData<Notification>>(queryKey, {
          ...previous,
          items: previous.items.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
      toast.error("Failed to mark notification as read.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleTabChange = (newFilter: "all" | "unread") => {
    if (newFilter === "all") {
      setParam("filter", null, { resetPage: true });
    } else {
      setParam("filter", "unread", { resetPage: true });
    }
  };

  const handleItemClick = (notification: Notification) => {
    if (!notification.isRead) {
      markSingleMutation.mutate(notification.id);
    }
    const targetHref = getNotificationHref(notification, role);
    if (targetHref) {
      router.push(targetHref);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Notifications"
        description="Stay updated with system updates, complaint changes, and department assignments."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllMutation.mutate()}
            disabled={!hasUnread || markAllMutation.isPending}
            className="border-border/70 bg-card/60 gap-1.5 transition-all duration-200"
          >
            <CheckCheck className="size-4 text-primary" />
            <span>Mark all as read</span>
          </Button>
        }
      />

      {/* Filter Tabs synced to URL (?filter=unread) */}
      <div className="flex items-center gap-2 border-b border-border/70 pb-3">
        <button
          type="button"
          onClick={() => handleTabChange("all")}
          className={cn(
            "px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200",
            !isUnreadOnly
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          )}
        >
          All Notifications
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("unread")}
          className={cn(
            "px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5",
            isUnreadOnly
              ? "bg-violet-600 text-white shadow-sm shadow-violet-500/30"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          )}
        >
          <span>Unread Only</span>
          {hasUnread && (
            <span className="size-1.5 rounded-full bg-violet-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card
              key={`notif-skel-${i}`}
              className="border border-border/70 bg-card/60 p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-4 w-3/4" />
            </Card>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="You're all caught up 🎉"
          description={
            isUnreadOnly
              ? "You don't have any unread notifications."
              : "No notifications have been received yet."
          }
          action={
            isUnreadOnly ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTabChange("all")}
                className="gap-2"
              >
                <Sparkles className="size-3.5 text-primary" />
                Show all notifications
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-2.5">
          {notifications.map((item) => {
            const href = getNotificationHref(item, role);

            return (
              <Card
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={cn(
                  "border transition-all duration-200 overflow-hidden group cursor-pointer hover:shadow-md",
                  !item.isRead
                    ? "border-violet-500/30 bg-violet-500/[0.03] dark:bg-violet-500/[0.05] shadow-[0_0_15px_rgba(168,85,247,0.06)]"
                    : "border-border/60 bg-card/60 hover:border-border/80"
                )}
              >
                <CardContent className="p-4 sm:p-5 flex items-start gap-4">
                  {/* Icon */}
                  <div className="mt-0.5">{getNotificationIcon(item.type)}</div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {item.type.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0 font-medium">
                        {formatRelativeTime(item.createdAt)}
                      </span>
                    </div>

                    <p
                      className={cn(
                        "text-sm leading-relaxed",
                        !item.isRead
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.message}
                    </p>

                    {href && (
                      <div className="pt-2">
                        <Link
                          href={href}
                          onClick={() => {
                            if (!item.isRead) {
                              markSingleMutation.mutate(item.id);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                        >
                          <span>View related details</span>
                          <ExternalLink className="size-3" />
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Status Indicator & Mark Read Button */}
                  <div className="flex items-center gap-2 shrink-0 self-center">
                    {!item.isRead ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markSingleMutation.mutate(item.id)}
                        disabled={markSingleMutation.isPending}
                        title="Mark as read"
                        className="h-8 px-2.5 text-xs text-violet-600 dark:text-violet-400 hover:bg-violet-500/10 gap-1 rounded-xl"
                      >
                        <Check className="size-3.5" />
                        <span className="hidden sm:inline">Mark read</span>
                      </Button>
                    ) : (
                      <span
                        className="text-[11px] text-muted-foreground/60 px-2 py-1 rounded"
                        title="Already read"
                      >
                        Read
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination Controls synced to URL ?page= */}
      {data && data.totalPages > 1 && (
        <PaginationControls meta={meta} className="pt-2" />
      )}
    </div>
  );
}
