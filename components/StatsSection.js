"use client";

import { useEffect, useRef } from "react";
import { useInView } from "@/lib/useInView";

const stats = [
  { number: "150+", label: "Enterprise Projects Delivered", detail: "Global Fortune 500 & High-Growth Scaleups" },
  { number: "99.99%", label: "Sub-Second Performance SLA", detail: "Ultra-low Latency Architecture" },
  { number: "50M+", label: "Monthly Active Users", detail: "Handled seamlessly across platforms" },
  { number: "15+", label: "Global Industry Awards", detail: "Awwwards, FWA & RedDot recognized" },
];

const COUNT_MS = 1800;

// Splits "99.99%" into 99.99 / "%" / 2 decimals so it can be counted up from zero
function parseStat(text) {
  const [, digits, suffix] = text.match(/^([\d.]+)(.*)$/);
  return { value: parseFloat(digits), suffix, decimals: (digits.split(".")[1] ?? "").length };
}

// Rolls a number up from zero when `run` turns true (and back to zero when it turns false)
function CountUp({ text, run, delay }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const { value, suffix, decimals } = parseStat(text);
    if (!run) {
      el.textContent = (0).toFixed(decimals) + suffix;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = text;
      return;
    }

    let frame;
    const start = performance.now() + delay;
    function tick(now) {
      const t = Math.min(1, Math.max(0, (now - start) / COUNT_MS));
      const eased = 1 - Math.pow(1 - t, 4); // Fast start, gentle landing
      el.textContent = (value * eased).toFixed(decimals) + suffix;
      if (t < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, run, delay]);

  return <span ref={ref}>{text}</span>;
}

export default function StatsSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { threshold: 0.35 });

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`stats-section ${inView ? "is-in" : ""}`}
      style={{
        padding: "clamp(60px, 8vw, 120px) clamp(16px, 4vw, 32px) clamp(32px, 4vw, 60px) clamp(16px, 4vw, 32px)",
        width: "min(100% - 32px, 1360px)",
        margin: "0 auto",
        position: "relative",
        zIndex: 4,
      }}
    >
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={stat.label} className="stat-card" style={{ "--i": idx }}>
            <div className="gold-text-gradient font-heading stat-number">
              <CountUp text={stat.number} run={inView} delay={idx * 120} />
            </div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-detail">{stat.detail}</div>
            <span className="stat-bar" aria-hidden="true" />
          </div>
        ))}
      </div>
    </section>
  );
}
