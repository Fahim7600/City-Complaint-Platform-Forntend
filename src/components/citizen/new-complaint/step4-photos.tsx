"use client";

import * as React from "react";
import Image from "next/image";
import {
  FileText,
  UploadCloud,
  X,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
} from "./wizard-schemas";
import { cn } from "@/lib/utils";

interface Step4PhotosProps {
  files: File[];
  previews: { id: string; url: string; name: string; size: number; isPdf: boolean }[];
  maxFiles: number;
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
}

export function Step4Photos({
  files,
  previews,
  maxFiles,
  onAddFiles,
  onRemoveFile,
}: Step4PhotosProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const remainingSlots = Math.max(0, maxFiles - files.length);

  const processFileList = (incomingList: FileList | File[]) => {
    const validFiles: File[] = [];
    const arr = Array.from(incomingList);

    if (files.length + arr.length > maxFiles) {
      toast.error(
        `Upload limit reached. You can only attach up to ${maxFiles} files.`
      );
    }

    const filesToConsider = arr.slice(0, remainingSlots);

    for (const file of filesToConsider) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.error(`Invalid format for ${file.name}. Only JPEG, PNG, WEBP, and PDF are allowed.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File ${file.name} is too large. Maximum file size is 10MB.`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onAddFiles(validFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFileList(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFileList(e.target.files);
      // Reset input value so same file can be re-selected if deleted
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-1">
          <h3 className="font-heading text-lg font-semibold text-foreground">
            Supporting Evidence & Photos
          </h3>
          <p className="text-xs text-muted-foreground">
            Upload clear photographs or documentation showing the defect. This step is optional.
          </p>
        </div>

        <div className="text-xs font-semibold px-2.5 py-1 rounded-full border border-border bg-muted/40 shrink-0 self-start sm:self-auto">
          {files.length} / {maxFiles} attachments
        </div>
      </div>

      {/* Drag & Drop Zone */}
      {remainingSlots > 0 ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "group relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-300",
            isDragging
              ? "border-violet-500 bg-violet-500/10 shadow-[0_0_25px_rgba(139,92,246,0.25)]"
              : "border-border/80 bg-card/40 hover:border-violet-500/50 hover:bg-card/70"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-500/20 to-indigo-500/20 text-violet-500 mb-3 group-hover:scale-110 transition-transform duration-300">
            <UploadCloud className="size-6" />
          </div>

          <p className="text-xs font-semibold text-foreground sm:text-sm">
            Drag and drop images or PDF here, or{" "}
            <span className="text-violet-500 underline underline-offset-2">browse files</span>
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            JPEG, PNG, WEBP or PDF • Max 10MB per file ({remainingSlots} remaining)
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-500 flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" />
          Maximum file upload capacity of {maxFiles} attachments reached. Remove an existing photo to add another.
        </div>
      )}

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Selected Attachments ({previews.length})
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {previews.map((item, index) => (
              <div
                key={item.id}
                className="group relative rounded-xl border border-border/80 bg-card overflow-hidden shadow-sm aspect-square"
              >
                {item.isPdf ? (
                  <div className="flex flex-col items-center justify-center h-full p-3 bg-muted/30">
                    <FileText className="size-8 text-rose-500 mb-1" />
                    <p className="text-[11px] font-medium text-foreground truncate w-full text-center">
                      {item.name}
                    </p>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {(item.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </div>
                ) : (
                  <div className="relative size-full">
                    <Image
                      src={item.url}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Red Remove (X) Button: ALWAYS RED / variant destructive */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(index);
                  }}
                  aria-label={`Remove ${item.name}`}
                  className="absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 active:scale-95 transition-all duration-200"
                >
                  <X className="size-4 stroke-[2.5]" />
                </button>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-[10px] text-white truncate">
                  {item.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
