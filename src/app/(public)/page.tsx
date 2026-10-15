import * as React from "react";
import type { Metadata } from "next";
import { publicServerService } from "@/services/public.server";
import { siteConfig } from "@/lib/site-config";
import { HomeHero } from "@/components/public/home-hero";
import { HomeStatsStrip } from "@/components/public/home-stats-strip";
import { HomeHowItWorks } from "@/components/public/home-how-it-works";
import { HomeDepartmentsPreview } from "@/components/public/home-departments-preview";
import { HomeCategoriesPreview } from "@/components/public/home-categories-preview";
import { HomePremiumTeaser } from "@/components/public/home-premium-teaser";
import { HomeFaqAccordion } from "@/components/public/home-faq-accordion";
import { HomeCtaBand } from "@/components/public/home-cta-band";
import type { PublicOverview } from "@/types/stats";

export const revalidate = 300; // 5 minutes matching backend Redis cache

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "CityFix Municipal Operations Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?q=80&w=1200&auto=format&fit=crop",
    ],
  },
};

export default async function HomePage() {
  let overview: PublicOverview | null = null;
  try {
    overview = await publicServerService.getOverview();
  } catch (error) {
    console.warn("[HomePage] Could not fetch public overview:", error);
  }

  const departments = overview?.departments || [];
  const categories = overview?.categories || [];
  const stats = overview?.stats || null;
  const faqs = overview?.faqs || [];

  return (
    <div className="flex flex-col space-y-4">
      {/* 1. Hero Section */}
      <HomeHero overview={overview} />

      {/* 2. Live Stats Strip */}
      <HomeStatsStrip stats={stats} />

      {/* 3. How It Works (4 Steps) */}
      <HomeHowItWorks />

      {/* 4. Municipal Departments Preview */}
      <HomeDepartmentsPreview
        departments={departments}
        categories={categories}
      />

      {/* 5. Supported Categories & SLAs */}
      <HomeCategoriesPreview
        departments={departments}
        categories={categories}
      />

      {/* 6. Premium Teaser */}
      <HomePremiumTeaser overview={overview} />

      {/* 7. FAQs */}
      <HomeFaqAccordion faqs={faqs} />

      {/* 8. Final CTA Band */}
      <HomeCtaBand />
    </div>
  );
}
