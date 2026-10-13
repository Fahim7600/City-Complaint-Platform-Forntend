"use client";

import * as React from "react";
import { Loader2, LocateFixed, MapPin, Navigation } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Step3LocationProps {
  location: string;
  error?: string;
  onChange: (value: string, coords?: { lat: number; lng: number }) => void;
}

export function Step3Location({
  location,
  error,
  onChange,
}: Step3LocationProps) {
  const [isLocating, setIsLocating] = React.useState(false);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const coordsStr = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

        // Attempt reverse geocoding via OpenStreetMap free API, with timeout
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                "Accept-Language": "en",
              },
            }
          );
          if (res.ok) {
            const data = await res.json();
            const displayName = data.display_name;
            if (displayName) {
              onChange(displayName, { lat: latitude, lng: longitude });
              toast.success("Location acquired from GPS!");
              setIsLocating(false);
              return;
            }
          }
        } catch {
          // Fallback to coordinates format if reverse geocode fails
        }

        const fallback = `Coordinates: ${coordsStr}`;
        onChange(fallback, { lat: latitude, lng: longitude });
        toast.success("GPS coordinates detected!");
        setIsLocating(false);
      },
      (geoError) => {
        setIsLocating(false);
        if (geoError.code === geoError.PERMISSION_DENIED) {
          toast.error("Location permission denied. Please enter your address manually.");
        } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          toast.error("Location information is currently unavailable.");
        } else {
          toast.error("Unable to determine your current location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          Incident Location
        </h3>
        <p className="text-xs text-muted-foreground">
          Specify the street name, intersection, or physical landmark where this issue is located.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <Label htmlFor="complaint-location" className="text-xs font-semibold">
            Address / Landmark / Street <span className="text-destructive">*</span>
          </Label>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="h-8 text-xs font-medium border-violet-500/30 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10 transition-all shrink-0 self-start sm:self-auto"
          >
            {isLocating ? (
              <>
                <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                Acquiring GPS...
              </>
            ) : (
              <>
                <LocateFixed className="size-3.5 mr-1.5 text-violet-500" />
                Use my current location
              </>
            )}
          </Button>
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-3 size-4 text-muted-foreground pointer-events-none" />
          <Input
            id="complaint-location"
            value={location}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. Corner of Elm Street & 4th Avenue, outside City Library"
            className={cn(
              "pl-9 h-10 bg-background/80 border-border/70 focus-visible:ring-violet-500/30",
              error && "border-destructive focus-visible:ring-destructive/30"
            )}
          />
        </div>
        {error && (
          <p className="text-xs font-medium text-destructive">{error}</p>
        )}
      </div>

      {/* Helpful tip box */}
      <div className="p-4 rounded-xl border border-border/70 bg-card/60 backdrop-blur-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <Navigation className="size-4 text-primary" />
          Location tips for faster dispatch
        </div>
        <ul className="text-[11px] text-muted-foreground space-y-1 list-disc list-inside">
          <li>Include specific building numbers or prominent cross streets.</li>
          <li>For parks or public squares, mention nearest entrance gate or monument.</li>
          <li>Accurate locations ensure technicians arrive on scene without delay.</li>
        </ul>
      </div>
    </div>
  );
}
