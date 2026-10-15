import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldAlert,
  ArrowUpRight,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import type { Department } from "@/types/department";

interface PublicFooterProps {
  departments?: Department[];
}

export function PublicFooter({ departments = [] }: PublicFooterProps) {
  const currentYear = new Date().getFullYear();
  const featuredDepartments = departments.slice(0, 4);

  return (
    <footer className="relative bg-gradient-to-b from-[#034436] via-[#022c23] to-[#011b15] text-slate-100 overflow-hidden">
      {/* Wave / Steps Divider from Haikei SVG */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-px h-16 sm:h-24 overflow-hidden opacity-25"
      >
        <Image
          src="/stacked-steps-haikei.svg"
          alt=""
          fill
          className="object-cover object-top rotate-180"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-teal-800/40">
          {/* Col 1 & 2: Brand and Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-400 via-emerald-400 to-indigo-500 text-slate-950 shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="size-4" />
              </div>
              <span className="font-heading text-xl font-extrabold tracking-tight text-white">
                {siteConfig.name}
              </span>
            </Link>

            <p className="text-xs text-[#e6f4f1]/90 max-w-sm leading-relaxed">
              {siteConfig.description}
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteConfig.socials.github}
                target="_blank"
                rel="noreferrer"
                className="size-8 rounded-lg bg-teal-900/60 hover:bg-teal-700/60 border border-teal-700/50 flex items-center justify-center text-teal-200 hover:text-white transition-all"
                aria-label="GitHub Repository"
              >
                <svg className="size-4 fill-currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href={siteConfig.socials.twitter}
                target="_blank"
                rel="noreferrer"
                className="size-8 rounded-lg bg-teal-900/60 hover:bg-teal-700/60 border border-teal-700/50 flex items-center justify-center text-teal-200 hover:text-white transition-all"
                aria-label="Twitter / X"
              >
                <svg className="size-3.5 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={siteConfig.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="size-8 rounded-lg bg-teal-900/60 hover:bg-teal-700/60 border border-teal-700/50 flex items-center justify-center text-teal-200 hover:text-white transition-all"
                aria-label="LinkedIn"
              >
                <svg className="size-3.5 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37h2.8z" />
                </svg>
              </a>
              <a
                href={siteConfig.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="size-8 rounded-lg bg-teal-900/60 hover:bg-teal-700/60 border border-teal-700/50 flex items-center justify-center text-teal-200 hover:text-white transition-all"
                aria-label="Facebook"
              >
                <svg className="size-3.5 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 3: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-teal-100/80">
              {siteConfig.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/dashboard/complaints/new"
                  className="hover:text-white transition-colors flex items-center gap-1 font-semibold text-teal-200 group"
                >
                  <span>File a Complaint</span>
                  <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Featured Departments */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Departments
            </h4>
            <ul className="space-y-2 text-xs text-teal-100/80">
              {featuredDepartments.length > 0 ? (
                featuredDepartments.map((dept) => (
                  <li key={dept.id}>
                    <Link
                      href={`/departments/${dept.id}`}
                      className="hover:text-white transition-colors truncate block"
                    >
                      {dept.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href="/departments" className="hover:text-white">
                      Water & Sewage
                    </Link>
                  </li>
                  <li>
                    <Link href="/departments" className="hover:text-white">
                      Roads & Highways
                    </Link>
                  </li>
                  <li>
                    <Link href="/departments" className="hover:text-white">
                      Electricity & Lighting
                    </Link>
                  </li>
                  <li>
                    <Link href="/departments" className="hover:text-white">
                      Waste Management
                    </Link>
                  </li>
                </>
              )}
              <li className="pt-1">
                <Link
                  href="/departments"
                  className="text-xs font-semibold text-teal-300 hover:text-white underline underline-offset-4"
                >
                  View all departments →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact & Emergency */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Civic Operations
            </h4>
            <div className="space-y-2 text-xs text-teal-100/80">
              <div className="flex items-start gap-2">
                <MapPin className="size-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span>{siteConfig.contact.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-3.5 text-teal-400 shrink-0" />
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {siteConfig.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-3.5 text-teal-400 shrink-0" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-white transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-3.5 text-teal-400 shrink-0" />
                <span>{siteConfig.contact.supportHours}</span>
              </div>
            </div>

            {/* Emergency Alert Banner */}
            <div className="mt-3 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-[11px] leading-tight flex items-start gap-2">
              <ShieldAlert className="size-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{siteConfig.contact.emergencyNote}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9ad6c9]">
          <p>© {currentYear} {siteConfig.name}. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Built with Next.js, TypeScript & Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
