import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/providers";
import { env } from "@/lib/env";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CityFix — City Complaint & Civic Service Platform",
    template: "%s | CityFix",
  },
  description:
    "Citizen grievance reporting, real-time civic service tracking, and community resolution platform for transparent municipal governance.",
  keywords: [
    "city complaint",
    "civic service",
    "municipal grievance",
    "citizen portal",
    "public works",
    "cityfix",
  ],
  authors: [{ name: "CityFix Civic Team" }],
  creator: "CityFix",
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "CityFix",
    title: "CityFix — City Complaint & Civic Service Platform",
    description:
      "Citizen grievance reporting, real-time civic service tracking, and community resolution platform for transparent municipal governance.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "CityFix Civic Platform Banner",
      },
      {
        url: "/stacked-steps-haikei.svg",
        width: 900,
        height: 600,
        alt: "CityFix Civic Platform Decorative Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CityFix — City Complaint & Civic Service Platform",
    description:
      "Citizen grievance reporting, real-time civic service tracking, and community resolution platform.",
    images: [
      "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?q=80&w=1200&auto=format&fit=crop",
    ],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground transition-colors duration-300">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
