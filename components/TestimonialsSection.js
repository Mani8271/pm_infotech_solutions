"use client";

import { useEffect, useRef, useState } from "react";
import RevealHeading from "@/components/RevealHeading";
import { useInView } from "@/lib/useInView";

// PLACEHOLDER CONTENT: replace with real clients (logo image or name) and real quotes you
// have permission to publish. Never ship invented testimonials.
const clientLogos = ["Client Logo", "Client Logo", "Client Logo", "Client Logo", "Client Logo", "Client Logo"];

const testimonials = [
  {
    quote:
      "Placeholder: add a real client quote here. Two or three sentences about working with PM Infotech and the result it delivered for their business.",
    name: "Client Name",
    role: "Title, Company",
  },
  {
    quote:
      "Placeholder: a second client's words about the team, the process, and what changed after launch.",
    name: "Client Name",
    role: "Title, Company",
  },
  {
    quote:
      "Placeholder: a third quote, ideally mentioning a concrete outcome such as speed, revenue or reliability.",
    name: "Client Name",
    role: "Title, Company",
  },
];

const AUTO_ADVANCE_MS = 7000;

// Two copies of the logo row: the strip scrolls by exactly one copy, so the loop is seamless
const logoStrip = [...clientLogos, ...clientLogos];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const carouselRef = useRef(null);
  const inView = useInView(carouselRef, { threshold: 0.3 });

  // Move to the next quote every few seconds while the carousel is on screen and not hovered
  useEffect(() => {
    if (!inView || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % testimonials.length), AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [inView, paused, active]);

  const go = (step) => setActive((i) => (i + step + testimonials.length) % testimonials.length);

  return (
    <section
      id="testimonials"
      className="responsive-container"
      style={{
        padding: "clamp(60px, 8vw, 110px) 0",
        position: "relative",
        zIndex: 20,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "clamp(32px, 5vw, 50px)" }}>
        <RevealHeading
          className="font-heading section-title"
          parts={[{ text: "Trusted By Teams " }, { text: "Who Ship.", className: "gold-text-gradient" }]}
        />
      </div>

      {/* Client logo strip (scrolls continuously; hover pauses) */}
      <div className="logo-marquee" aria-label="Clients">
        <div className="logo-marquee-track">
          {logoStrip.map((logo, i) => (
            <div key={i} className="logo-slot" aria-hidden={i >= clientLogos.length || undefined}>
              {logo}
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial carousel: quotes rotate in 3D */}
      <div
        ref={carouselRef}
        className="testimonial-carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="testimonial-stage" aria-live="polite">
          {testimonials.map((item, i) => {
            const offset = (i - active + testimonials.length) % testimonials.length;
            const position = offset === 0 ? "is-active" : offset === 1 ? "is-next" : "is-prev";
            return (
              <figure key={i} className={`testimonial-card ${position}`} aria-hidden={offset !== 0}>
                <svg className="testimonial-mark" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M10 8C5.6 9.8 3 13.6 3 18.6V25h9v-9H7.2c.3-2.9 1.9-5.1 4.6-6.4L10 8zm16 0c-4.4 1.8-7 5.6-7 10.6V25h9v-9h-4.8c.3-2.9 1.9-5.1 4.6-6.4L26 8z" />
                </svg>
                <blockquote className="testimonial-quote">{item.quote}</blockquote>
                <figcaption className="testimonial-person">
                  <span className="testimonial-avatar" aria-hidden="true">
                    {item.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")}
                  </span>
                  <span>
                    <span className="testimonial-name">{item.name}</span>
                    <span className="testimonial-role">{item.role}</span>
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>

        <div className="testimonial-controls">
          <button type="button" className="testimonial-arrow" aria-label="Previous testimonial" onClick={() => go(-1)}>
            ←
          </button>
          <div className="testimonial-dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`testimonial-dot ${i === active ? "is-active" : ""}`}
                aria-label={`Show testimonial ${i + 1}`}
                aria-current={i === active || undefined}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
          <button type="button" className="testimonial-arrow" aria-label="Next testimonial" onClick={() => go(1)}>
            →
          </button>
        </div>
      </div>
    </section>
  );
}
