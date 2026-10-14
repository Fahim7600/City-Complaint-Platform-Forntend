"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, RotateCcw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import { useDebounce } from "@/hooks/use-debounce";

interface UsersFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  role: string;
  onRoleChange: (role: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  departmentId: string;
  onDepartmentChange: (departmentId: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export function UsersFilters({
  search,
  onSearchChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
  departmentId,
  onDepartmentChange,
  onClear,
  hasActiveFilters,
}: UsersFiltersProps) {
  const [localSearch, setLocalSearch] = React.useState(search);
  const debouncedSearch = useDebounce(localSearch, 350);

  // Sync debounced search to parent URL state only when localSearch changes
  React.useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  const handleClear = () => {
    setLocalSearch("");
    onClear();
  };

  // Fetch departments for filter
  const { data: departments = [] } = useQuery({
    queryKey: queryKeys.departments.list(),
    queryFn: () => adminService.getDepartments(),
  });

  return (
    <div className="p-4 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm shadow-sm space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
          <Filter className="size-3.5 text-violet-500" />
          <span>User Directory Filters</span>
        </div>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search by Name or Email */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search name or email..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Role Filter */}
        <Select
          value={role || "ALL"}
          onValueChange={(val) => onRoleChange(!val || val === "ALL" ? "" : val)}
        >
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL" className="text-xs">
              All Roles
            </SelectItem>
            <SelectItem value="CITIZEN" className="text-xs">
              Citizens
            </SelectItem>
            <SelectItem value="TECHNICIAN" className="text-xs">
              Technicians
            </SelectItem>
            <SelectItem value="MANAGER" className="text-xs">
              Managers
            </SelectItem>
            <SelectItem value="ADMIN" className="text-xs">
              Administrators
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Account Status Filter */}
        <Select
          value={status || "ALL"}
          onValueChange={(val) => onStatusChange(!val || val === "ALL" ? "" : val)}
        >
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="All Account Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL" className="text-xs">
              All Statuses
            </SelectItem>
            <SelectItem value="active" className="text-xs">
              Active Accounts
            </SelectItem>
            <SelectItem value="deactivated" className="text-xs">
              Deactivated Accounts
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Department Filter */}
        <Select
          value={departmentId || "ALL"}
          onValueChange={(val) => onDepartmentChange(!val || val === "ALL" ? "" : val)}
        >
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL" className="text-xs">
              All Departments
            </SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id} className="text-xs">
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
