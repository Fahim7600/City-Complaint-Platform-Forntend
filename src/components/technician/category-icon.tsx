import * as React from "react";
import {
  Car,
  Droplets,
  HelpCircle,
  Lightbulb,
  ShieldAlert,
  Trash2,
  Trees,
  Wrench,
} from "lucide-react";

interface CategoryIconProps {
  name?: string | null;
  className?: string;
}

export function CategoryIcon({ name = "", className = "size-4" }: CategoryIconProps) {
  const normalized = (name || "").toLowerCase();

  if (normalized.includes("road") || normalized.includes("pothole") || normalized.includes("traffic") || normalized.includes("street")) {
    return <Car className={className} />;
  }
  if (normalized.includes("water") || normalized.includes("pipe") || normalized.includes("drain") || normalized.includes("sewage")) {
    return <Droplets className={className} />;
  }
  if (normalized.includes("light") || normalized.includes("electr") || normalized.includes("power")) {
    return <Lightbulb className={className} />;
  }
  if (normalized.includes("waste") || normalized.includes("trash") || normalized.includes("garbage") || normalized.includes("clean")) {
    return <Trash2 className={className} />;
  }
  if (normalized.includes("park") || normalized.includes("tree") || normalized.includes("green") || normalized.includes("garden")) {
    return <Trees className={className} />;
  }
  if (normalized.includes("safety") || normalized.includes("hazard") || normalized.includes("security")) {
    return <ShieldAlert className={className} />;
  }

  return <Wrench className={className} />;
}
