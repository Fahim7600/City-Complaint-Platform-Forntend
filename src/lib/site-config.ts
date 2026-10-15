// TODO: Replace placeholder contact and social links with verified production values before submission.
export const siteConfig = {
  name: "CityFix",
  tagline: "Report it. Track it. Get it fixed.",
  description:
    "A unified municipal complaint platform connecting citizens directly with city departments, tracking resolution deadlines under transparent SLAs, and ensuring faster civic resolution.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://cityfix.app",
  contact: {
    address: "Civic Operations Center, Road 10, Mirpur-10, Dhaka 1216, Bangladesh",
    phone: "+880 1700-000000",
    hotline: "16263",
    email: "support@cityfix.app",
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
