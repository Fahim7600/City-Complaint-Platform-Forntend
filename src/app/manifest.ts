import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CityFix — City Complaint & Civic Service Platform",
    short_name: "CityFix",
    description:
      "Citizen grievance reporting, real-time civic service tracking, and community resolution platform for transparent municipal governance.",
    start_url: "/",
    display: "standalone",
    background_color: "#04201a",
    theme_color: "#03604c",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
