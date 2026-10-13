"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, MessageSquare, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from "./star-rating";
import { complaintService } from "@/services/complaint.service";
import { queryKeys } from "@/lib/query-keys";
import { formatRelativeTime } from "@/lib/format-date";
import { getErrorMessage } from "@/lib/axios";
import { ComplaintStatus, type Complaint } from "@/types/complaint";
import { cn } from "@/lib/utils";

const reviewSchema = z.object({
  rating: z.number().int().min(1, "Please choose a rating between 1 and 5 stars").max(5),
  comment: z.string().max(1000, "Comment cannot exceed 1000 characters").optional(),
});

interface ComplaintReviewSectionProps {
  complaint: Complaint;
}

export function ComplaintReviewSection({
  complaint,
}: ComplaintReviewSectionProps) {
  const queryClient = useQueryClient();

  const [rating, setRating] = React.useState<number>(5);
  const [comment, setComment] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Check if review already exists
  const { data: existingReview, isLoading } = useQuery({
    queryKey: queryKeys.complaints.review(complaint.id),
    queryFn: () => complaintService.getReview(complaint.id),
    retry: false, // 404 is expected if not reviewed yet
  });

  // Review can only be filed when RESOLVED or CLOSED, and technician was assigned
  const canReview =
    (complaint.status === ComplaintStatus.RESOLVED ||
      complaint.status === ComplaintStatus.CLOSED) &&
    Boolean(complaint.assignedTechnicianId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = reviewSchema.safeParse({ rating, comment: comment.trim() || undefined });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Invalid review");
      return;
    }

    setIsSubmitting(true);
    try {
      await complaintService.review(complaint.id, {
        rating,
        comment: comment.trim() || undefined,
      });

      toast.success("Thanks for your feedback!");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.complaints.review(complaint.id),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.complaints.detail(complaint.id),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.public.all,
        }),
      ]);
    } catch (err) {
      toast.error(getErrorMessage(err) || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return null;
  }

  // If review exists: Show read-only review card
  if (existingReview) {
    return (
      <Card className="border border-amber-500/30 bg-amber-500/5 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-amber-500 fill-amber-500" />
              <h4 className="font-heading text-sm font-semibold text-foreground">
                Your Review
              </h4>
            </div>
            <span className="text-[11px] text-muted-foreground">
              {formatRelativeTime(existingReview.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <StarRating rating={existingReview.rating} readOnly size="sm" />
            <span className="text-xs font-bold text-amber-500">
              {existingReview.rating} / 5
            </span>
          </div>

          {existingReview.comment && (
            <p className="text-xs text-muted-foreground italic border-l-2 border-amber-500/30 pl-3 py-0.5">
              &ldquo;{existingReview.comment}&rdquo;
            </p>
          )}

          <div className="flex items-center gap-1.5 pt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="size-3.5" />
            <span>Immutable review recorded</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If cannot review (e.g. not resolved or unassigned)
  if (!canReview) {
    return null;
  }

  // Show "Rate this service" interactive card
  return (
    <Card className="border border-border/70 bg-card/60 backdrop-blur-sm overflow-hidden shadow-sm">
      <CardContent className="p-5 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <MessageSquare className="size-3.5" />
            </div>
            <h4 className="font-heading text-sm font-semibold text-foreground">
              Rate this Service
            </h4>
          </div>
          <p className="text-xs text-muted-foreground">
            How satisfied are you with the municipal repair work performed by the technician?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Star selector */}
          <div className="flex items-center justify-between py-1">
            <span className="text-xs font-semibold text-foreground">Rating:</span>
            <StarRating rating={rating} onChange={setRating} size="md" />
          </div>

          {/* Comment Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="review-comment" className="text-xs font-medium text-muted-foreground">
                Comments (Optional)
              </Label>
              <span className="text-[11px] text-muted-foreground font-mono">
                {comment.length}/1000
              </span>
            </div>
            <Textarea
              id="review-comment"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setError(null);
              }}
              maxLength={1000}
              rows={3}
              placeholder="Share your experience with the repair speed, quality, and technician communication..."
              className={cn(
                "resize-none text-xs bg-background/80 border-border/70 focus-visible:ring-amber-400/40",
                error && "border-destructive focus-visible:ring-destructive/30"
              )}
            />
            {error && (
              <p className="text-xs font-medium text-destructive">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="w-full text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                Submitting Review...
              </>
            ) : (
              <>
                <Send className="size-3.5 mr-1.5" />
                Submit Review
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
