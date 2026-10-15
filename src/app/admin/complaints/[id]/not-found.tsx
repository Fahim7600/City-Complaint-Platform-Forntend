import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminComplaintNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <div className="rounded-full bg-destructive/10 p-4 text-destructive">
        <AlertCircle className="size-8" />
      </div>
      <h2 className="text-xl font-bold tracking-tight">Complaint Not Found</h2>
      <p className="text-sm text-muted-foreground max-w-md">
        The complaint record you are looking for does not exist or has been removed.
      </p>
      <Button asChild variant="outline">
        <Link href="/admin/complaints">
          <ArrowLeft className="mr-2 size-4" />
          Back to Admin Complaints
        </Link>
      </Button>
    </div>
  );
}
