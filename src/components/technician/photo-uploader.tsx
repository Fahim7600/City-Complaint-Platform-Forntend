"use client";

import * as React from "react";
import Image from "next/image";
import {
  Camera,
  CheckCircle2,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Loader2,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { complaintService } from "@/services/complaint.service";
import { getErrorMessage } from "@/lib/axios";
import { AttachmentType, ComplaintStatus, type Attachment } from "@/types/complaint";
import { cn } from "@/lib/utils";

interface PhotoUploaderProps {
  complaintId: string;
  status: ComplaintStatus;
  currentUserId?: string;
  isAdmin?: boolean;
  attachments: Attachment[];
  onAttachmentsChange: () => void;
}

interface PendingFile {
  id: string;
  file: File;
  previewUrl: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export function PhotoUploader({
  complaintId,
  status,
  currentUserId,
  isAdmin = false,
  attachments,
  onAttachmentsChange,
}: PhotoUploaderProps) {
  const [activeZone, setActiveZone] = React.useState<AttachmentType>(
    AttachmentType.BEFORE_WORK
  );

  const [pendingFiles, setPendingFiles] = React.useState<PendingFile[]>([]);
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [deleteTargetId, setDeleteTargetId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [previewModalUrl, setPreviewModalUrl] = React.useState<string | null>(null);

  const isEditable =
    status === ComplaintStatus.ASSIGNED || status === ComplaintStatus.IN_PROGRESS;

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const beforeWorkPhotos = attachments.filter(
    (a) => a.type === AttachmentType.BEFORE_WORK
  );
  const afterWorkPhotos = attachments.filter(
    (a) => a.type === AttachmentType.AFTER_WORK
  );

  const validateFiles = (fileList: File[]): File[] => {
    const valid: File[] = [];
    for (const f of fileList) {
      if (!ALLOWED_TYPES.includes(f.type)) {
        toast.error(`"${f.name}" is not a supported file type (images and PDFs only).`);
        continue;
      }
      if (f.size > MAX_FILE_SIZE) {
        toast.error(`"${f.name}" exceeds the 10MB maximum file size.`);
        continue;
      }
      valid.push(f);
    }
    return valid;
  };

  const handleFilesAdded = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const validated = validateFiles(Array.from(files));
    if (validated.length === 0) return;

    if (pendingFiles.length + validated.length > 10) {
      toast.error("Maximum 10 files can be uploaded per batch.");
      return;
    }

    const newPending: PendingFile[] = validated.map((f) => ({
      id: Math.random().toString(36).substring(2, 9),
      file: f,
      previewUrl: f.type.startsWith("image/") ? URL.createObjectURL(f) : "",
    }));

    setPendingFiles((prev) => [...prev, ...newPending]);
  };

  const handleRemovePending = (id: string) => {
    setPendingFiles((prev) => {
      const removed = prev.find((p) => p.id === id);
      if (removed?.previewUrl) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  const handleUploadBatch = async () => {
    if (pendingFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const filesToUpload = pendingFiles.map((p) => p.file);
      await complaintService.uploadAttachments(
        complaintId,
        filesToUpload,
        activeZone,
        (progress) => setUploadProgress(progress)
      );

      // Clean up object URLs
      pendingFiles.forEach((p) => {
        if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
      });
      setPendingFiles([]);
      toast.success(
        `Uploaded ${filesToUpload.length} ${
          activeZone === AttachmentType.BEFORE_WORK ? "before-work" : "after-work"
        } photo${filesToUpload.length > 1 ? "s" : ""}`
      );
      onAttachmentsChange();
    } catch (err) {
      toast.error(getErrorMessage(err) || "Failed to upload attachments.");
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const handleDeleteAttachment = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await complaintService.deleteAttachment(deleteTargetId);
      toast.success("Photo attachment deleted");
      setDeleteTargetId(null);
      onAttachmentsChange();
    } catch (err) {
      toast.error(getErrorMessage(err) || "Failed to delete attachment.");
    } finally {
      setIsDeleting(false);
    }
  };

  const displayedList =
    activeZone === AttachmentType.BEFORE_WORK ? beforeWorkPhotos : afterWorkPhotos;

  return (
    <>
      <Card className="border border-border/70 bg-card/60 backdrop-blur-sm overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <Camera className="size-4 text-violet-500" />
            <h3 className="font-heading text-sm font-semibold text-foreground">
              Field Work Documentation & Proof
            </h3>
          </div>

          {/* Zone Selector Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-muted/50 border border-border/60 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setActiveZone(AttachmentType.BEFORE_WORK);
                setPendingFiles([]);
              }}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
                activeZone === AttachmentType.BEFORE_WORK
                  ? "bg-background text-foreground shadow-sm font-bold border border-border/70"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Before work ({beforeWorkPhotos.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveZone(AttachmentType.AFTER_WORK);
                setPendingFiles([]);
              }}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
                activeZone === AttachmentType.AFTER_WORK
                  ? "bg-background text-foreground shadow-sm font-bold border border-border/70"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              After work / proof ({afterWorkPhotos.length})
            </button>
          </div>
        </div>

        {/* Drop Zone (Editable only when ASSIGNED or IN_PROGRESS) */}
        {isEditable ? (
          <div className="space-y-4">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleFilesAdded(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border/80 hover:border-violet-500/60 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 bg-muted/20 hover:bg-violet-500/5 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
                onChange={(e) => handleFilesAdded(e.target.files)}
                disabled={isUploading}
              />
              <div className="size-11 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud className="size-5.5" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-foreground">
                Drop {activeZone === AttachmentType.BEFORE_WORK ? "before-work" : "after-work proof"}{" "}
                photos here, or <span className="text-primary hover:underline">browse files</span>
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Supports JPG, PNG, WEBP, or PDF up to 10MB per file (max 10 files)
              </p>
            </div>

            {/* Pending Files Queue */}
            {pendingFiles.length > 0 && (
              <div className="p-4 rounded-xl border border-violet-500/30 bg-violet-500/5 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <span>Ready to upload ({pendingFiles.length})</span>
                  <span className="text-[11px] text-muted-foreground">
                    Zone: {activeZone === AttachmentType.BEFORE_WORK ? "Before Work" : "After Work / Proof"}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {pendingFiles.map((item) => (
                    <div
                      key={item.id}
                      className="group relative h-24 rounded-xl overflow-hidden border border-border/70 bg-card p-1 shadow-sm"
                    >
                      {item.previewUrl ? (
                        <Image
                          src={item.previewUrl}
                          alt="Pending preview"
                          fill
                          unoptimized
                          className="object-cover rounded-lg"
                        />
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-2">
                          <FileText className="size-6 text-rose-500 mb-1" />
                          <span className="text-[10px] text-foreground truncate w-full font-medium">
                            {item.file.name}
                          </span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePending(item.id);
                        }}
                        aria-label="Remove pending photo"
                        className="absolute top-1.5 right-1.5 size-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md transition-all"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                {uploadProgress !== null && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-1.5" />
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPendingFiles([])}
                    disabled={isUploading}
                    className="text-xs h-8"
                  >
                    Clear
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleUploadBatch}
                    disabled={isUploading}
                    className="text-xs font-semibold h-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin mr-1.5" />
                        Uploading {uploadProgress ?? 0}%
                      </>
                    ) : (
                      <>
                        <UploadCloud className="size-3.5 mr-1.5" />
                        Confirm Upload ({pendingFiles.length})
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3.5 rounded-xl border border-border/60 bg-muted/30 text-xs text-muted-foreground flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
            <span>Complaint is finalized ({status}). Photo uploads are locked.</span>
          </div>
        )}

        {/* Uploaded Photos Section */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {activeZone === AttachmentType.BEFORE_WORK
              ? "Before Work Photos (Assessment)"
              : "After Work / Completion Proof"}
          </h4>

          {displayedList.length === 0 ? (
            <div className="p-8 rounded-xl border border-dashed border-border/70 text-center text-xs text-muted-foreground">
              No {activeZone === AttachmentType.BEFORE_WORK ? "before-work" : "after-work"} photos
              uploaded yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {displayedList.map((item) => {
                const isPdf = item.url.toLowerCase().endsWith(".pdf");
                const canDelete =
                  isEditable &&
                  (isAdmin || (currentUserId && item.uploadedById === currentUserId));

                if (isPdf) {
                  return (
                    <div key={item.id} className="relative group">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Card className="h-28 border border-border/70 bg-card p-3 flex flex-col items-center justify-center text-center transition-all hover:border-violet-500">
                          <FileText className="size-8 text-rose-500 mb-1" />
                          <span className="text-[11px] font-medium text-foreground truncate w-full">
                            PDF Document
                          </span>
                          <span className="text-[10px] text-primary inline-flex items-center gap-0.5 mt-1">
                            Download <Download className="size-2.5" />
                          </span>
                        </Card>
                      </a>
                      {canDelete && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTargetId(item.id);
                          }}
                          aria-label="Delete document"
                          className="absolute top-1.5 right-1.5 size-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      )}
                    </div>
                  );
                }

                return (
                  <div
                    key={item.id}
                    className="group relative h-28 rounded-xl overflow-hidden border border-border/70 bg-muted/40 shadow-sm transition-all hover:border-violet-500/60"
                  >
                    <div
                      onClick={() => setPreviewModalUrl(item.url)}
                      className="w-full h-full cursor-pointer relative"
                    >
                      <Image
                        src={item.url}
                        alt="Uploaded photo"
                        fill
                        unoptimized
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white pointer-events-none">
                        <Eye className="size-4" />
                      </div>
                    </div>

                    {canDelete && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTargetId(item.id);
                        }}
                        aria-label="Delete photo"
                        className="absolute top-1.5 right-1.5 size-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deleteTargetId)}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Delete Photo Attachment"
        description="Are you sure you want to delete this photo? This will permanently remove it from municipal cloud records."
        confirmText="Delete photo"
        cancelText="Cancel"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDeleteAttachment}
      />

      {/* Preview Dialog */}
      <Dialog
        open={Boolean(previewModalUrl)}
        onOpenChange={(open) => !open && setPreviewModalUrl(null)}
      >
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black/95 border-0">
          {previewModalUrl && (
            <div className="relative flex flex-col items-center justify-center min-h-[350px] max-h-[80vh] p-4">
              <div className="relative w-full h-[60vh]">
                <Image
                  src={previewModalUrl}
                  alt="Attachment preview"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
              <div className="w-full flex items-center justify-end pt-2 px-2 text-xs text-white/80">
                <a
                  href={previewModalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white"
                >
                  Open original <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
