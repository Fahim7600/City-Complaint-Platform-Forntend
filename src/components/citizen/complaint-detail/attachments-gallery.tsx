"use client";

import * as React from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Images,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AttachmentType, type Attachment } from "@/types/complaint";

interface AttachmentsGalleryProps {
  attachments: Attachment[];
}

export function AttachmentsGallery({ attachments }: AttachmentsGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  // Filter image attachments for the lightbox
  const imageAttachments = React.useMemo(() => {
    return attachments.filter(
      (a) => !a.url.toLowerCase().endsWith(".pdf")
    );
  }, [attachments]);

  const evidence = attachments.filter((a) => a.type === AttachmentType.EVIDENCE);
  const beforeWork = attachments.filter(
    (a) => a.type === AttachmentType.BEFORE_WORK
  );
  const afterWork = attachments.filter(
    (a) => a.type === AttachmentType.AFTER_WORK
  );

  const openLightbox = (url: string) => {
    const idx = imageAttachments.findIndex((a) => a.url === url);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % imageAttachments.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        (lightboxIndex - 1 + imageAttachments.length) % imageAttachments.length
      );
    }
  };

  const renderGroup = (title: string, items: Attachment[]) => {
    if (items.length === 0) return null;

    return (
      <div className="space-y-2.5">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title} ({items.length})
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map((item) => {
            const isPdf = item.url.toLowerCase().endsWith(".pdf");

            if (isPdf) {
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <Card className="h-28 border border-border/70 bg-card/60 backdrop-blur-sm p-3 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-violet-500/50 hover:bg-card/90">
                    <FileText className="size-8 text-rose-500 mb-1.5 transition-transform duration-200 group-hover:scale-110" />
                    <span className="text-[11px] font-medium text-foreground truncate w-full">
                      View PDF Evidence
                    </span>
                    <span className="text-[10px] text-primary inline-flex items-center gap-1 mt-1">
                      Download <Download className="size-2.5" />
                    </span>
                  </Card>
                </a>
              );
            }

            return (
              <div
                key={item.id}
                onClick={() => openLightbox(item.url)}
                className="group relative h-28 rounded-xl overflow-hidden border border-border/70 bg-muted/40 cursor-pointer shadow-sm transition-all duration-300 hover:border-violet-500/60 hover:shadow-md"
              >
                <Image
                  src={item.url}
                  alt={title}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Eye className="size-5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (attachments.length === 0) {
    return (
      <Card className="border border-border/70 bg-card/60 backdrop-blur-sm p-6 text-center">
        <Images className="size-8 text-muted-foreground/60 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-foreground">
          No Attachments Provided
        </h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          No photo evidence was attached to this complaint ticket.
        </p>
      </Card>
    );
  }

  const currentLightboxImage =
    lightboxIndex !== null ? imageAttachments[lightboxIndex] : null;

  return (
    <Card className="border border-border/70 bg-card/60 backdrop-blur-sm p-5 space-y-5">
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div className="flex items-center gap-2">
          <Images className="size-4 text-violet-500" />
          <h3 className="font-heading text-sm font-semibold text-foreground">
            Complaint Attachments & Evidence
          </h3>
        </div>
        <span className="text-xs text-muted-foreground font-semibold">
          {attachments.length} total
        </span>
      </div>

      <div className="space-y-5">
        {renderGroup("Your evidence", evidence)}
        {renderGroup("Before work", beforeWork)}
        {renderGroup("After work / proof", afterWork)}
      </div>

      {/* Lightbox Dialog */}
      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(open) => !open && setLightboxIndex(null)}
      >
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black/95 border-0">
          {currentLightboxImage && (
            <div className="relative flex flex-col items-center justify-center min-h-[400px] max-h-[80vh] p-4">
              <div className="relative w-full h-[60vh]">
                <Image
                  src={currentLightboxImage.url}
                  alt="Attachment preview"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>

              {/* Prev / Next Controls */}
              {imageAttachments.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    aria-label="Previous image"
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
                  >
                    <ChevronLeft className="size-6" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next image"
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
                  >
                    <ChevronRight className="size-6" />
                  </button>
                </>
              )}

              {/* Footer info & external view */}
              <div className="w-full flex items-center justify-between pt-3 px-2 text-xs text-white/80">
                <span>
                  {lightboxIndex! + 1} of {imageAttachments.length}
                </span>
                <a
                  href={currentLightboxImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white transition-colors"
                >
                  Open original <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
