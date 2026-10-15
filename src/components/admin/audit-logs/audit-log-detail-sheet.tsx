"use client";

import * as React from "react";
import Link from "next/link";
import {
  Check,
  Code,
  Copy,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/format-date";
import type { AuditLog } from "@/types/audit-log";

interface AuditLogDetailSheetProps {
  log: AuditLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuditLogDetailSheet({
  log,
  open,
  onOpenChange,
}: AuditLogDetailSheetProps) {
  const [copied, setCopied] = React.useState(false);

  let jsonString = "null";
  if (log?.metadata) {
    try {
      jsonString = JSON.stringify(log.metadata, null, 2);
    } catch {
      jsonString = String(log.metadata);
    }
  }

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    toast.success("Metadata JSON copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const getEntityLink = (entityType: string, entityId: string) => {
    switch (entityType.toLowerCase()) {
      case "complaint":
        return `/admin/complaints?id=${entityId}`;
      case "user":
        return `/admin/users?id=${entityId}`;
      case "department":
        return `/admin/departments?id=${entityId}`;
      case "category":
        return `/admin/categories?q=${entityId}`;
      default:
        return null;
    }
  };

  const entityLink = log ? getEntityLink(log.entityType, log.entityId) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col gap-0 border-l border-border/80 bg-background/95 backdrop-blur-md overflow-hidden"
      >
        {log && (
          <>
            {/* Header */}
            <div className="p-6 border-b border-border/60 bg-muted/20 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="font-mono text-[11px] font-bold">
                      {log.action}
                    </Badge>
                    <Badge className="bg-background text-foreground border border-border text-[10px]">
                      {log.entityType}
                    </Badge>
                  </div>
                  <SheetTitle className="font-heading text-base font-bold text-foreground">
                    Audit Log Entry #{log.id.slice(0, 8)}
                  </SheetTitle>
                  <SheetDescription className="text-xs text-muted-foreground">
                    Recorded {formatDate(log.createdAt)}
                  </SheetDescription>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Actor & Entity Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Actor Info */}
                <div className="p-3.5 rounded-2xl border border-border/70 bg-card/60 space-y-2">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">
                    Executing Actor
                  </span>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar className="size-8 rounded-lg border border-border/60">
                      <AvatarFallback className="rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs">
                        {(log.actor?.name || "AD").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 space-y-0.5">
                      <p className="font-bold text-foreground text-xs truncate">
                        {log.actor?.name || "System Administrator"}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {log.actor?.email || log.actorId}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Target Entity */}
                <div className="p-3.5 rounded-2xl border border-border/70 bg-card/60 space-y-2">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">
                    Target Entity
                  </span>
                  <div className="space-y-1 min-w-0">
                    <p className="font-bold text-foreground text-xs">
                      {log.entityType}
                    </p>
                    <p className="font-mono text-[11px] text-muted-foreground truncate">
                      ID: {log.entityId}
                    </p>
                    {entityLink && (
                      <Link
                        href={entityLink}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-600 dark:text-violet-400 hover:underline pt-0.5"
                      >
                        Inspect target {log.entityType.toLowerCase()}
                        <ExternalLink className="size-2.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* JSON Metadata Diff View */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Code className="size-3.5 text-violet-500" />
                    Audit Metadata &amp; State Payload
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyJson}
                    className="h-7 px-2.5 text-[11px] gap-1 border-border/70"
                  >
                    {copied ? (
                      <>
                        <Check className="size-3 text-emerald-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        Copy JSON
                      </>
                    )}
                  </Button>
                </div>

                <div className="relative rounded-2xl border border-border/80 bg-zinc-950 p-4 font-mono text-[11px] text-emerald-400 overflow-x-auto shadow-inner">
                  <pre className="whitespace-pre leading-relaxed">
                    {jsonString}
                  </pre>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
