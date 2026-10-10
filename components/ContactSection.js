"use client";

import { useState } from "react";
import RevealHeading from "@/components/RevealHeading";
import { site } from "@/lib/site";

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const MailIcon = () => (
  <svg {...iconProps}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const PhoneIcon = () => (
  <svg {...iconProps}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const PinIcon = () => (
  <svg {...iconProps}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = (props) => (
  <svg {...iconProps} {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ShieldIcon = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const contactDetails = [
  { label: "EXECUTIVE EMAIL", value: site.email, href: `mailto:${site.email}`, icon: <MailIcon /> },
  { label: "DIRECT LINE", value: site.phoneDisplay, href: `tel:${site.telephone.replace(/-/g, "")}`, icon: <PhoneIcon /> },
  { label: "OFFICE LOCATION", value: "Visakhapatnam (Vizag)", note: "Andhra Pradesh, India", icon: <PinIcon /> },
];

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section
      id="contact"
      className="responsive-container"
      style={{
        padding: "clamp(60px, 8vw, 110px) 0 clamp(60px, 8vw, 120px) 0",
        position: "relative",
        zIndex: 20,
      }}
    >
      {/* Top Header */}
      <div style={{ textAlign: "center", marginBottom: "clamp(32px, 5vw, 50px)" }}>
        {/* Title */}
        <RevealHeading
          className="font-heading"
          style={{
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            color: "#FFFFFF",
            marginBottom: "14px",
          }}
          parts={[
            { text: "Initiate Your " },
            { text: "Architecture Review.", className: "gold-text-gradient" },
          ]}
        />

        {/* Subtitle */}
        <p
          style={{
            fontSize: "clamp(0.9rem, 1.05vw, 1rem)",
            lineHeight: 1.6,
            color: "var(--text-muted)",
            maxWidth: "720px",
            margin: "0 auto",
            fontWeight: 400,
          }}
        >
          Speak directly with our senior technology directors and software architects. We provide an initial technical feasibility audit and scope estimate within 24 hours.
        </p>
      </div>

      {/* 2-Column Grid */}
      <div className="contact-grid">
        {/* Left Column: Global Headquarters */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              backgroundColor: "rgba(14, 14, 18, 0.75)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "24px",
              padding: "clamp(24px, 4vw, 36px) clamp(20px, 3.5vw, 30px)",
            }}
          >
            <h3
              className="font-heading"
              style={{
                fontSize: "clamp(1.2rem, 1.6vw, 1.4rem)",
                fontWeight: 800,
                color: "#FFFFFF",
                marginBottom: "20px",
              }}
            >
              Global Headquarters
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {contactDetails.map((detail) => (
                <div key={detail.label} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <div className="contact-icon">{detail.icon}</div>
                  <div>
                    <div
                      style={{
                        fontSize: "10.5px",
                        fontWeight: 800,
                        letterSpacing: "0.1em",
                        color: "var(--text-subtle)",
                        textTransform: "uppercase",
                        marginBottom: "4px",
                      }}
                    >
                      {detail.label}
                    </div>
                    <div
                      style={{
                        fontSize: "clamp(13px, 1vw, 14px)",
                        fontWeight: 700,
                        color: "#FFFFFF",
                        wordBreak: "break-word",
                      }}
                    >
                      {detail.href ? (
                        <a href={detail.href} style={{ color: "inherit", textDecoration: "none" }}>
                          {detail.value}
                        </a>
                      ) : (
                        detail.value
                      )}
                    </div>
                    {detail.note && (
                      <div style={{ fontSize: "11.5px", color: "var(--text-subtle)", marginTop: "2px" }}>
                        {detail.note}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Status Pills Row */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "14px 22px",
                marginTop: "24px",
                paddingTop: "18px",
                borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                fontSize: "12px",
                color: "rgba(255, 255, 255, 0.7)",
              }}
            >
              <div className="contact-status">
                <ClockIcon width={15} height={15} /> Average Response: &lt; 4 Hours
              </div>
              <div className="contact-status">
                <ShieldIcon width={15} height={15} /> NDA Signed Automatically
              </div>
            </div>
          </div>

          {/* Guarantee Confidentiality Box */}
          <div
            style={{
              backgroundColor: "rgba(14, 14, 18, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "18px",
              padding: "18px 22px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div className="contact-icon is-gold">
              <ShieldIcon />
            </div>
            <p
              style={{
                fontSize: "12px",
                lineHeight: 1.5,
                color: "rgba(255, 255, 255, 0.7)",
                margin: 0,
              }}
            >
              All conversations, system architecture disclosures, and intellectual property remain strictly confidential under mutual corporate non-disclosure.
            </p>
          </div>
        </div>

        {/* Right Column: Schedule Architecture Consultation Form */}
        <div
          style={{
            backgroundColor: "rgba(14, 14, 18, 0.85)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "24px",
            padding: "clamp(24px, 4vw, 36px) clamp(20px, 3.5vw, 34px)",
          }}
        >
          <h3
            className="font-heading"
            style={{
              fontSize: "clamp(1.2rem, 1.6vw, 1.4rem)",
              fontWeight: 800,
              color: "#FFFFFF",
              marginBottom: "20px",
            }}
          >
            Schedule Architecture Consultation
          </h3>

          {submitted ? (
            <div className="contact-success" role="status">
              {/* Gold tick that draws itself */}
              <svg className="success-tick" viewBox="0 0 52 52" aria-hidden="true">
                <circle cx="26" cy="26" r="24" />
                <path d="M15 27l7 7 15-15" />
              </svg>
              <h4 className="font-heading" style={{ fontSize: "1.5rem", color: "#FFFFFF", marginBottom: "8px" }}>
                Consultation Request Submitted!
              </h4>
              <p style={{ color: "var(--text-muted)", fontSize: "13.5px" }}>
                Thank you for reaching out. Our solution architects will contact you within 4 business hours.
              </p>
            </div>
          ) : (
            // Floating labels: each label sits inside its field and glides up once the
            // field is focused or filled (the placeholder=" " makes :placeholder-shown work)
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Row 1: Name & Email */}
              <div className="contact-form-row">
                <div className="field">
                  <input
                    required
                    id="contact-name"
                    name="name"
                    autoComplete="name"
                    type="text"
                    placeholder=" "
                    className="field-input"
                  />
                  <label htmlFor="contact-name" className="field-label">Full Name *</label>
                </div>

                <div className="field">
                  <input
                    required
                    id="contact-email"
                    name="email"
                    autoComplete="email"
                    type="email"
                    placeholder=" "
                    className="field-input"
                  />
                  <label htmlFor="contact-email" className="field-label">Corporate Email *</label>
                </div>
              </div>

              {/* Row 2: Company & Primary Capability */}
              <div className="contact-form-row">
                <div className="field">
                  <input
                    id="contact-company"
                    name="company"
                    autoComplete="organization"
                    type="text"
                    placeholder=" "
                    className="field-input"
                  />
                  <label htmlFor="contact-company" className="field-label">Company / Organization</label>
                </div>

                <div className="field">
                  <select id="contact-capability" name="capability" className="field-input field-select">
                    <option value="Custom Software Development">Custom Software Development</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                    <option value="Cloud Solutions">Cloud Solutions</option>
                    <option value="AI & Automation">AI & Automation</option>
                    <option value="Digital Transformation">Digital Transformation</option>
                  </select>
                  <label htmlFor="contact-capability" className="field-label is-raised">
                    Primary Capability Needed
                  </label>
                </div>
              </div>

              {/* Row 3: Target Project Scope / Budget */}
              <div className="field">
                <select id="contact-budget" name="budget" className="field-input field-select">
                  <option value="$50,000 - $150,000">$50,000 - $150,000 (Production Release)</option>
                  <option value="$150,000 - $500,000">$150,000 - $500,000 (Enterprise Solution)</option>
                  <option value="$500,000+">$500,000+ (Global Infrastructure Pivot)</option>
                </select>
                <label htmlFor="contact-budget" className="field-label is-raised">
                  Target Project Scope / Budget
                </label>
              </div>

              {/* Row 4: Project Overview Textarea */}
              <div className="field">
                <textarea
                  required
                  id="contact-overview"
                  name="overview"
                  rows={4}
                  placeholder=" "
                  className="field-input field-textarea"
                />
                <label htmlFor="contact-overview" className="field-label">
                  Project Overview, Challenges & Objectives *
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                data-magnetic
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: 800,
                  color: "#0D0D0D",
                  background: "var(--gradient-gold-btn)",
                  border: "none",
                  boxShadow: "0 4px 22px rgba(212, 175, 55, 0.45)",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  marginTop: "6px",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 6px 28px rgba(212, 175, 55, 0.65)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 4px 22px rgba(212, 175, 55, 0.45)";
                }}
              >
                Submit Architecture Request ↗
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
