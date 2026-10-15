"use client";

import * as React from "react";
import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Crown,
  Mail,
  ShieldAlert,
  XCircle,
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

export interface SubscriptionRecord {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  payments: Array<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
  }>;
}

interface PaymentDetailSheetProps {
  record: SubscriptionRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentDetailSheet({
  record,
  open,
  onOpenChange,
}: PaymentDetailSheetProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (text: string, idKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(idKey);
    toast.success("Identifier copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "SUCCEEDED":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold gap-1">
            <CheckCircle2 className="size-3" />
            {status}
          </Badge>
        );
      case "CANCELED":
      case "FAILED":
        return (
          <Badge variant="destructive" className="text-xs font-semibold gap-1">
            <XCircle className="size-3" />
            {status}
          </Badge>
        );
      case "PAST_DUE":
        return (
          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-semibold gap-1">
            <ShieldAlert className="size-3" />
            Past Due
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs font-semibold gap-1">
            <Clock className="size-3 text-muted-foreground" />
            {status}
          </Badge>
        );
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col gap-0 border-l border-border/80 bg-background/95 backdrop-blur-md overflow-hidden"
      >
        {record && (
          <>
            {/* Header */}
            <div className="p-6 border-b border-border/60 bg-muted/20 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="size-11 rounded-2xl border border-violet-500/30 shadow-sm shrink-0">
                    <AvatarFallback className="rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-sm">
                      {record.user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5 min-w-0">
                    <SheetTitle className="font-heading text-base font-bold text-foreground truncate">
                      {record.user.name}
                    </SheetTitle>
                    <SheetDescription className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="size-3" />
                      {record.user.email}
                    </SheetDescription>
                  </div>
                </div>

                <div className="shrink-0">{getStatusBadge(record.status)}</div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Subscription Overview Card */}
              <div className="p-4 rounded-2xl border border-border/70 bg-card/60 space-y-3 text-xs">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Crown className="size-3.5 text-violet-500" />
                  Subscription Parameters
                </h4>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-2.5 rounded-xl bg-background/60 border border-border/50 space-y-0.5">
                    <span className="text-[10px] text-muted-foreground font-medium">Subscription Ref</span>
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono font-bold text-xs text-foreground truncate">
                        #{record.id.slice(0, 12)}...
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(record.id, "subId")}
                        className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                      >
                        {copiedId === "subId" ? (
                          <Check className="size-3 text-emerald-500" />
                        ) : (
                          <Copy className="size-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-background/60 border border-border/50 space-y-0.5">
                    <span className="text-[10px] text-muted-foreground font-medium">Started On</span>
                    <p className="font-medium text-foreground">
                      {formatDate(record.createdAt)}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-background/60 border border-border/50 space-y-0.5">
                    <span className="text-[10px] text-muted-foreground font-medium">Current Period Ends</span>
                    <p className="font-medium text-foreground">
                      {record.currentPeriodEnd ? formatDate(record.currentPeriodEnd) : "Ongoing"}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-background/60 border border-border/50 space-y-0.5">
                    <span className="text-[10px] text-muted-foreground font-medium">Auto Renewal</span>
                    <p className="font-semibold text-foreground">
                      {record.cancelAtPeriodEnd ? "Cancels at period end" : "Active & Auto-renews"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction Payments History */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="size-4 text-emerald-500" />
                  <h4 className="font-heading font-bold text-sm text-foreground">
                    Associated Charge Records ({record.payments.length})
                  </h4>
                </div>

                {record.payments.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
                    No charge invoices recorded under this subscription yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {record.payments.map((p) => {
                      const amountFormatted =
                        p.amount > 100
                          ? (p.amount / 100).toFixed(2)
                          : p.amount.toFixed(2);

                      return (
                        <div
                          key={p.id}
                          className="p-3.5 rounded-xl border border-border/60 bg-card/50 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm text-foreground">
                                {p.currency.toUpperCase()} ${amountFormatted}
                              </span>
                              {getStatusBadge(p.status)}
                            </div>
                            <span className="text-[11px] text-muted-foreground block">
                              Processed on {formatDate(p.createdAt)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="font-mono text-[11px] text-muted-foreground">
                              #{p.id.slice(0, 8)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(p.id, p.id)}
                              className="h-7 w-7 p-0"
                            >
                              {copiedId === p.id ? (
                                <Check className="size-3 text-emerald-500" />
                              ) : (
                                <Copy className="size-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
