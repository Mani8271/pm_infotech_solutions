"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import RevealHeading from "@/components/RevealHeading";
import { useSwipeHint } from "@/lib/useSwipeCarousel";

const metrics = [
  { value: "99.99%", label: "Uptime Architecture" },
  { value: "4.9★", label: "Store Rating Standard" },
  { value: "10x", label: "Workflow Efficiency" },
  { value: "3.4x", label: "Conversion Lift" },
];

// Four copies: the ticker scrolls by exactly half its width, and each half has to be
// wider than the screen for the loop to be seamless
const tickerItems = [...metrics, ...metrics, ...metrics, ...metrics];

const services = [
  // Row 1
  {
    id: "web-dev",
    category: "FRONTEND & FULL-STACK",
    title: "Web Development",
    description:
      "Ultra-responsive, accessible, and mission-critical web applications built with Next.js, React, and micro-frontend architectures.",
    bgImage: "/cards_1/card_web.webp",
    objectPosition: "75% 55%",
    bullets: [
      "Headless CMS Integration",
      "Edge SSR & Static Optimization",
      "Sub-second Load Times",
      "WCAG AAA Accessibility",
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    id: "mobile-dev",
    category: "CROSS-PLATFORM & NATIVE",
    title: "Mobile App Development",
    description:
      "High-performance mobile solutions crafted using Flutter and React Native, delivering native speed, fluid gesture control, and offline sync.",
    bgImage: "/cards_1/card_mobile.webp",
    objectPosition: "70% 50%",
    bullets: [
      "Real-Time Biometric Auth",
      "Offline-First SQLite Architecture",
      "Custom Canvas Rendering",
      "App Store & Play Store CI/CD",
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  {
    id: "custom-software",
    category: "ENTERPRISE ENGINEERING",
    title: "Custom Software Development",
    description:
      "End-to-end bespoke software engineered to automate complex business workflows, eliminate operational bottlenecks, and scale infinitely.",
    bgImage: "/cards_1/card_software.webp",
    objectPosition: "85% 50%",
    bullets: [
      "Domain-Driven Design (DDD)",
      "Multi-Tenant Architecture",
      "Custom ERP / CRM Modules",
      "Enterprise API Integration",
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <line x1="9" y1="1" x2="9" y2="4" />
        <line x1="15" y1="1" x2="15" y2="4" />
        <line x1="9" y1="20" x2="9" y2="23" />
        <line x1="15" y1="20" x2="15" y2="23" />
        <line x1="20" y1="9" x2="23" y2="9" />
        <line x1="20" y1="15" x2="23" y2="15" />
        <line x1="1" y1="9" x2="4" y2="9" />
        <line x1="1" y1="15" x2="4" y2="15" />
      </svg>
    ),
  },
  {
    id: "ui-ux",
    category: "PRODUCT STRATEGY",
    title: "UI/UX Design",
    description:
      "Human-centered interfaces, cohesive design systems, and cinematic interaction design that elevate brand equity and convert users.",
    bgImage: "/cards_1/card_design.webp",
    objectPosition: "80% 50%",
    bullets: [
      "Comprehensive Design Systems",
      "Interactive Micro-Prototyping",
      "User Journey Mapping",
      "A/B Test Optimization",
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
  },

  // Row 2
  {
    id: "cloud-solutions",
    category: "INFRASTRUCTURE & DEVOPS",
    title: "Cloud Solutions",
    description:
      "Resilient cloud infrastructure on AWS and Azure with automated Kubernetes orchestration, zero-downtime deployments, and finops audit.",
    bgImage: "/cards_1/card_cloud.webp",
    objectPosition: "75% 55%",
    bullets: [
      "Kubernetes & Containerization",
      "CI/CD Pipeline Automation",
      "Multi-Region Deployment",
      "Cost Optimization & Monitoring",
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    ),
  },
  {
    id: "ai-automation",
    category: "INTELLIGENT SYSTEMS",
    title: "AI & Automation",
    description:
      "Harnessing generative AI, agentic workflows, machine learning models, and cognitive NLP to automate knowledge work and unlock foresight.",
    bgImage: "/cards_1/card_ai.webp",
    objectPosition: "75% 55%",
    bullets: [
      "LLM Integration & RAG",
      "AI Agents & Automation",
      "Predictive Analytics",
      "Intelligent Document Processing",
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  {
    id: "digital-transformation",
    category: "STRATEGIC MODERNIZATION",
    title: "Digital Transformation",
    description:
      "Systematic legacy refactoring, monolithic modernization, and organizational technology pivots engineered for sustained competitive advantage.",
    bgImage: "/cards_1/card_transformation.webp",
    objectPosition: "75% 55%",
    bullets: [
      "Legacy System Modernization",
      "Microservices Architecture",
      "Process Automation",
      "Scalable Enterprise Platforms",
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: "api-backend",
    category: "CORE INFRASTRUCTURE",
    title: "API & Backend Development",
    description:
      "High-throughput backend engines, GraphQL and gRPC pipelines, distributed caching, and rock-solid relational/NoSQL persistence.",
    bgImage: "/cards_1/card_backend.webp",
    objectPosition: "75% 55%",
    bullets: [
      "GraphQL / REST API Development",
      "Distributed Caching (Redis)",
      "Database Architecture & Scaling",
      "Real-Time Event Processing",
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
];

// Cards start tipped back flat (hinged at the bottom edge) and stand up, overshooting slightly
const STAND_UP_KEYFRAMES = [
  { transform: "perspective(1200px) translateY(40px) rotateX(80deg)", opacity: 0 },
  { transform: "perspective(1200px) translateY(0) rotateX(-6deg)", opacity: 1, offset: 0.7 },
  { transform: "perspective(1200px) translateY(0) rotateX(0deg)", opacity: 1 },
];
const GLINT_KEYFRAMES = [
  { transform: "translateX(-100%)", opacity: 0 },
  { transform: "translateX(0%)", opacity: 1, offset: 0.5 },
  { transform: "translateX(100%)", opacity: 0 },
];
const STAND_UP_THRESHOLD = 0.2; // Share of the grid on screen before the cards stand up
const CAROUSEL_QUERY = "(max-width: 767px)";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function ServicesSection() {
  const [flipped, setFlipped] = useState(() => new Set());
  const [isDown, setIsDown] = useState(true); // Cards lying flat (hidden) while off screen
  const [standKey, setStandKey] = useState(0); // Bumped to play the stand-up animation
  const [carousel, setCarousel] = useState(false); // Mobile 3D swipe carousel
  const [activeIndex, setActiveIndex] = useState(0);

  const gridRef = useRef(null);
  const isDownRef = useRef(true);
  const coverFrameRef = useRef(null);

  useSwipeHint(gridRef, carousel);

  useEffect(() => {
    const mq = window.matchMedia(CAROUSEL_QUERY);
    const update = () => setCarousel(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Lay the cards back down when the grid leaves the screen and stand them up again when
  // it returns, so the entrance replays whether the page is scrolled down or back up
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          if (isDownRef.current) return;
          for (const slot of grid.children) {
            slot.getAnimations({ subtree: true }).forEach((a) => a.cancel());
          }
          isDownRef.current = true;
          setIsDown(true);
          setFlipped(new Set()); // Show the fronts again next time
        } else if (isDownRef.current && entry.intersectionRatio >= STAND_UP_THRESHOLD) {
          isDownRef.current = false;
          setIsDown(false);
          if (!prefersReducedMotion()) setStandKey((key) => key + 1);
        }
      },
      { threshold: [0, STAND_UP_THRESHOLD] }
    );
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  // Stand the cards up one by one, each followed by a gold glint across its face
  useLayoutEffect(() => {
    if (standKey === 0) return;
    Array.from(gridRef.current.children).forEach((slot, i) => {
      const delay = i * 90;
      slot.animate(STAND_UP_KEYFRAMES, {
        duration: 950,
        delay,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "backwards",
      });
      slot.querySelector(".svc-glint")?.animate(GLINT_KEYFRAMES, {
        duration: 900,
        delay: delay + 550,
        easing: "ease-in-out",
      });
    });
  }, [standKey]);

  // Mobile: angle and shrink the neighbouring slides like a coverflow as the track scrolls
  useEffect(() => {
    const track = gridRef.current;
    const slots = Array.from(track.children);

    if (!carousel) {
      slots.forEach((slot) => {
        slot.style.zIndex = "";
        slot.firstElementChild.style.transform = "";
        slot.firstElementChild.style.opacity = "";
      });
      return;
    }

    function update() {
      coverFrameRef.current = null;
      const center = track.scrollLeft + track.clientWidth / 2;
      let closest = 0;
      let closestDistance = Infinity;
      slots.forEach((slot, i) => {
        const slotCenter = slot.offsetLeft + slot.offsetWidth / 2;
        const offset = Math.max(-1.5, Math.min(1.5, (slotCenter - center) / slot.offsetWidth));
        const strength = Math.min(1, Math.abs(offset));
        const cover = slot.firstElementChild;
        // Side slides tuck in toward the centre (and behind it) so their angled edges peek out
        slot.style.zIndex = String(10 - Math.round(strength * 5));
        cover.style.transform = `perspective(900px) translateX(${(-offset * 18).toFixed(2)}%) rotateY(${(-offset * 32).toFixed(2)}deg) scale(${(1 - strength * 0.12).toFixed(3)})`;
        cover.style.opacity = (1 - strength * 0.3).toFixed(3);
        if (Math.abs(slotCenter - center) < closestDistance) {
          closestDistance = Math.abs(slotCenter - center);
          closest = i;
        }
      });
      setActiveIndex(closest);
    }

    function scheduleUpdate() {
      if (coverFrameRef.current === null) coverFrameRef.current = requestAnimationFrame(update);
    }

    update();
    track.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      track.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (coverFrameRef.current !== null) cancelAnimationFrame(coverFrameRef.current);
      coverFrameRef.current = null;
    };
  }, [carousel]);

  function scrollToSlide(index) {
    const track = gridRef.current;
    const slot = track.children[index];
    track.scrollTo({ left: slot.offsetLeft - (track.clientWidth - slot.offsetWidth) / 2, behavior: "smooth" });
  }

  function toggleFlip(id) {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleCardClick(e, index, id) {
    if (e.target.closest("a")) return; // The back-face CTA navigates instead of flipping
    // In the carousel, tapping a side card brings it to the centre first
    if (carousel && index !== activeIndex) {
      scrollToSlide(index);
      return;
    }
    toggleFlip(id);
  }

  // Tilt toward the cursor; CSS turns --px/--py into the tilt plus the image/text parallax
  function handleTiltMove(e) {
    if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const tilt = e.currentTarget;
    const rect = tilt.closest(".svc-slot").getBoundingClientRect();
    tilt.style.setProperty("--px", ((e.clientX - rect.left) / rect.width - 0.5).toFixed(3));
    tilt.style.setProperty("--py", ((e.clientY - rect.top) / rect.height - 0.5).toFixed(3));
  }

  function handleTiltLeave(e) {
    e.currentTarget.style.setProperty("--px", "0");
    e.currentTarget.style.setProperty("--py", "0");
  }

  return (
    <section
      id="services"
      className="responsive-container"
      style={{
        padding: "clamp(60px, 8vw, 110px) 0",
        position: "relative",
        zIndex: 5,
      }}
    >
      {/* Section Top Header */}
      <div style={{ textAlign: "center", marginBottom: "clamp(32px, 5vw, 50px)" }}>
        {/* Main Section Title */}
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
            { text: "Engineered For " },
            { text: "Maximum Impact.", className: "gold-text-gradient" },
          ]}
        />

        {/* Subtitle Description */}
        <p
          style={{
            fontSize: "clamp(0.9rem, 1.05vw, 1.05rem)",
            lineHeight: 1.6,
            color: "var(--text-muted)",
            maxWidth: "720px",
            margin: "0 auto",
            fontWeight: 400,
          }}
        >
          From bespoke cloud architectures to high-concurrency digital platforms, we provide end-to-end engineering excellence across the modern technology landscape.
        </p>
      </div>

      {/* Metrics Ticker (scrolls continuously; hover pauses) */}
      <div className="svc-ticker">
        <div className="svc-ticker-track">
          {tickerItems.map((metric, i) => {
            const isDuplicate = i >= metrics.length;
            return (
              <div
                key={i}
                className={`svc-ticker-item ${isDuplicate ? "is-dup" : ""}`}
                aria-hidden={isDuplicate || undefined}
              >
                <span className="svc-ticker-dot" />
                <span className="gold-text-gradient font-heading svc-ticker-value">{metric.value}</span>
                <span>{metric.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3D Flip Cards: grid on desktop, swipeable coverflow carousel on mobile */}
      <div ref={gridRef} className={`services-grid ${isDown ? "is-down" : ""}`}>
        {services.map((service, index) => {
          const isFlipped = flipped.has(service.id);
          return (
            <div key={service.id} className="svc-slot">
              <div className="svc-cover">
                <div
                  className="svc-tilt"
                  onPointerMove={handleTiltMove}
                  onPointerLeave={handleTiltLeave}
                  onClick={(e) => handleCardClick(e, index, service.id)}
                >
                  <div className={`svc-flipper ${isFlipped ? "is-flipped" : ""}`}>
                    {/* Front: image, title and short description */}
                    <div className="svc-face svc-front" inert={isFlipped || undefined}>
                      <img
                        src={service.bgImage}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="svc-img"
                        style={{ objectPosition: service.objectPosition || "80% 60%" }}
                      />
                      <div className="svc-overlay" />
                      <div className="svc-glint" />

                      <div className="svc-content">
                        <div className="svc-top">
                          <div className="svc-tag">
                            <div className="svc-icon">{service.icon}</div>
                            <span className="svc-category">{service.category}</span>
                          </div>
                          <button
                            type="button"
                            className="svc-flip-btn"
                            aria-label={`Show details for ${service.title}`}
                          >
                            →
                          </button>
                        </div>

                        <h3 className="font-heading svc-title">{service.title}</h3>
                        <p className="svc-desc">{service.description}</p>

                        <span className="svc-hint">
                          Explore capabilities <span aria-hidden="true">↻</span>
                        </span>
                      </div>
                    </div>

                    {/* Back: capabilities list and call to action */}
                    <div className="svc-face svc-back" inert={!isFlipped || undefined}>
                      <div className="svc-top">
                        <div className="svc-tag">
                          <div className="svc-icon is-solid">{service.icon}</div>
                          <span className="svc-category">{service.category}</span>
                        </div>
                        <button
                          type="button"
                          className="svc-flip-btn"
                          aria-label={`Back to ${service.title} overview`}
                        >
                          ↺
                        </button>
                      </div>

                      <h3 className="font-heading svc-title">{service.title}</h3>

                      <ul className="svc-bullets">
                        {service.bullets.map((bullet) => (
                          <li key={bullet}>
                            <span className="svc-check" aria-hidden="true">✓</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      <a href="#contact" className="svc-cta">
                        Discuss this project →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Carousel position dots (mobile only) */}
      <div className="carousel-dots">
        {services.map((service, i) => (
          <button
            key={service.id}
            type="button"
            className={`carousel-dot ${i === activeIndex ? "is-active" : ""}`}
            aria-label={`Show ${service.title}`}
            aria-current={i === activeIndex || undefined}
            onClick={() => scrollToSlide(i)}
          />
        ))}
      </div>
    </section>
  );
}
