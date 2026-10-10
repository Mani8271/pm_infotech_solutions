"use client";

import { useEffect, useRef } from "react";
import { scrollToTarget } from "@/lib/smoothScroll";
import { site } from "@/lib/site";

// X and GitHub marks from Simple Icons v16.34.0 (CC0). LinkedIn isn't in Simple Icons any
// more, so it is drawn from basic shapes; Instagram and the globe are line icons like the rest of the site.
const socials = [
  {
    label: "Instagram",
    href: site.instagram,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "X",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    label: "Website",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

const lineIcon = {
  width: 15,
  height: 15,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const footerContacts = [
  {
    text: site.email,
    href: `mailto:${site.email}`,
    icon: (
      <svg {...lineIcon}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    text: site.phoneDisplay,
    href: `tel:${site.telephone.replace(/-/g, "")}`,
    icon: (
      <svg {...lineIcon}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    text: "Visakhapatnam (Vizag), Andhra Pradesh, India",
    icon: (
      <svg {...lineIcon}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

const linkColumns = [
  { title: "COMPANY", href: "#", links: ["Home", "About Us", "Our Process", "Why Choose Us", "Careers"] },
  { title: "SERVICES", href: "#services", links: ["Custom Software", "Web Development", "Mobile Apps", "Cloud Solutions", "AI & Automation"] },
  { title: "SOLUTIONS", href: "#solutions", links: ["FinTech Vaults", "AI Logistics", "Clinical Health", "Enterprise Stack", "Architecture Audit"] },
];

const headingStyle = {
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.14em",
  color: "#FFFFFF",
  textTransform: "uppercase",
  marginBottom: "20px",
};

export default function Footer() {
  const wordmarkRef = useRef(null);

  // The giant wordmark fills with gold from left to right over the last stretch of scrolling
  useEffect(() => {
    let frame = null;

    function update() {
      frame = null;
      const el = wordmarkRef.current;
      if (!el) return;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const start = el.getBoundingClientRect().top + window.scrollY - window.innerHeight;
      const span = maxScroll - start;
      const fill = span > 0 ? Math.min(1, Math.max(0, (window.scrollY - start) / span)) : 1;
      el.style.setProperty("--fill", fill.toFixed(3));
    }

    function schedule() {
      if (frame === null) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        backgroundColor: "#030305",
        padding: "clamp(48px, 6vw, 80px) clamp(16px, 4vw, 32px) 0 clamp(16px, 4vw, 32px)",
        position: "relative",
        zIndex: 20,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* Main Footer Grid */}
        <div className="footer-grid" style={{ marginBottom: "clamp(36px, 5vw, 60px)" }}>
          {/* Column 1: Brand Info & Socials */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "1.5px solid var(--gold-main)",
                  boxShadow: "0 0 12px var(--gold-glow)",
                }}
              >
                <img
                  src="/company_logo.jpeg"
                  alt="PM Infotech Logo"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div className="font-heading" style={{ fontSize: "16px", fontWeight: 800, color: "#FFFFFF" }}>
                <span className="gold-text-gradient">PM</span> INFOTECH{" "}
                <span className="silver-text-gradient" style={{ fontSize: "11px" }}>SOLUTIONS</span>
              </div>
            </div>

            <p
              style={{
                fontSize: "13px",
                lineHeight: 1.6,
                color: "var(--text-muted)",
                maxWidth: "340px",
                marginBottom: "24px",
                fontWeight: 400,
              }}
            >
              PM INFOTECH SOLUTIONS is a premier global software engineering firm designing and deploying scalable web, mobile, AI, and cloud architectures for ambitious worldwide businesses.
            </p>

            {/* Social Icons */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href ?? "#"}
                  {...(social.href && { target: "_blank", rel: "noopener noreferrer" })}
                  className="footer-social"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Columns 2-4: COMPANY / SERVICES / SOLUTIONS */}
          {linkColumns.map((column) => (
            <div key={column.title}>
              <h4 style={headingStyle}>{column.title}</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                {column.links.map((link) => (
                  <li key={link}>
                    <a href={column.href} className="footer-link">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Column 5: CONTACT */}
          <div>
            <h4 style={headingStyle}>CONTACT</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", color: "var(--text-muted)" }}>
              {footerContacts.map((item) => (
                <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: "var(--gold-main)", display: "flex", flexShrink: 0 }}>{item.icon}</span>
                  {item.href ? (
                    <a href={item.href} className="footer-link">
                      {item.text}
                    </a>
                  ) : (
                    item.text
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div
          style={{
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            fontSize: "12px",
            color: "var(--text-subtle)",
          }}
        >
          <div>© {new Date().getFullYear()} PM INFOTECH SOLUTIONS. All Rights Reserved.</div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            <a href="#" style={{ color: "var(--text-subtle)", textDecoration: "none" }}>Privacy Policy</a>
            <a href="#" style={{ color: "var(--text-subtle)", textDecoration: "none" }}>Terms of Service</a>
            <a href="#" style={{ color: "var(--text-subtle)", textDecoration: "none" }}>Security Disclosures</a>
            <button
              onClick={() => scrollToTarget(0)}
              style={{
                background: "none",
                border: "none",
                color: "var(--gold-main)",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontFamily: "inherit",
              }}
            >
              Back to Top ↑
            </button>
          </div>
        </div>

        {/* Giant wordmark: an outline that fills with gold as you reach the end of the page */}
        <div ref={wordmarkRef} className="footer-wordmark font-heading" aria-hidden="true">
          <span className="footer-wordmark-outline">PM INFOTECH</span>
          <span className="footer-wordmark-fill">PM INFOTECH</span>
        </div>
      </div>
    </footer>
  );
}
