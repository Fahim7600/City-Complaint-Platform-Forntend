import * as React from "react";
import Link from "next/link";
import { Building2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DepartmentNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full p-8 rounded-3xl border border-border/80 bg-card/80 text-center space-y-6 shadow-xl backdrop-blur-md">
        <div className="size-16 rounded-3xl bg-muted/80 border border-border flex items-center justify-center mx-auto text-muted-foreground">
          <Building2 className="size-8" />
        </div>

        <div className="space-y-2">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Department Not Found
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The requested municipal department does not exist, has been merged, or was deactivated.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/departments">
            <Button
              size="sm"
              className="text-xs font-semibold bg-gradient-to-r from-teal-500 to-indigo-600 text-white gap-1.5"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to all departments</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
