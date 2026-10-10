"use client";

import { useEffect, useRef, useState } from "react";
import RevealHeading from "@/components/RevealHeading";

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const steps = [
  {
    num: "01",
    title: "Discover",
    tag: "STRATEGY",
    desc: "We dig into your goals, users and constraints in focused workshops, then turn them into a clear product brief and roadmap.",
    deliverables: ["Workshops", "Product brief", "Roadmap"],
    icon: (
      <svg {...iconProps}>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Design",
    tag: "EXPERIENCE",
    desc: "User flows, interactive prototypes and a design system, tested with real users before production code is written.",
    deliverables: ["UX flows", "Prototypes", "Design system"],
    icon: (
      <svg {...iconProps}>
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Build",
    tag: "ENGINEERING",
    desc: "Agile sprints with regular demos, automated testing and code reviews, so you see working software at every step.",
    deliverables: ["Agile sprints", "Automated QA", "CI/CD"],
    icon: (
      <svg {...iconProps}>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Launch",
    tag: "GROWTH",
    desc: "Production deployment, monitoring and performance tuning, followed by ongoing support as your product grows.",
    deliverables: ["Deployment", "Monitoring", "Ongoing support"],
    icon: (
      <svg {...iconProps}>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    ),
  },
];

export default function ProcessSection() {
  const timelineRef = useRef(null);
  const [reached, setReached] = useState(0); // How many steps the gold line has reached

  // The line's tip follows a point 60% down the screen; each step lights up as the tip passes it
  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timeline.style.setProperty("--progress", "1");
      setReached(steps.length);
      return;
    }

    let frame = null;

    function update() {
      frame = null;
      const tip = window.innerHeight * 0.6;
      const rect = timeline.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (tip - rect.top) / rect.height));
      timeline.style.setProperty("--progress", progress.toFixed(4));
      let count = 0;
      timeline.querySelectorAll(".process-node").forEach((node) => {
        const nodeRect = node.getBoundingClientRect();
        if (nodeRect.top + nodeRect.height / 2 <= tip) count++;
      });
      setReached(count);
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
    <section
      id="process"
      className="responsive-container"
      style={{
        padding: "clamp(60px, 8vw, 110px) 0",
        position: "relative",
        zIndex: 20,
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: "clamp(40px, 6vw, 80px)" }}>
        <RevealHeading
          className="font-heading section-title"
          parts={[{ text: "From First Idea To " }, { text: "Live Product.", className: "gold-text-gradient" }]}
        />
        <p className="section-subtitle">
          A clear, collaborative process with visible progress at every stage, so you always know what is happening and what comes next.
        </p>
      </div>

      {/* Timeline: the gold line draws itself down the middle as you scroll */}
      <div ref={timelineRef} className="process-timeline">
        <div className="process-track" aria-hidden="true">
          <div className="process-track-fill" />
        </div>

        <ol className="process-steps">
          {steps.map((step, i) => (
            <li
              key={step.num}
              className={`process-step ${i % 2 === 1 ? "is-right" : ""} ${i < reached ? "is-reached" : ""}`}
            >
              <div className="process-card">
                <div className="process-tag">
                  {step.num} · {step.tag}
                </div>
                <h3 className="font-heading process-title">{step.title}</h3>
                <p className="process-desc">{step.desc}</p>
                <div className="process-chips">
                  {step.deliverables.map((item) => (
                    <span key={item} className="process-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="process-node">{step.icon}</div>

              <div className="process-ghost font-heading" aria-hidden="true">
                {step.num}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
