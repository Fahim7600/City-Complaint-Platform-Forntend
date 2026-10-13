import { TableSkeleton } from "@/components/shared/skeletons";

export default function CitizenComplaintsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-16 w-1/3 bg-muted/40 animate-pulse rounded-xl" />
      <div className="h-14 w-full bg-muted/40 animate-pulse rounded-xl" />
      <TableSkeleton rows={8} columns={6} />
    </div>
  );
}
