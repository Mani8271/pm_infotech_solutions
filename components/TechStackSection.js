"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import GoldParticles from "@/components/GoldParticles";
import RevealHeading from "@/components/RevealHeading";
import { TECH_LOGO_PATHS } from "@/components/techLogos";

const categories = [
  "All",
  "Frontend",
  "Backend",
  "Mobile",
  "Cloud & DevOps",
  "Database & AI",
];

// `color` is the brand colour, lightened where the official one disappears on black
const technologies = [
  { name: "React", logo: "react", color: "#61DAFB", category: "Frontend" },
  { name: "Next.js", logo: "nextjs", color: "#FFFFFF", category: "Frontend" },
  { name: "Node.js", logo: "nodejs", color: "#8CC84B", category: "Backend" },
  { name: ".NET", logo: "dotnet", color: "#A78BFA", category: "Backend" },
  { name: "PHP", logo: "php", color: "#A3AAE0", category: "Backend" },
  { name: "Laravel", logo: "laravel", color: "#FF2D20", category: "Backend" },
  { name: "Python", logo: "python", color: "#5A9FD4", category: "Backend" },

  { name: "Flutter", logo: "flutter", color: "#47C5FB", category: "Mobile" },
  { name: "React Native", logo: "react", color: "#61DAFB", category: "Mobile" },
  { name: "AWS", logo: "aws", color: "#FF9900", category: "Cloud & DevOps" },
  { name: "Azure", logo: "azure", color: "#3CA3F5", category: "Cloud & DevOps" },
  { name: "Docker", logo: "docker", color: "#2496ED", category: "Cloud & DevOps" },
  { name: "MySQL", logo: "mysql", color: "#7FB8E6", category: "Database & AI" },
  { name: "PostgreSQL", logo: "postgresql", color: "#8AA4F8", category: "Database & AI" },
];

const SPLIT_EASE = "cubic-bezier(0.2, 1.1, 0.35, 1)"; // Slight overshoot as each card lands
const COLLAPSE_EASE = "cubic-bezier(0.6, 0, 0.4, 1)";
const COLLAPSE_MS = 380;
const COLLAPSE_STAGGER_MS = 18;
const SPLIT_THRESHOLD = 0.25; // Share of the grid on screen before the deck splits out

function filterTech(category) {
  return category === "All"
    ? technologies
    : technologies.filter((t) => t.category === category);
}

function hexToRgba(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Where the cards gather, in grid coordinates: horizontally centred, and vertically
// centred on the part of the grid that's on screen so the deck is always in view.
// `height` keeps the stack inside a grid that is about to shrink after a filter change.
function getStackPoint(grid, height = grid.offsetHeight) {
  const rect = grid.getBoundingClientRect();
  const cardHalf = (grid.firstElementChild?.offsetHeight ?? 0) / 2;
  const visibleTop = Math.max(rect.top, 0);
  const visibleBottom = Math.min(rect.bottom, window.innerHeight);
  const centerY = (visibleTop + visibleBottom) / 2 - rect.top;
  return {
    x: rect.width / 2,
    y: Math.min(Math.max(centerY, cardHalf), Math.max(cardHalf, height - cardHalf)),
  };
}

// Height the grid will have once it shows `count` cards
function predictGridHeight(grid, count) {
  const style = getComputedStyle(grid);
  const cols = parseInt(style.getPropertyValue("--cols"), 10) || 1;
  const gap = parseFloat(style.rowGap) || 0;
  const cardHeight = grid.firstElementChild?.offsetHeight ?? 0;
  const rows = Math.ceil(count / cols);
  return rows * cardHeight + (rows - 1) * gap;
}

// Transform that moves a card from its grid slot onto the stack. Each card gets a
// slightly different tilt so the stack reads as a deck rather than one flat card.
function stackTransform(el, point, index) {
  const dx = point.x - (el.offsetLeft + el.offsetWidth / 2);
  const dy = point.y - (el.offsetTop + el.offsetHeight / 2);
  const rotate = ((index * 7) % 9) - 4;
  return `translate(${dx}px, ${dy}px) rotate(${rotate}deg) scale(0.92)`;
}

// Flips to true the first time the element scrolls into view
function useRevealOnce(ref) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return revealed;
}

