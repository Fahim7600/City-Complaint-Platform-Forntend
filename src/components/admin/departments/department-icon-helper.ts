import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Construction,
  Droplets,
  HeartPulse,
  Lightbulb,
  ShieldCheck,
  Trash2,
  Trees,
  Wrench,
  Zap,
} from "lucide-react";

export function getDepartmentIcon(name: string): LucideIcon {
  const lower = (name || "").toLowerCase();
  if (lower.includes("water") || lower.includes("drain") || lower.includes("pipe") || lower.includes("sewage")) {
    return Droplets;
  }
  if (lower.includes("electric") || lower.includes("power") || lower.includes("grid")) {
    return Zap;
  }
  if (lower.includes("light") || lower.includes("lamp") || lower.includes("street")) {
    return Lightbulb;
  }
  if (lower.includes("road") || lower.includes("transport") || lower.includes("highway") || lower.includes("traffic")) {
    return Construction;
  }
  if (lower.includes("health") || lower.includes("hospital") || lower.includes("medical") || lower.includes("clinic")) {
    return HeartPulse;
  }
  if (lower.includes("waste") || lower.includes("garbage") || lower.includes("sanitat")) {
    return Trash2;
  }
  if (lower.includes("park") || lower.includes("tree") || lower.includes("environment") || lower.includes("green")) {
    return Trees;
  }
  if (lower.includes("security") || lower.includes("police") || lower.includes("safety")) {
    return ShieldCheck;
  }
  if (lower.includes("engineer") || lower.includes("repair") || lower.includes("maint")) {
    return Wrench;
  }
  return Building2;
}
