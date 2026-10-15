import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Flame,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: `Contact & Operations Center — ${siteConfig.name}`,
  description:
    "Get in touch with the CityFix Civic Operations Center. Direct hotline, operational office location, support hours, and emergency contacts.",
  openGraph: {
    title: `Contact & Operations Center — ${siteConfig.name}`,
    description:
      "Get in touch with the CityFix Civic Operations Center. Direct hotline, operational office location, support hours, and emergency contacts.",
    url: `${siteConfig.url}/contact`,
    siteName: siteConfig.name,
    images: [
      {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "CityFix Operations Support Center",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Contact & Operations Center — ${siteConfig.name}`,
    description:
      "Get in touch with the CityFix Civic Operations Center. Direct hotline, operational office location, support hours, and emergency contacts.",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
    ],
  },
};

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-20 space-y-16">
      {/* 1. Header */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400">
          <Sparkles className="size-3.5" />
          <span>Civic Helpdesk & Headquarters</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tight">
          Contact Civic Operations
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Need assistance with a ticket, city agency inquiries, or system access? Reach out to our central operations desk directly.
        </p>
      </section>

      {/* 2. Critical Emergency Alert Card */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="p-5 rounded-3xl bg-amber-500/15 border border-amber-500/30 text-amber-950 dark:text-amber-200 flex items-start gap-3.5 shadow-lg shadow-amber-500/5">
          <div className="size-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-300">
            <Flame className="size-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-sm text-amber-900 dark:text-amber-100">
              Immediate Life Safety Emergency Notice
            </h3>
            <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200/90">
              {siteConfig.contact.emergencyNote} CityFix manages municipal non-emergency civil complaints only (potholes, sanitation, water leaks, streetlights). For immediate ambulance, structural collapse, or armed assistance, dial <strong>999</strong> immediately.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Contact Info Cards Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Hotline & Phone */}
          <div className="p-6 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-sm space-y-4 hover:border-teal-500/40 transition-colors">
            <div className="size-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Phone className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-base text-foreground">
                Hotline & Phone
              </h3>
              <p className="text-xs text-muted-foreground">Direct municipal dispatch call</p>
            </div>
            <div className="space-y-1.5 pt-1 text-xs">
              <div>
                <span className="text-muted-foreground text-[11px] block">Civic Hotline:</span>
                <a
                  href={`tel:${siteConfig.contact.hotline}`}
                  className="font-bold text-foreground text-sm hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  {siteConfig.contact.hotline} (Toll-Free)
                </a>
              </div>
              <div className="pt-1">
                <span className="text-muted-foreground text-[11px] block">Direct Line:</span>
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="font-semibold text-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  {siteConfig.contact.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: Email Support */}
          <div className="p-6 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-sm space-y-4 hover:border-indigo-500/40 transition-colors">
            <div className="size-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Mail className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-base text-foreground">
                Email Desk
              </h3>
              <p className="text-xs text-muted-foreground">General inquiries & ticketing</p>
            </div>
            <div className="pt-1 space-y-1 text-xs">
              <span className="text-muted-foreground text-[11px] block">Official Inquiries:</span>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="font-bold text-foreground text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors break-all"
              >
                {siteConfig.contact.email}
              </a>
              <span className="text-[10px] text-muted-foreground block pt-1">
                Typical response within 1 business day
              </span>
            </div>
          </div>

          {/* Card 3: Support Hours */}
          <div className="p-6 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-sm space-y-4 hover:border-violet-500/40 transition-colors">
            <div className="size-12 rounded-2xl bg-violet-500/15 border border-violet-500/30 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Clock className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-base text-foreground">
                Support Hours
              </h3>
              <p className="text-xs text-muted-foreground">Administrative operations</p>
            </div>
            <div className="pt-1 space-y-1 text-xs">
              <p className="font-semibold text-foreground">
                {siteConfig.contact.supportHours}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Friday & Saturday: Automated monitoring with emergency standby dispatch.
              </p>
            </div>
          </div>

          {/* Card 4: Location Desk */}
          <div className="p-6 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-sm space-y-4 hover:border-teal-500/40 transition-colors">
            <div className="size-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <MapPin className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-base text-foreground">
                Operations Center
              </h3>
              <p className="text-xs text-muted-foreground">Central municipal office</p>
            </div>
            <p className="text-xs text-foreground/90 leading-relaxed pt-1">
              {siteConfig.contact.address}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Embedded Google Maps + Quick Complaint Action */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Google Maps Embed iframe */}
          <div className="lg:col-span-8">
            <div className="relative w-full h-[360px] sm:h-[420px] rounded-3xl overflow-hidden border border-border/80 shadow-2xl bg-muted">
              <iframe
                title="CityFix Civic Operations Center Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14602.700319409893!2d90.366479!3d23.806653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c0d6f6e8c221%3A0x6b4fb6642f88f4e6!2sMirpur-10%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter contrast-[1.05] grayscale-[20%]"
              />
            </div>
          </div>

          {/* Side Box: Have an active issue? Report it instead */}
          <div className="lg:col-span-4 p-8 rounded-3xl border border-violet-500/30 bg-gradient-to-br from-card/90 to-violet-950/20 backdrop-blur-xl space-y-6 shadow-xl">
            <div className="size-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <MessageSquare className="size-6" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-xl text-foreground">
                Reporting a city problem?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Skip the phone queue! Submit your complaint with photo attachments directly to the responsible municipal department for immediate SLA-tracked resolution.
              </p>
            </div>

            <div className="pt-2">
              <Link href="/dashboard/complaints/new" className="block w-full">
                <Button
                  size="lg"
                  className="w-full text-xs font-bold bg-gradient-to-r from-teal-500 via-emerald-500 to-indigo-600 text-white shadow-lg shadow-teal-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 gap-2"
                >
                  <span>File a complaint now</span>
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Social Links Row */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Other ways to reach us
        </h4>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
          <a
            href={siteConfig.socials.github}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-card border border-border/80 hover:border-violet-500/40 hover:text-foreground text-muted-foreground transition-all flex items-center gap-1.5"
          >
            <span>GitHub Repository</span>
            <ExternalLink className="size-3" />
          </a>
          <a
            href={siteConfig.socials.twitter}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-card border border-border/80 hover:border-violet-500/40 hover:text-foreground text-muted-foreground transition-all flex items-center gap-1.5"
          >
            <span>Twitter / X</span>
            <ExternalLink className="size-3" />
          </a>
          <a
            href={siteConfig.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-card border border-border/80 hover:border-violet-500/40 hover:text-foreground text-muted-foreground transition-all flex items-center gap-1.5"
          >
            <span>LinkedIn</span>
            <ExternalLink className="size-3" />
          </a>
          <a
            href={siteConfig.socials.facebook}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-card border border-border/80 hover:border-violet-500/40 hover:text-foreground text-muted-foreground transition-all flex items-center gap-1.5"
          >
            <span>Facebook</span>
            <ExternalLink className="size-3" />
          </a>
        </div>
      </section>
    </div>
  );
}
