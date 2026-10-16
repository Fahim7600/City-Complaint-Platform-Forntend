import { env } from "@/lib/env";

export const siteConfig = {
  name: "CityFix",
  tagline: "Report it. Track it. Get it fixed.",
  description:
    "A unified municipal complaint platform connecting citizens directly with city departments, tracking resolution deadlines under transparent SLAs, and ensuring faster civic resolution.",
  url: env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL || "https://city-complaint-platform-forntend.vercel.app",
  contact: {
    address: "House 40/42, Block D, Sector 1, Road 05, Aftabnagar, Dhaka, Bangladesh",
    phone: "+880 1330-044020",
    phoneHref: "tel:+8801330044020",
    email: "arfanahmedfahim832@gmail.com",
    supportHours: "Sunday – Thursday, 9:00 AM – 6:00 PM",
    emergencyNote: "For fire, medical or police emergencies call 999.",
  },
  socials: {
    facebook: "https://facebook.com/cityfix",
    twitter: "https://x.com/cityfix",
    linkedin: "https://linkedin.com/company/cityfix",
    github: "https://github.com/Fahim7600",
  },
  links: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Departments", href: "/departments" },
    { label: "Stats", href: "/stats" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
  ],
};
