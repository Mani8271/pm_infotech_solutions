"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Solutions", href: "#solutions" },
  { name: "Technologies", href: "#technologies" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");

  const navRef = useRef(null);
  const indicatorRef = useRef(null);
  const linkRefs = useRef({});
  const indicatorPlacedRef = useRef(false);

  // Scroll spy: the active link is the last section whose top has passed 40% of the screen
  useEffect(() => {
    let frame = null;

    function update() {
      frame = null;
      setScrolled(window.scrollY > 30);
      const line = window.innerHeight * 0.4;
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      let current = navLinks[0].name;
      for (const link of navLinks) {
        const section = document.getElementById(link.href.slice(1));
        if (section && section.getBoundingClientRect().top <= line) current = link.name;
      }
      setActiveLink(atBottom ? navLinks[navLinks.length - 1].name : current);
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

  // Slide the glass pill under the active link
  useLayoutEffect(() => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator) return;

    function place() {
      const link = linkRefs.current[activeLink];
      if (!link || !link.offsetWidth) return; // Hidden on mobile
      const firstPlacement = !indicatorPlacedRef.current;
      if (firstPlacement) indicator.style.transition = "none";
      indicator.style.width = `${link.offsetWidth}px`;
      indicator.style.height = `${link.offsetHeight}px`;
      indicator.style.transform = `translate(${link.offsetLeft}px, ${link.offsetTop}px)`;
      indicator.style.opacity = "1";
      if (firstPlacement) {
        indicator.getBoundingClientRect(); // Commit the jump so later moves animate
        indicator.style.transition = "";
        indicatorPlacedRef.current = true;
      }
    }

    place();
    // Link widths change when the web font finishes loading
    const observer = new ResizeObserver(place);
    observer.observe(nav);
    return () => observer.disconnect();
  }, [activeLink]);

  return (
    <header
      style={{
        position: "fixed",
        top: "clamp(12px, 2vh, 24px)",
        left: 0,
        right: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 clamp(12px, 2vw, 24px)",
        pointerEvents: "none",
      }}
    >
      <div
        className={scrolled ? "reference-glass-navbar-scrolled" : "reference-glass-navbar"}
        style={{
          width: "min(100% - 32px, 1360px)",
          height: "clamp(56px, 7vh, 64px)",
          borderRadius: "9999px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px clamp(10px, 1.8vw, 22px)",
          position: "relative",
          pointerEvents: "auto",
          transition: "all 300ms ease",
        }}
      >
        {/* Brand Logo & Title */}
        <a
          href="#home"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(8px, 1vw, 12px)",
            textDecoration: "none",
            zIndex: 4,
            minWidth: 0,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "clamp(32px, 3vw, 40px)",
              height: "clamp(32px, 3vw, 40px)",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid var(--gold-main)",
              boxShadow: "0 0 18px var(--gold-glow)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#0D0D0D",
              flexShrink: 0,
            }}
          >
            <img
              src="/company_logo.jpeg"
              alt="PM Infotech Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              className="font-heading"
              style={{
                fontSize: "clamp(13px, 1.2vw, 16px)",
                fontWeight: 800,
                letterSpacing: "0.02em",
                lineHeight: 1.1,
                whiteSpace: "nowrap",
              }}
            >
              <span className="gold-text-gradient">P</span>
              <span className="silver-text-gradient">M</span>{" "}
              <span className="gold-text-gradient">INFOTECH</span>
            </span>
            <span
              className="silver-text-gradient"
              style={{
                fontSize: "clamp(7.5px, 0.7vw, 9px)",
                fontWeight: 700,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              SOLUTIONS
            </span>
          </div>
        </a>

        {/* Center Desktop Navigation Links (glass pill follows the section in view) */}
        <nav ref={navRef} className="desktop-nav nav-links" style={{ zIndex: 4 }}>
          <span ref={indicatorRef} className="nav-indicator" aria-hidden="true" />
          {navLinks.map((link) => (
            <a
              key={link.name}
              ref={(el) => {
                linkRefs.current[link.name] = el;
              }}
              href={link.href}
              className={`nav-link ${activeLink === link.name ? "is-active" : ""}`}
              aria-current={activeLink === link.name ? "true" : undefined}
              onClick={() => setActiveLink(link.name)}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right Action Button ("Let's Talk →") */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", zIndex: 4, flexShrink: 0 }}>
          <a
            href="#contact"
            data-magnetic
            style={{
              padding: "8px clamp(14px, 1.5vw, 22px)",
              borderRadius: "9999px",
              fontSize: "clamp(11.5px, 0.85vw, 13.5px)",
              fontWeight: 800,
              color: "#0D0D0D",
              background: "linear-gradient(135deg, #FFE99A, #D8A91E)",
              border: "none",
              textDecoration: "none",
              boxShadow:
                "inset 0 1px 0 rgba(255, 255, 255, 0.45), 0 5px 18px rgba(218, 174, 62, 0.18)",
              transition: "all 300ms ease",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              whiteSpace: "nowrap",
              minHeight: "40px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px) scale(1.02)";
              e.currentTarget.style.boxShadow =
                "inset 0 1px 0 rgba(255, 255, 255, 0.65), 0 8px 24px rgba(218, 174, 62, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow =
                "inset 0 1px 0 rgba(255, 255, 255, 0.45), 0 5px 18px rgba(218, 174, 62, 0.18)";
            }}
          >
            Let's Talk →
          </a>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-main)",
              cursor: "pointer",
              padding: "8px",
              display: "none",
              minWidth: "44px",
              minHeight: "44px",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Toggle Navigation"
            aria-expanded={mobileMenuOpen}
            className="mobile-toggle"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Glass Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className="reference-glass-navbar-scrolled"
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            left: "clamp(12px, 3vw, 24px)",
            right: "clamp(12px, 3vw, 24px)",
            borderRadius: "20px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            pointerEvents: "auto",
            zIndex: 99999,
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => {
                setActiveLink(link.name);
                setMobileMenuOpen(false);
              }}
              style={{
                padding: "12px 18px",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: 600,
                color: "var(--text-main)",
                textDecoration: "none",
                backgroundColor:
                  activeLink === link.name ? "rgba(255, 255, 255, 0.18)" : "transparent",
                minHeight: "44px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
