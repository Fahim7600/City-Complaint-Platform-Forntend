"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  CheckCheck,
  ExternalLink,
  Info,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { notificationService } from "@/services/notification.service";
import { useAuth } from "@/hooks/use-auth";
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
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function getNotificationHref(
  notification: Notification,
  role?: Role | null
): string {
  if (!notification.relatedEntityId) {
    return "/notifications";
  }

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
      return "/notifications";
  }
}

function getNotificationIcon(type: string) {
  const t = type.toLowerCase();
  if (t.includes("status") || t.includes("resolve") || t.includes("success")) {
    return <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />;
  }
  if (t.includes("escalat") || t.includes("urgent") || t.includes("warning")) {
    return <AlertCircle className="size-4 text-rose-500 shrink-0" />;
  }
  if (t.includes("assign") || t.includes("staff")) {
    return <Clock className="size-4 text-sky-500 shrink-0" />;
  }
  return <Info className="size-4 text-violet-500 shrink-0" />;
}

export function NotificationBell() {
  const router = useRouter();
  const { user, role } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = React.useState(false);

  // Fetch recent notifications (limit: 5) with 60s refetch interval
  const { data, isLoading } = useQuery<PaginatedData<Notification>>({
    queryKey: ["notifications", "recent"],
    queryFn: () => notificationService.getMyNotifications({ limit: 5 }),
    refetchInterval: 60000,
    enabled: Boolean(user),
  });

  const notifications = data?.items || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Optimistic Mark All As Read
  const markAllMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previous = queryClient.getQueryData<PaginatedData<Notification>>([
        "notifications",
        "recent",
      ]);

      if (previous) {
        queryClient.setQueryData<PaginatedData<Notification>>(
          ["notifications", "recent"],
          {
            ...previous,
            items: previous.items.map((n) => ({ ...n, isRead: true })),
          }
        );
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["notifications", "recent"],
          context.previous
        );
      }
      toast.error("Failed to mark notifications as read.");
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
      const previous = queryClient.getQueryData<PaginatedData<Notification>>([
        "notifications",
        "recent",
      ]);

      if (previous) {
        queryClient.setQueryData<PaginatedData<Notification>>(
          ["notifications", "recent"],
          {
            ...previous,
            items: previous.items.map((n) =>
              n.id === id ? { ...n, isRead: true } : n
            ),
          }
        );
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["notifications", "recent"],
          context.previous
        );
      }
      toast.error("Failed to update notification.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleItemClick = (notification: Notification) => {
    if (!notification.isRead) {
      markSingleMutation.mutate(notification.id);
    }
    setIsOpen(false);
    const targetHref = getNotificationHref(notification, role);
    router.push(targetHref);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="relative size-9 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-200"
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span
                className={cn(
                  "absolute -top-1 -right-1 flex items-center justify-center rounded-full text-[10px] font-bold",
                  "bg-violet-600 text-white min-w-4 h-4 px-1 shadow-[0_0_10px_rgba(168,85,247,0.7)] animate-pulse"
                )}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        }
      />

      <DropdownMenuContent
        align="end"
        className="w-80 sm:w-96 p-0 border border-border/80 bg-background/95 backdrop-blur-md shadow-2xl rounded-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="font-heading text-sm font-semibold text-foreground">
              Notifications
            </span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[11px] font-medium text-violet-600 dark:text-violet-400">
                {unreadCount} unread
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllMutation.mutate()}
              disabled={markAllMutation.isPending}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
            >
              <CheckCheck className="size-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications list */}
        <div className="max-h-[360px] overflow-y-auto divide-y divide-border/40">
          {isLoading ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-muted/60">
                <Sparkles className="size-5 text-muted-foreground" />
              </div>
              <p className="text-xs font-medium text-foreground">
                All caught up!
              </p>
              <p className="text-[11px] text-muted-foreground">
                No notifications right now.
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={cn(
                  "flex items-start gap-3 p-3.5 cursor-pointer rounded-none transition-colors",
                  !item.isRead
                    ? "bg-violet-500/[0.04] hover:bg-violet-500/[0.08]"
                    : "hover:bg-muted/50"
                )}
              >
                <div className="pt-0.5">{getNotificationIcon(item.type)}</div>
                <div className="flex-1 space-y-1 min-w-0">
                  <p
                    className={cn(
                      "text-xs leading-snug line-clamp-2",
                      !item.isRead
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground font-normal"
                    )}
                  >
                    {item.message}
                  </p>
                  <span className="text-[10px] text-muted-foreground block">
                    {formatRelativeTime(item.createdAt)}
                  </span>
                </div>
                {!item.isRead && (
                  <span className="size-2 rounded-full bg-violet-500 mt-1.5 shrink-0 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>

        <DropdownMenuSeparator className="m-0" />

        {/* Footer */}
        <div className="p-2 bg-muted/20">
          <Link
            href="/notifications"
            onClick={() => setIsOpen(false)}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "w-full text-xs font-medium text-primary hover:text-primary hover:bg-primary/10 justify-center h-8 flex items-center gap-1.5"
            )}
          >
            <span>View all notifications</span>
            <ExternalLink className="size-3" />
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
