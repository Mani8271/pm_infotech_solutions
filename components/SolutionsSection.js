"use client";

import { useRef } from "react";
import RevealHeading from "@/components/RevealHeading";
import { useInView } from "@/lib/useInView";
import { useSwipeCarousel } from "@/lib/useSwipeCarousel";

const solutions = [
  {
    num: "01",
    title: "Innovation",
    subTag: "AHEAD OF THE CURVE",
    desc: "We integrate bleeding-edge technology, from reactive micro-architectures to generative AI models, giving you decisive market lead.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.55.6 2.87 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Scalability",
    subTag: "BUILT FOR 100X GROWTH",
    desc: "Engineered for seamless horizontal elasticity, our systems effortlessly withstand traffic surges and global load surges.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Security",
    subTag: "ZERO-TRUST FOUNDATION",
    desc: "End-to-end cryptographic safeguards, SOC-2 readiness, and rigorous penetration audits built into every pipeline.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Performance",
    subTag: "SUB-MILLISECOND SPEED",
    desc: "Obsessive code optimization, distributed CDN edge delivery, and database index perfection for blazing user experience.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    num: "05",
    title: "Dedicated Support",
    subTag: "24/7 SLA BACKING",
    desc: "Tier-1 dedicated site reliability engineers and architects actively monitoring and maintaining your mission-critical software.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
  },
  {
    num: "06",
    title: "Business Focus",
    subTag: "ROI-CENTRIC DELIVERY",
    desc: "We do not build code for the sake of code. Every sprint and release is directly mapped to measurable business outcomes.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
];

// Spotlight: every card tracks the cursor so the borders near it light up too
function handleGridPointerMove(e) {
  if (e.pointerType !== "mouse") return;
  const cards = Array.from(e.currentTarget.querySelectorAll(".sol-card"));
  const rects = cards.map((card) => card.getBoundingClientRect());
  cards.forEach((card, i) => {
    card.style.setProperty("--mx", `${e.clientX - rects[i].left}px`);
    card.style.setProperty("--my", `${e.clientY - rects[i].top}px`);
  });
}

export default function SolutionsSection() {
  const gridRef = useRef(null);
  const inView = useInView(gridRef, { threshold: 0.15 });
  const { active, scrollToIndex } = useSwipeCarousel(gridRef); // Swipe carousel on phones

  return (
    <section
      id="solutions"
      className="responsive-container"
      style={{
        padding: "clamp(60px, 8vw, 110px) 0",
        position: "relative",
        zIndex: 20,
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: "clamp(36px, 5vw, 60px)" }}>
        <RevealHeading
          className="font-heading"
          style={{
            fontSize: "clamp(2rem, 4vw, 3.6rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            color: "#FFFFFF",
            marginBottom: "14px",
          }}
          parts={[
            { text: "Why Industry Leaders " },
            { text: "Choose Us.", className: "gold-text-gradient" },
          ]}
        />

        <p
          style={{
            fontSize: "clamp(0.9rem, 1.05vw, 1.02rem)",
            lineHeight: 1.6,
            color: "var(--text-muted)",
            maxWidth: "700px",
            margin: "0 auto",
            fontWeight: 400,
          }}
        >
          We combine global delivery capability with boutique craftsmanship to ensure every solution achieves maximum technical durability and return on investment.
        </p>
      </div>

      {/* Solutions 6-Card Grid: cards rise in from depth, numbers draw themselves in */}
      <div
        ref={gridRef}
        className={`solutions-grid ${inView ? "is-in" : ""}`}
        onPointerMove={handleGridPointerMove}
      >
        {solutions.map((item, i) => (
          <div key={item.num} className="sol-card-wrap" style={{ "--i": i }}>
            <div className="sol-card">
              <div>
                {/* Top Row: Icon & Drawn Number */}
                <div className="sol-top">
                  <div className="sol-icon">{item.icon}</div>
                  <svg className="sol-num" viewBox="0 0 70 40" aria-hidden="true">
                    <text x="70" y="32" textAnchor="end">
                      {item.num}
                    </text>
                  </svg>
                </div>

                <h3 className="font-heading sol-title">{item.title}</h3>
                <div className="sol-subtag">{item.subTag}</div>
                <p className="sol-desc">{item.desc}</p>
              </div>

              {/* Bottom Baseline Pill */}
              <div className="sol-baseline">
                <span className="sol-baseline-dot" />
                <span>Standard Quality Baseline</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel position dots (phones only) */}
      <div className="carousel-dots">
        {solutions.map((item, i) => (
          <button
            key={item.num}
            type="button"
            className={`carousel-dot ${i === active ? "is-active" : ""}`}
            aria-label={`Show ${item.title}`}
            aria-current={i === active || undefined}
            onClick={() => scrollToIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
