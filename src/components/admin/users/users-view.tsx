"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, UserX, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { UsersFilters } from "./users-filters";
import { UsersTable } from "./users-table";
import { ChangeRoleDialog } from "./change-role-dialog";
import { UserDetailSheet } from "./user-detail-sheet";
import { adminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import { getErrorMessage } from "@/lib/axios";
import { useUrlState } from "@/hooks/use-url-state";
import { useAuth } from "@/hooks/use-auth";
import type { User, Role } from "@/types/user";
import type { PaginatedData } from "@/types/api";

const PAGE_LIMIT = 10;

export function UsersView() {
  const queryClient = useQueryClient();
  const { user: currentAdmin } = useAuth();

  const { getParam, getNumberParam, setParam, setParams } = useUrlState();

  const search = getParam("search", "");
  const role = getParam("role", "");
  const status = getParam("status", "");
  const departmentId = getParam("departmentId", "");
  const selectedUserId = getParam("id", "");
  const currentPage = getNumberParam("page", 1);

  const setSearch = React.useCallback(
    (val: string) => setParams({ search: val, page: 1 }),
    [setParams]
  );
  const setRole = React.useCallback(
    (val: string) => setParams({ role: val, page: 1 }),
    [setParams]
  );
  const setStatus = React.useCallback(
    (val: string) => setParams({ status: val, page: 1 }),
    [setParams]
  );
  const setDepartmentId = React.useCallback(
    (val: string) => setParams({ departmentId: val, page: 1 }),
    [setParams]
  );
  const setSelectedUserId = React.useCallback(
    (id: string) => setParam("id", id || null),
    [setParam]
  );

  // Dialog states
  const [roleDialogOpen, setRoleDialogOpen] = React.useState(false);
  const [targetRoleUser, setTargetRoleUser] = React.useState<User | null>(null);

  const [deactivateDialogOpen, setDeactivateDialogOpen] = React.useState(false);
  const [targetDeactivateUser, setTargetDeactivateUser] = React.useState<User | null>(null);

  const [reactivateDialogOpen, setReactivateDialogOpen] = React.useState(false);
  const [targetReactivateUser, setTargetReactivateUser] = React.useState<User | null>(null);

  // Fetch users with filters
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.users.list({
      page: currentPage,
      limit: PAGE_LIMIT,
      search: search.trim() || undefined,
      role: (role as Role) || undefined,
      departmentId: departmentId || undefined,
      includeDeleted: status === "deactivated" ? true : true, // always include so we can show active and deactivated status accurately
    }),
    queryFn: () =>
      adminService.getUsers({
        page: currentPage,
        limit: PAGE_LIMIT,
        search: search.trim() || undefined,
        role: (role as Role) || undefined,
        departmentId: departmentId || undefined,
        includeDeleted: true,
      }),
  });

  const rawUsers = React.useMemo(() => data?.items || [], [data?.items]);

  // Filter client-side by status if needed
  const filteredUsers = React.useMemo(() => {
    if (status === "active") {
      return rawUsers.filter((u) => !u.deletedAt);
    }
    if (status === "deactivated") {
      return rawUsers.filter((u) => Boolean(u.deletedAt));
    }
    return rawUsers;
  }, [rawUsers, status]);

  const totalPages = data?.totalPages || 1;
  const totalCount = data?.total || 0;

  // Selected user for Sheet
  const selectedUser = React.useMemo(() => {
    if (!selectedUserId) return null;
    return rawUsers.find((u) => u.id === selectedUserId) || null;
  }, [rawUsers, selectedUserId]);

  const hasActiveFilters = Boolean(
    search.trim() || role || status || departmentId
  );

  const handleClearFilters = () => {
    setParams({
      search: undefined,
      role: undefined,
      status: undefined,
      departmentId: undefined,
      page: 1,
    });
  };

  // Deactivate mutation with optimistic update
  const deactivateMutation = useMutation({
    mutationFn: (userId: string) => adminService.deactivateUser(userId),
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.users.all });
      const previousLists = queryClient.getQueriesData<PaginatedData<User>>({
        queryKey: queryKeys.users.all,
      });

      queryClient.setQueriesData<PaginatedData<User>>(
        { queryKey: queryKeys.users.all },
        (old) => {
          if (!old || !old.items) return old;
          return {
            ...old,
            items: old.items.map((u) =>
              u.id === userId
                ? { ...u, deletedAt: new Date().toISOString() }
                : u
            ),
          };
        }
      );

      return { previousLists };
    },
    onError: (err, _val, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([key, val]) => {
          queryClient.setQueryData(key, val);
        });
      }
      toast.error(getErrorMessage(err) || "Failed to deactivate user.");
    },
    onSuccess: () => {
      toast.success("User account deactivated");
      setDeactivateDialogOpen(false);
      setTargetDeactivateUser(null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
    },
  });

  // Reactivate mutation with optimistic update
  const reactivateMutation = useMutation({
    mutationFn: (userId: string) => adminService.reactivateUser(userId),
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.users.all });
      const previousLists = queryClient.getQueriesData<PaginatedData<User>>({
        queryKey: queryKeys.users.all,
      });

      queryClient.setQueriesData<PaginatedData<User>>(
        { queryKey: queryKeys.users.all },
        (old) => {
          if (!old || !old.items) return old;
          return {
            ...old,
            items: old.items.map((u) =>
              u.id === userId ? { ...u, deletedAt: null } : u
            ),
          };
        }
      );

      return { previousLists };
    },
    onError: (err, _val, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([key, val]) => {
          queryClient.setQueryData(key, val);
        });
      }
      toast.error(getErrorMessage(err) || "Failed to reactivate user.");
    },
    onSuccess: () => {
      toast.success("User account reactivated");
      setReactivateDialogOpen(false);
      setTargetReactivateUser(null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
    },
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header */}
      <PageHeader
        title="User management"
        description="Oversee citizen accounts, manage municipal personnel, update roles, and control access permissions."
      />

      {/* 2. Filters */}
      <UsersFilters
        search={search}
        onSearchChange={setSearch}
        role={role}
        onRoleChange={setRole}
        status={status}
        onStatusChange={setStatus}
        departmentId={departmentId}
        onDepartmentChange={setDepartmentId}
        onClear={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 3. Table or Error State */}
      {isError ? (
        <div className="py-20 text-center space-y-3">
          <UserX className="size-8 text-rose-500 mx-auto" />
          <p className="font-semibold text-foreground text-sm">
            Failed to load users directory
          </p>
          <button
            onClick={() => refetch()}
            className="text-xs text-violet-500 hover:underline flex items-center gap-1 mx-auto"
          >
            <RefreshCw className="size-3" /> Retry query
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <UsersTable
            users={filteredUsers}
            isLoading={isLoading}
            currentUserId={currentAdmin?.id}
            onSelectUser={(u) => setSelectedUserId(u.id)}
            onChangeRole={(u) => {
              setTargetRoleUser(u);
              setRoleDialogOpen(true);
            }}
            onDeactivate={(u) => {
              setTargetDeactivateUser(u);
              setDeactivateDialogOpen(true);
            }}
            onReactivate={(u) => {
              setTargetReactivateUser(u);
              setReactivateDialogOpen(true);
            }}
            emptyState={
              <EmptyState
                icon={Users}
                title={
                  hasActiveFilters
                    ? "No users match your filters"
                    : "No users registered yet"
                }
                description={
                  hasActiveFilters
                    ? "Try adjusting your search criteria, role selection, or clearing filters."
                    : "Registered citizens and municipal staff will appear in this directory."
                }
                action={
                  hasActiveFilters
                    ? {
                        label: "Clear filters",
                        onClick: handleClearFilters,
                      }
                    : undefined
                }
              />
            }
          />

          {/* 4. Pagination */}
          {totalPages > 1 && (
            <PaginationControls
              meta={{
                page: currentPage,
                totalPages,
                total: totalCount,
                limit: PAGE_LIMIT,
              }}
            />
          )}
        </div>
      )}

      {/* Change Role Dialog */}
      <ChangeRoleDialog
        user={targetRoleUser}
        open={roleDialogOpen}
        onOpenChange={(open) => {
          setRoleDialogOpen(open);
          if (!open) setTargetRoleUser(null);
        }}
      />

      {/* Deactivate User Confirm Dialog */}
      <ConfirmDialog
        open={deactivateDialogOpen}
        onOpenChange={(open) => {
          setDeactivateDialogOpen(open);
          if (!open) setTargetDeactivateUser(null);
        }}
        title="Deactivate User Account"
        description={
          <span>
            Are you sure you want to deactivate{" "}
            <strong className="text-foreground">
              {targetDeactivateUser?.name}
            </strong>
            ? They will immediately be signed out and unable to log in until reactivated.
          </span>
        }
        confirmText="Deactivate Account"
        variant="destructive"
        isLoading={deactivateMutation.isPending}
        onConfirm={() => {
          if (targetDeactivateUser) {
            deactivateMutation.mutate(targetDeactivateUser.id);
          }
        }}
      />

      {/* Reactivate User Confirm Dialog */}
      <ConfirmDialog
        open={reactivateDialogOpen}
        onOpenChange={(open) => {
          setReactivateDialogOpen(open);
          if (!open) setTargetReactivateUser(null);
        }}
        title="Reactivate User Account"
        description={
          <span>
            Reactivate{" "}
            <strong className="text-foreground">
              {targetReactivateUser?.name}
            </strong>
            &apos;s account? They will regain access to sign in to the platform.
          </span>
        }
        confirmText="Reactivate Account"
        variant="default"
        isLoading={reactivateMutation.isPending}
        onConfirm={() => {
          if (targetReactivateUser) {
            reactivateMutation.mutate(targetReactivateUser.id);
          }
        }}
      />

      {/* User Details Sheet */}
      <UserDetailSheet
        user={selectedUser}
        open={Boolean(selectedUserId)}
        onOpenChange={(open) => {
          if (!open) setSelectedUserId("");
        }}
        isSelf={selectedUser?.id === currentAdmin?.id}
        onChangeRole={(u) => {
          setSelectedUserId("");
          setTargetRoleUser(u);
          setRoleDialogOpen(true);
        }}
        onDeactivate={(u) => {
          setSelectedUserId("");
          setTargetDeactivateUser(u);
          setDeactivateDialogOpen(true);
        }}
        onReactivate={(u) => {
          setSelectedUserId("");
          setTargetReactivateUser(u);
          setReactivateDialogOpen(true);
        }}
      />
    </div>
  );
}
