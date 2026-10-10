// Single source for the site's SEO details. The metadata in app/layout.js, the JSON-LD,
// robots.txt, sitemap.xml, the web manifest and the share image all read from here.

// Set NEXT_PUBLIC_SITE_URL to the live domain (no trailing slash) before deploying
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://pminfotechsolutions.com").replace(/\/+$/, "");
const instagramUrl = "https://www.instagram.com/pminfotechsolutions/";

export const site = {
  name: "PM Infotech Solutions",
  legalName: "PM INFOTECH SOLUTIONS",
  shortName: "PM Infotech",
  url: siteUrl,
  title: "PM Infotech Solutions | Software & App Development in Vizag",
  description:
    "PM Infotech Solutions is a software company in Visakhapatnam (Vizag) building custom software, web & mobile apps, cloud and AI solutions for clients worldwide.",
  tagline: "Building digital experiences that move business forward.",
  keywords: [
    "PM Infotech Solutions",
    "software company in Visakhapatnam",
    "software company in Vizag",
    "web development company in Vizag",
    "app development company in Visakhapatnam",
    "IT company in Visakhapatnam",
    "software development company",
    "custom software development",
    "web development company",
    "mobile app development",
    "Next.js development",
    "React development",
    "Flutter app development",
    "React Native development",
    "UI/UX design agency",
    "cloud solutions",
    "AWS and Azure consulting",
    "AI and automation",
    "digital transformation",
    "API and backend development",
    "IT services company",
  ],
  logo: "/company_logo.jpeg",
  email: "contact@pminfotechsolutions.com",
  telephone: "+91-9959754799",
  phoneDisplay: "+91 99597 54799",
  locations: [{ addressLocality: "Visakhapatnam", addressRegion: "Andhra Pradesh", addressCountry: "IN" }],
  instagram: instagramUrl,
  // Public profile URLs (Instagram, LinkedIn, X, ...). Google uses these to tie the profiles to the company.
  sameAs: [instagramUrl],
  services: [
    {
      name: "Web Development",
      description:
        "Ultra-responsive, accessible, and mission-critical web applications built with Next.js, React, and micro-frontend architectures.",
    },
    {
      name: "Mobile App Development",
      description:
        "High-performance mobile solutions crafted using Flutter and React Native, delivering native speed, fluid gesture control, and offline sync.",
    },
    {
      name: "Custom Software Development",
      description:
        "End-to-end bespoke software engineered to automate complex business workflows, eliminate operational bottlenecks, and scale infinitely.",
    },
    {
      name: "UI/UX Design",
      description:
        "Human-centered interfaces, cohesive design systems, and cinematic interaction design that elevate brand equity and convert users.",
    },
    {
      name: "Cloud Solutions",
      description:
        "Resilient cloud infrastructure on AWS and Azure with automated Kubernetes orchestration, zero-downtime deployments, and finops audit.",
    },
    {
      name: "AI & Automation",
      description:
        "Harnessing generative AI, agentic workflows, machine learning models, and cognitive NLP to automate knowledge work and unlock foresight.",
    },
    {
      name: "Digital Transformation",
      description:
        "Systematic legacy refactoring, monolithic modernization, and organizational technology pivots engineered for sustained competitive advantage.",
    },
    {
      name: "API & Backend Development",
      description:
        "High-throughput backend engines, GraphQL and gRPC pipelines, distributed caching, and rock-solid relational/NoSQL persistence.",
    },
  ],
};

const organizationId = `${site.url}/#organization`;

// schema.org graph for search engines and AI answers: who the company is, how to reach it and what it offers
export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: site.name,
      legalName: site.legalName,
      url: site.url,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}${site.logo}`,
        width: 1254,
        height: 1254,
      },
      image: `${site.url}${site.logo}`,
      description: site.description,
      slogan: site.tagline,
      email: site.email,
      telephone: site.telephone,
      address: site.locations.map((location) => ({ "@type": "PostalAddress", ...location })),
      areaServed: "Worldwide",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: site.email,
        telephone: site.telephone,
        areaServed: "Worldwide",
        availableLanguage: ["English"],
      },
      knowsAbout: site.services.map((service) => service.name),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Software Engineering Services",
        itemListElement: site.services.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.name,
            description: service.description,
            provider: { "@id": organizationId },
            areaServed: "Worldwide",
          },
        })),
      },
      ...(site.sameAs.length > 0 && { sameAs: site.sameAs }),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.description,
      inLanguage: "en",
      publisher: { "@id": organizationId },
    },
  ],
};
