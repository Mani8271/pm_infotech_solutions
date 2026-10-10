import { site } from "@/lib/site";

// Only real pages belong here; the #services, #contact, ... sections are part of the home page
export default function sitemap() {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      images: [`${site.url}${site.logo}`],
    },
  ];
}
