"use client";

import * as React from "react";
import Image from "next/image";
import {
  ExternalLink,
  Eye,
  FileText,
  MapPin,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CategoryIcon } from "./category-icon";
import { AttachmentType, type Attachment, type Complaint } from "@/types/complaint";

interface CitizenReportCardProps {
  job: Complaint;
  attachments?: Attachment[];
}

export function CitizenReportCard({
  job,
  attachments = [],
}: CitizenReportCardProps) {
  const [lightboxUrl, setLightboxUrl] = React.useState<string | null>(null);

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    job.location
  )}`;

  const citizenEvidence = attachments.filter(
    (a) => a.type === AttachmentType.EVIDENCE
  );

  return (
    <>
      <Card className="border border-border/70 bg-card/60 backdrop-blur-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border/50 bg-muted/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-9 rounded-xl border border-border/60">
              <AvatarFallback className="rounded-xl bg-violet-500/15 text-violet-600 font-bold text-xs">
                {job.citizen?.name ? job.citizen.name.slice(0, 2).toUpperCase() : "CZ"}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="text-xs font-bold text-foreground block">
                {job.citizen?.name || "Citizen Reporter"}
              </span>
              <span className="text-[11px] text-muted-foreground block">
                Filer of this ticket
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-600 dark:text-violet-400">
            <CategoryIcon name={job.category?.name} className="size-3.5" />
            <span>{job.category?.name || "Civic Category"}</span>
          </div>
        </div>

        <CardContent className="p-4 sm:p-5 space-y-4">
          {/* Incident Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Incident Description & Scope
            </h4>
            <p className="text-xs sm:text-sm text-foreground/90 whitespace-pre-line leading-relaxed bg-muted/30 p-3.5 rounded-xl border border-border/40">
              {job.description}
            </p>
          </div>

          {/* Location & Navigation */}
          <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="size-4 text-primary shrink-0" />
                <span className="text-xs font-bold text-foreground truncate">
                  {job.location}
                </span>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline shrink-0"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="size-3" />
              </a>
            </div>
          </div>

          {/* Citizen's Evidence Photos */}
          {citizenEvidence.length > 0 && (
            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Citizen Evidence Photos ({citizenEvidence.length})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {citizenEvidence.map((item) => {
                  const isPdf = item.url.toLowerCase().endsWith(".pdf");
                  if (isPdf) {
                    return (
                      <a
                        key={item.id}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-24 p-2 rounded-xl border border-border/60 bg-card hover:border-violet-500 flex flex-col items-center justify-center text-center transition-colors group"
                      >
                        <FileText className="size-6 text-rose-500 mb-1" />
                        <span className="text-[10px] font-medium text-foreground truncate w-full">
                          PDF Evidence
                        </span>
                      </a>
                    );
                  }

                  return (
                    <div
                      key={item.id}
                      onClick={() => setLightboxUrl(item.url)}
                      className="group relative h-24 rounded-xl overflow-hidden border border-border/70 bg-muted/40 cursor-pointer shadow-sm hover:border-violet-500/60 transition-all"
                    >
                      <Image
                        src={item.url}
                        alt="Citizen evidence photo"
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Eye className="size-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lightbox for citizen evidence */}
      <Dialog
        open={Boolean(lightboxUrl)}
        onOpenChange={(open) => !open && setLightboxUrl(null)}
      >
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black/95 border-0">
          {lightboxUrl && (
            <div className="relative flex flex-col items-center justify-center min-h-[350px] max-h-[80vh] p-4">
              <div className="relative w-full h-[60vh]">
                <Image
                  src={lightboxUrl}
                  alt="Citizen evidence photo"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
              <div className="w-full flex items-center justify-end pt-2 px-2 text-xs text-white/80">
                <a
                  href={lightboxUrl}
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
