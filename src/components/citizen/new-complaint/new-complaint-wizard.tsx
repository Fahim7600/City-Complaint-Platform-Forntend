"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Crown,
  Loader2,
  Sparkles,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { PageSkeleton } from "@/components/shared/skeletons";
import { StepIndicator } from "./step-indicator";
import { Step1Category } from "./step1-category";
import { Step2Details } from "./step2-details";
import { Step3Location } from "./step3-location";
import { Step4Photos } from "./step4-photos";
import { Step5Review } from "./step5-review";
import {
  step1CategorySchema,
  step2DetailsSchema,
  step3LocationSchema,
  FREE_TIER_MAX_FILES,
  PREMIUM_TIER_MAX_FILES,
} from "./wizard-schemas";
import { useComplaintDraftStore } from "@/store/complaint-draft-store";
import { useAuth } from "@/hooks/use-auth";
import { complaintService } from "@/services/complaint.service";
import { queryKeys } from "@/lib/query-keys";
import { getErrorMessage } from "@/lib/axios";
import { formatDate } from "@/lib/format-date";
import { AttachmentType, Priority } from "@/types/complaint";

export function NewComplaintWizard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Check quota usage on load
  const {
    data: usage,
    isLoading: isUsageLoading,
  } = useQuery({
    queryKey: queryKeys.complaints.usage(),
    queryFn: complaintService.getUsage,
  });

  // Draft store
  const {
    currentStep,
    category,
    details,
    location,
    files,
    filePreviews,
    setCurrentStep,
    setCategory,
    setDetails,
    setLocation,
    addFiles,
    removeFile,
    clearDraft,
  } = useComplaintDraftStore();

  const [stepErrors, setStepErrors] = React.useState<Record<string, string>>({});
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);

  const isPremium = Boolean(user?.isPremium || usage?.isPremium);
  const maxFiles = isPremium ? PREMIUM_TIER_MAX_FILES : FREE_TIER_MAX_FILES;

  // Quota check logic
  const numericLimit = typeof usage?.limit === "number" ? usage.limit : 5;
  const isUnlimited = usage?.limit === "unlimited" || usage?.limit === "UNLIMITED";
  const isQuotaReached = !isUnlimited && usage && usage.used >= numericLimit;

  // Validate step before advancing
  const validateStep = (step: number): boolean => {
    setStepErrors({});

    if (step === 1) {
      const result = step1CategorySchema.safeParse({
        categoryId: category?.id,
      });
      if (!result.success) {
        setStepErrors({
          category: result.error.issues[0]?.message || "Please select a category",
        });
        return false;
      }
      return true;
    }

    if (step === 2) {
      const result = step2DetailsSchema.safeParse(details);
      if (!result.success) {
        const errorsMap: Record<string, string> = {};
        for (const issue of result.error.issues) {
          const field = String(issue.path[0]);
          errorsMap[field] = issue.message;
        }
        setStepErrors(errorsMap);
        return false;
      }
      return true;
    }

    if (step === 3) {
      const result = step3LocationSchema.safeParse({
        location: location.address,
      });
      if (!result.success) {
        setStepErrors({
          location: result.error.issues[0]?.message || "Location is required",
        });
        return false;
      }
      return true;
    }

    // Step 4 (Photos) is optional
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(5, currentStep + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setStepErrors({});
    setCurrentStep(Math.max(1, currentStep - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleJumpToStep = (step: number) => {
    setStepErrors({});
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    clearDraft();
    setShowCancelDialog(false);
    toast.info("Complaint draft discarded.");
    router.push("/dashboard/complaints");
  };

  const handleSubmit = async () => {
    if (!category || !details.title || !details.description || !location.address) {
      toast.error("Please fill in all required fields before submitting.");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(null);

    try {
      // 1. Create the complaint via POST /complaints
      const newComplaint = await complaintService.create({
        title: details.title.trim(),
        description: details.description.trim(),
        categoryId: category.id,
        location: location.address.trim(),
        priority: isPremium ? Priority.HIGH : details.priority,
      });

      // 2. If attachments are present, upload separately via POST /complaints/:id/attachments
      if (files.length > 0) {
        setUploadProgress(5);
        await complaintService.uploadAttachments(
          newComplaint.id,
          files,
          AttachmentType.EVIDENCE,
          (progress) => {
            setUploadProgress(progress);
          }
        );
      }

      // 3. Clear draft from store & sessionStorage
      clearDraft();

      // 4. Invalidate relevant queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.complaints.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.complaints.usage() }),
      ]);

      // 5. Success toast & redirect
      toast.success(
        `Complaint filed! We've sent it to ${category.departmentName || "Municipal Services"}`
      );
      router.push(`/dashboard/complaints/${newComplaint.id}`);
    } catch (err: unknown) {
      setIsSubmitting(false);
      setUploadProgress(null);
      const msg = getErrorMessage(err);

      if (msg.toLowerCase().includes("limit") || msg.toLowerCase().includes("quota")) {
        toast.error("Monthly quota limit reached. Upgrade to Premium for a higher complaint limit.");
      } else {
        toast.error(msg || "Failed to submit complaint. Please check your inputs.");
      }
    }
  };

  if (isUsageLoading) {
    return <PageSkeleton hasStats={false} />;
  }

  // Quota reached warning card
  if (isQuotaReached) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <Card className="border-amber-500/40 bg-card/90 backdrop-blur-md p-8 text-center space-y-6 shadow-xl">
          <div className="flex size-16 mx-auto items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <AlertTriangle className="size-8" />
          </div>

          <div className="space-y-2">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Monthly Complaint Limit Reached
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              You&apos;ve used all <strong className="text-foreground">{numericLimit} complaints</strong> for this billing cycle.
              Your quota will automatically reset on <strong className="text-foreground">{formatDate(usage?.resetsAt)}</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/pricing" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 text-white font-semibold shadow-[0_0_20px_rgba(124,58,237,0.4)]">
                <Crown className="size-4 mr-2" />
                Upgrade to Premium
              </Button>
            </Link>

            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                Return to Overview
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Wizard Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-violet-500 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
          <Sparkles className="size-3.5" />
          CityFix Citizen Dispatch
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          File a New Complaint
        </h1>
        <p className="text-sm text-muted-foreground">
          Complete the guided steps below to alert municipal emergency and maintenance crews.
        </p>
      </div>

      {/* Step Indicator */}
      <Card className="border border-border/70 bg-card/60 backdrop-blur-sm p-4 sm:p-6">
        <StepIndicator
          currentStep={currentStep}
          onStepClick={(step) => handleJumpToStep(step)}
        />
      </Card>

      {/* Upload Progress Bar if submitting */}
      {uploadProgress !== null && (
        <Card className="border border-violet-500/30 bg-violet-500/10 p-4 space-y-2 animate-pulse">
          <div className="flex items-center justify-between text-xs font-semibold text-violet-600 dark:text-violet-300">
            <span>Uploading photo attachments...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-violet-950/40 overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </Card>
      )}

      {/* Step Content */}
      <Card className="border border-border/70 bg-card/70 backdrop-blur-md p-6 sm:p-8 transition-all duration-300">
        {currentStep === 1 && (
          <Step1Category
            selectedCategoryId={category?.id}
            error={stepErrors.category}
            onSelectCategory={(cat) => {
              setCategory(cat);
              setStepErrors({});
            }}
          />
        )}

        {currentStep === 2 && (
          <Step2Details
            title={details.title}
            description={details.description}
            priority={details.priority}
            isPremium={isPremium}
            errors={stepErrors}
            onChange={(field, val) => {
              setDetails({ [field]: val });
              setStepErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
              });
            }}
          />
        )}

        {currentStep === 3 && (
          <Step3Location
            location={location.address}
            error={stepErrors.location}
            onChange={(val, coords) => {
              setLocation({ address: val, lat: coords?.lat, lng: coords?.lng });
              setStepErrors((prev) => {
                const next = { ...prev };
                delete next.location;
                return next;
              });
            }}
          />
        )}

        {currentStep === 4 && (
          <Step4Photos
            files={files}
            previews={filePreviews}
            maxFiles={maxFiles}
            onAddFiles={(newFiles) => addFiles(newFiles, maxFiles)}
            onRemoveFile={(idx) => removeFile(idx)}
          />
        )}

        {currentStep === 5 && (
          <Step5Review
            category={category}
            details={details}
            location={location}
            files={files}
            filePreviews={filePreviews}
            isPremium={isPremium}
            onJumpToStep={handleJumpToStep}
          />
        )}

        {/* Wizard Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-border/60 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Cancel button: variant="destructive" red */}
          <Button
            type="button"
            variant="destructive"
            onClick={() => setShowCancelDialog(true)}
            disabled={isSubmitting}
            className="w-full sm:w-auto font-medium"
          >
            <XCircle className="size-4 mr-1.5" />
            Cancel
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting}
                className="flex-1 sm:flex-initial"
              >
                <ArrowLeft className="size-4 mr-1.5" />
                Back
              </Button>
            )}

            {currentStep < 5 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className="flex-1 sm:flex-initial bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm"
              >
                Next
                <ArrowRight className="size-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 sm:flex-initial bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_25px_rgba(124,58,237,0.6)]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Submitting complaint...
                  </>
                ) : (
                  <>
                    <Check className="size-4 mr-2" />
                    Submit complaint
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Discard Confirm Dialog */}
      <ConfirmDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title="Discard this complaint?"
        description="All entered details and uploaded photos will be cleared from your draft. This action cannot be undone."
        confirmText="Discard Draft"
        cancelText="Continue Editing"
        variant="destructive"
        onConfirm={handleCancel}
      />
    </div>
  );
}