export default function TechStackSection() {
  const [activeCategory, setActiveCategory] = useState("All"); // Highlighted filter
  const [shownCategory, setShownCategory] = useState("All"); // What the grid renders
  const [stacked, setStacked] = useState(true); // Cards gathered (hidden) while off screen
  const [splitKey, setSplitKey] = useState(0); // Bumped to play the split animation

  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const filterScrollRef = useRef(null);
  const filterTrackRef = useRef(null);
  const indicatorRef = useRef(null);
  const filterButtonRefs = useRef({});
  const indicatorPlacedRef = useRef(false);
  const stackedRef = useRef(true);
  const stackPointRef = useRef(null);
  const fadeInRef = useRef(false);
  const pendingCategoryRef = useRef(null);
  const collapseTimerRef = useRef(null);

  const headerRevealed = useRevealOnce(headerRef);

  const shownTech = filterTech(shownCategory);

  useEffect(() => () => clearTimeout(collapseTimerRef.current), []);

  // Slide the gold indicator under the active filter button
  useLayoutEffect(() => {
    const track = filterTrackRef.current;
    const indicator = indicatorRef.current;
    if (!track || !indicator) return;

    function place() {
      const btn = filterButtonRefs.current[activeCategory];
      if (!btn) return;
      const firstPlacement = !indicatorPlacedRef.current;
      if (firstPlacement) indicator.style.transition = "none";
      indicator.style.width = `${btn.offsetWidth}px`;
      indicator.style.height = `${btn.offsetHeight}px`;
      indicator.style.transform = `translate(${btn.offsetLeft}px, ${btn.offsetTop}px)`;
      indicator.style.opacity = "1";
      if (firstPlacement) {
        indicator.getBoundingClientRect(); // Commit the jump so later moves animate
        indicator.style.transition = "";
        indicatorPlacedRef.current = true;
      }
    }

    place();
    // Button widths change when the web font finishes loading
    const observer = new ResizeObserver(place);
    observer.observe(track);
    return () => observer.disconnect();
  }, [activeCategory]);

  // Gather the cards when the grid leaves the screen and split them out again when it
  // comes back, so the animation replays whether the page is scrolled down or back up
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          if (stackedRef.current) return;
          // A filter change may still be mid-collapse: finish it instantly
          clearTimeout(collapseTimerRef.current);
          collapseTimerRef.current = null;
          if (pendingCategoryRef.current) {
            setShownCategory(pendingCategoryRef.current);
            pendingCategoryRef.current = null;
          }
          for (const el of grid.children) el.getAnimations().forEach((a) => a.cancel());
          stackedRef.current = true;
          setStacked(true);
        } else if (stackedRef.current && entry.intersectionRatio >= SPLIT_THRESHOLD) {
          stackedRef.current = false;
          setStacked(false);
          if (prefersReducedMotion()) return;
          stackPointRef.current = getStackPoint(grid);
          fadeInRef.current = true;
          setSplitKey((key) => key + 1);
        }
      },
      { threshold: [0, SPLIT_THRESHOLD] }
    );
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  // Deal the cards out of the stack into their grid slots, first card first
  useLayoutEffect(() => {
    if (splitKey === 0) return;
    const grid = gridRef.current;
    const cards = Array.from(grid.children);
    // Safety net if the category changed again mid-collapse and the grid got shorter
    const cardHalf = (cards[0]?.offsetHeight ?? 0) / 2;
    const point = {
      x: stackPointRef.current.x,
      y: Math.min(stackPointRef.current.y, Math.max(cardHalf, grid.offsetHeight - cardHalf)),
    };

    if (fadeInRef.current) {
      grid.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, easing: "ease-out" });
      fadeInRef.current = false;
    }

    cards.forEach((el, i) => {
      el.getAnimations().forEach((a) => a.cancel());
      el.style.zIndex = String(cards.length - i); // First card sits on top of the deck
      el.animate([{ transform: stackTransform(el, point, i) }, { transform: "none" }], {
        duration: 850,
        delay: 150 + i * 55,
        easing: SPLIT_EASE,
        fill: "backwards",
      });
    });
  }, [splitKey]);

  function scrollFilterIntoView(category) {
    const scroller = filterScrollRef.current;
    const btn = filterButtonRefs.current[category];
    if (!scroller || !btn || scroller.scrollWidth <= scroller.clientWidth) return;
    const left =
      filterTrackRef.current.offsetLeft + btn.offsetLeft - (scroller.clientWidth - btn.offsetWidth) / 2;
    scroller.scrollTo({ left, behavior: "smooth" });
  }

  // Gather the current cards into one stack, swap the category, then split the new cards out
  function selectCategory(category) {
    if (category === activeCategory) return;
    setActiveCategory(category);
    scrollFilterIntoView(category);
    pendingCategoryRef.current = category;

    // A collapse is already running; it picks up the latest choice when it finishes
    if (collapseTimerRef.current) return;

    if (stackedRef.current || prefersReducedMotion()) {
      setShownCategory(category);
      pendingCategoryRef.current = null;
      return;
    }

    const grid = gridRef.current;
    const nextHeight = predictGridHeight(grid, filterTech(category).length);
    const point = getStackPoint(grid, Math.min(grid.offsetHeight, nextHeight));
    stackPointRef.current = point;
    const cards = Array.from(grid.children);

    cards.forEach((el, i) => {
      // Start from wherever the card is right now (it may still be flying out)
      const current = getComputedStyle(el).transform;
      el.getAnimations().forEach((a) => a.cancel());
      el.style.zIndex = String(cards.length - i);
      el.animate([{ transform: current }, { transform: stackTransform(el, point, i) }], {
        duration: COLLAPSE_MS,
        delay: (cards.length - 1 - i) * COLLAPSE_STAGGER_MS,
        easing: COLLAPSE_EASE,
        fill: "both",
      });
    });

    collapseTimerRef.current = setTimeout(() => {
      collapseTimerRef.current = null;
      setShownCategory(pendingCategoryRef.current);
      pendingCategoryRef.current = null;
      setSplitKey((key) => key + 1);
    }, COLLAPSE_MS + (cards.length - 1) * COLLAPSE_STAGGER_MS);
  }

  // Spotlight: every card tracks the cursor so the borders near it light up too
  function handleGridPointerMove(e) {
    if (e.pointerType !== "mouse") return;
    const cards = Array.from(gridRef.current.children, (wrap) => wrap.firstElementChild);
    const rects = cards.map((card) => card.getBoundingClientRect());
    cards.forEach((card, i) => {
      card.style.setProperty("--mx", `${e.clientX - rects[i].left}px`);
      card.style.setProperty("--my", `${e.clientY - rects[i].top}px`);
    });
  }

  function handleCardPointerMove(e) {
    if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateX(${(-y * 16).toFixed(2)}deg) rotateY(${(x * 16).toFixed(2)}deg) translateY(-4px)`;
  }

  function handleCardPointerLeave(e) {
    e.currentTarget.style.transform = "";
  }

  // Touch has no hover, so light up the tapped card for a moment instead
  function handleCardPointerDown(e) {
    if (e.pointerType === "mouse") return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    card.classList.add("is-lit");
    setTimeout(() => card.classList.remove("is-lit"), 900);
  }

  return (
    <section
      id="technologies"
      className="responsive-container"
      style={{
        padding: "clamp(60px, 8vw, 110px) 0 clamp(40px, 6vw, 80px) 0",
        position: "relative",
        zIndex: 20,
      }}
    >
      {/* Tech Stack Header & Category Filter */}
      <div ref={headerRef} className={headerRevealed ? "is-revealed" : ""}>
        <div style={{ textAlign: "center", marginBottom: "clamp(28px, 4vw, 44px)" }}>
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
              { text: "Modern Enterprise " },
              { text: "Tech Stack.", className: "gold-text-gradient" },
            ]}
          />

          <p
            className="tech-reveal"
            style={{
              fontSize: "clamp(0.9rem, 1.05vw, 1rem)",
              lineHeight: 1.6,
              color: "var(--text-muted)",
              maxWidth: "720px",
              margin: "0 auto",
              fontWeight: 400,
              "--d": "0.12s",
            }}
          >
            We select battle-tested, high-performance technologies to build secure, scalable architectures capable of supporting global enterprise traffic.
          </p>
        </div>

        {/* Category Filter (sliding gold indicator; swipeable row on mobile) */}
        <div
          ref={filterScrollRef}
          className="tech-filter-scroll tech-reveal"
          style={{ "--d": "0.24s" }}
        >
          <div
            ref={filterTrackRef}
            className="tech-filter-track"
            role="group"
            aria-label="Filter technologies by category"
          >
            <span ref={indicatorRef} className="tech-filter-indicator" aria-hidden="true" />
            {categories.map((cat) => (
              <button
                key={cat}
                ref={(el) => {
                  filterButtonRefs.current[cat] = el;
                }}
                type="button"
                aria-pressed={activeCategory === cat}
                className={`tech-filter-btn ${activeCategory === cat ? "is-active" : ""}`}
                onClick={() => selectCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tech Cards Grid */}
      <div
        ref={gridRef}
        className={`tech-grid ${stacked ? "is-stacked" : ""}`}
        style={{ marginBottom: "clamp(50px, 8vw, 100px)" }}
        onPointerMove={handleGridPointerMove}
      >
        {shownTech.map((tech) => (
          <div
            key={tech.name}
            data-name={tech.name}
            className="tech-card-wrap"
          >
            <div
              className="tech-card"
              style={{
                "--brand": tech.color,
                "--brand-soft": hexToRgba(tech.color, 0.1),
                "--brand-border": hexToRgba(tech.color, 0.28),
                "--brand-glow": hexToRgba(tech.color, 0.35),
              }}
              onPointerMove={handleCardPointerMove}
              onPointerLeave={handleCardPointerLeave}
              onPointerDown={handleCardPointerDown}
            >
              {/* Brand Logo Tile */}
              <div className="tech-logo">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={TECH_LOGO_PATHS[tech.logo]} />
                </svg>
              </div>

              {/* Tech Name */}
              <h4 className="font-heading tech-name">{tech.name}</h4>

              {/* Category Sub-label */}
              <span className="tech-cat">{tech.category}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Strategic Partnership CTA Banner */}
      <div
        style={{
          position: "relative",
          borderRadius: "24px",
          backgroundColor: "rgba(12, 12, 16, 0.9)",
          border: "1px solid rgba(212, 175, 55, 0.35)",
          boxShadow: "0 0 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(212, 175, 55, 0.12)",
          padding: "clamp(36px, 6vw, 70px) clamp(20px, 4vw, 40px)",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Floating Gold Particles (behind the content) */}
        <GoldParticles />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Top Gold Pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 18px",
              borderRadius: "9999px",
              backgroundColor: "rgba(20, 20, 26, 0.8)",
              border: "1px solid rgba(212, 175, 55, 0.4)",
              marginBottom: "20px",
            }}
          >
            <span style={{ color: "var(--gold-main)", fontSize: "12px" }}>✦</span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.18em",
                color: "var(--gold-main)",
                textTransform: "uppercase",
              }}
            >
              STRATEGIC PARTNERSHIP
            </span>
          </div>

          {/* Banner Headline */}
          <RevealHeading
            as="h3"
            className="font-heading"
            style={{
              fontSize: "clamp(1.75rem, 3.8vw, 3.4rem)",
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
              marginBottom: "14px",
            }}
            parts={[
              { text: "LET'S BUILD SOMETHING " },
              { text: "EXTRAORDINARY.", className: "gold-text-gradient" },
            ]}
          />

          {/* Banner Subtitle */}
          <p
            style={{
              fontSize: "clamp(0.9rem, 1.1vw, 1.05rem)",
              lineHeight: 1.6,
              color: "var(--text-muted)",
              maxWidth: "680px",
              margin: "0 auto clamp(24px, 4vw, 36px) auto",
              fontWeight: 400,
            }}
          >
            Have an idea, challenge or digital transformation goal? Let's turn it into a scalable technology solution.
          </p>

          {/* Banner CTA Button */}
          <a
            href="#contact"
            data-magnetic
            style={{
              padding: "clamp(10px, 1.2vw, 14px) clamp(22px, 2.5vw, 34px)",
              borderRadius: "9999px",
              fontSize: "clamp(13px, 0.95vw, 14.5px)",
              fontWeight: 800,
              color: "#0D0D0D",
              background: "var(--gradient-gold-btn)",
              border: "none",
              textDecoration: "none",
              boxShadow: "0 6px 28px rgba(212, 175, 55, 0.5)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              transition: "all 0.25s ease",
              minHeight: "44px",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 8px 36px rgba(212, 175, 55, 0.7)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 6px 28px rgba(212, 175, 55, 0.5)";
            }}
          >
            Start a Conversation →
          </a>
        </div>
      </div>
    </section>
  );
}
