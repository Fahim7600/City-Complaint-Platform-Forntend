"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

export function ToastPreviewButtons() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="default"
        size="sm"
        onClick={() =>
          toast.success("Complaint #CMP-4089 Resolved", {
            description: "Streetlight repair verified by Ward 4 Field Team.",
          })
        }
      >
        <CheckCircle2 className="size-4 mr-1 text-teal-200" />
        Success Toast
      </Button>

      <Button
        variant="destructive"
        size="sm"
        onClick={() =>
          toast.error("Severe Water Main Breach", {
            description: "Emergency crew dispatched to Sector 7. Water valve closed.",
          })
        }
      >
        <AlertTriangle className="size-4 mr-1" />
        Error Toast
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          toast.info("Status Update: In Progress", {
            description: "Inspector assigned to complaint #CMP-5012.",
          })
        }
      >
        <Info className="size-4 mr-1 text-violet-500" />
        Info Toast
      </Button>
    </div>
  );
}
