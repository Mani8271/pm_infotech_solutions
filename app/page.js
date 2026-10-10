"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import GlassShaderButton from "@/components/GlassShaderButton";
import StatsSection from "@/components/StatsSection";
import ServicesSection from "@/components/ServicesSection";
import SolutionsSection from "@/components/SolutionsSection";
import ProcessSection from "@/components/ProcessSection";
import ProjectsSection from "@/components/ProjectsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import TechStackSection from "@/components/TechStackSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import GoldCursor from "@/components/GoldCursor";
import MagneticButtons from "@/components/MagneticButtons";
import MobileCtaBar from "@/components/MobileCtaBar";

const TOTAL_FRAMES = 240;
const HERO_SCROLL_HEIGHT = 2200; // Height of the scroll track that scrubs through the frames
const PRELOAD_STEP = 8; // Preloader only waits for every 8th frame; the rest stream in afterwards
const LOAD_CONCURRENCY = 6;
const PHONE_MAX_WIDTH = 767; // Matches the phone breakpoint in globals.css

function getFrameSrc(index) {
  const paddedIndex = String(index).padStart(3, "0");
  return `/frames/ezgif-frame-${paddedIndex}.webp`;
}

// Coarse-to-fine load order: first + last frame, then every 32nd, 16th, 8th ... frame.
// The whole scroll range becomes scrubbable early and gets smoother as frames arrive.
function buildLoadOrder() {
  const order = [1, TOTAL_FRAMES];
  const queued = new Set(order);
  let readyCount = 0;
  for (let step = 32; step >= 1; step /= 2) {
    for (let i = 1; i <= TOTAL_FRAMES; i += step) {
      if (!queued.has(i)) {
        queued.add(i);
        order.push(i);
      }
    }
    if (step === PRELOAD_STEP) readyCount = order.length;
  }
  return { order, readyCount };
}

export default function Home() {
  const canvasRef = useRef(null);
  const heroContentRef = useRef(null); // Phones draw the laptop below this text block
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [animated, setAnimated] = useState(false);

  const targetFrameRef = useRef(1);
  const currentFrameRef = useRef(1);
  const animFrameIdRef = useRef(null);

  // Disable default browser scroll restoration on refresh and force top scroll
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);

      // Clean URL hash if any on initial refresh
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        setAnimated(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });

    // 1-indexed by frame number
    const frames = new Array(TOTAL_FRAMES + 1);
    const loaded = new Array(TOTAL_FRAMES + 1).fill(false);
    let drawnFrame = 0;
    let cancelled = false;

    function drawImageProp(img) {
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const cWidth = canvas.width;
      const cHeight = canvas.height;

      // Pitch-black canvas clear
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, cWidth, cHeight);

      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      const imgRatio = imgWidth / imgHeight;

      let renderW, renderH, renderX, renderY;
      let fadeTopEdge = false;

      if (window.innerWidth > 1024) {
        // Desktop: Scaled down & positioned on the right side
        renderH = cHeight * 0.85;
        renderW = renderH * imgRatio;
        renderX = cWidth - renderW + 50;
        renderY = (cHeight - renderH) / 2;
      } else if (window.innerWidth <= PHONE_MAX_WIDTH) {
        // Phones: the text sits at the top of the screen, so the laptop plays in the space
        // below it, zoomed in so the laptop in the middle of the frame fills the width
        const cssToCanvas = cHeight / canvas.clientHeight;
        const content = heroContentRef.current;
        const textBottom = content
          ? (content.getBoundingClientRect().bottom - canvas.getBoundingClientRect().top + 12) * cssToCanvas
          : cHeight * 0.55;
        const space = cHeight - textBottom;
        renderW = cWidth * 1.7;
        renderH = renderW / imgRatio;
        if (renderH > space) {
          // Short screens: shrink to fit, but keep the laptop a decent size
          renderH = Math.max(space, cHeight * 0.34);
          renderW = renderH * imgRatio;
        }
        renderX = (cWidth - renderW) / 2;
        renderY = cHeight - renderH;
        fadeTopEdge = true;
      } else {
        // Mobile / Tablet: Centered cover
        const containerRatio = cWidth / cHeight;
        if (containerRatio > imgRatio) {
          renderW = cWidth;
          renderH = cWidth / imgRatio;
          renderX = 0;
          renderY = (cHeight - renderH) / 2;
        } else {
          renderH = cHeight;
          renderW = cHeight * imgRatio;
          renderX = (cWidth - renderW) / 2;
          renderY = 0;
        }
      }

      // Fast GPU rasterization without expensive bicubic resampling overhead during scroll
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "medium";
      ctx.drawImage(img, renderX, renderY, renderW, renderH);

      if (fadeTopEdge) {
        // Melt the top edge of the frame into the black so there's no hard line under the text
        const fadeHeight = renderH * 0.35;
        const fade = ctx.createLinearGradient(0, renderY, 0, renderY + fadeHeight);
        fade.addColorStop(0, "rgba(0, 0, 0, 1)");
        fade.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = fade;
        ctx.fillRect(0, renderY, cWidth, fadeHeight);
      }
    }

    // Frames stream in out of order, so fall back to the closest frame that has loaded
    function findNearestLoaded(idx) {
      for (let d = 0; d < TOTAL_FRAMES; d++) {
        if (idx - d >= 1 && loaded[idx - d]) return idx - d;
        if (idx + d <= TOTAL_FRAMES && loaded[idx + d]) return idx + d;
      }
      return 0;
    }

    function renderFrame(frameIdx, force = false) {
      const clampedIdx = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(frameIdx)));
      const nearest = findNearestLoaded(clampedIdx);
      if (!nearest || (nearest === drawnFrame && !force)) return;
      drawImageProp(frames[nearest]);
      drawnFrame = nearest;
    }

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      // Resizing clears the canvas, so always redraw
      renderFrame(currentFrameRef.current, true);
    }

    // Load frames a few at a time in coarse-to-fine order. The preloader is
    // dismissed once the first `readyCount` frames in that order have settled.
    const { order, readyCount } = buildLoadOrder();
    let nextToLoad = 0;
    let readySettled = 0;

    function loadNext() {
      if (cancelled || nextToLoad >= order.length) return;
      const position = nextToLoad++;
      const frameIdx = order[position];
      const img = new Image();
      frames[frameIdx] = img;
      img.src = getFrameSrc(frameIdx);

      // decode() settles once the image is ready to draw without a main-thread stall.
      // It can reject even for a drawable image, so check naturalWidth instead.
      img
        .decode()
        .catch(() => {})
        .then(() => {
          if (cancelled) return;
          if (img.naturalWidth > 0) {
            loaded[frameIdx] = true;
            renderFrame(currentFrameRef.current);
          }
          if (position < readyCount) {
            readySettled++;
            setLoadProgress(Math.floor((readySettled / readyCount) * 100));
            if (readySettled === readyCount) setIsLoaded(true);
          }
          loadNext();
        });
    }

    for (let i = 0; i < LOAD_CONCURRENCY; i++) loadNext();

    function animate() {
      const delta = targetFrameRef.current - currentFrameRef.current;
      const absDelta = Math.abs(delta);

      if (absDelta > 0.001) {
        // Dynamic adaptive lerp speed: faster catch-up during rapid scrolling
        const lerpFactor = absDelta > 12 ? 0.55 : absDelta > 3 ? 0.32 : 0.20;
        currentFrameRef.current += delta * lerpFactor;
        renderFrame(currentFrameRef.current);
        animFrameIdRef.current = requestAnimationFrame(animate);
      } else {
        // Caught up: draw the exact frame and stop until the next scroll
        currentFrameRef.current = targetFrameRef.current;
        renderFrame(currentFrameRef.current);
        animFrameIdRef.current = null;
      }
    }

    function handleScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const heroHeight = HERO_SCROLL_HEIGHT - window.innerHeight;
      if (heroHeight <= 0) return;

      const fraction = Math.max(0, Math.min(1, scrollTop / heroHeight));
      targetFrameRef.current = 1 + fraction * (TOTAL_FRAMES - 1);
      if (animFrameIdRef.current === null) {
        animFrameIdRef.current = requestAnimationFrame(animate);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", resizeCanvas);

    resizeCanvas();
    handleScroll();
    // On phones the laptop sits under the text, whose height changes once the web fonts load
    document.fonts?.ready.then(() => {
      if (!cancelled) renderFrame(currentFrameRef.current, true);
    });

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", resizeCanvas);
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#000000",
        position: "relative",
        // Clip anything animating in from off-screen (e.g. the waiting testimonial cards) so
        // phones never see a wider page and zoom out. `clip` keeps the sticky hero working.
        overflowX: "clip",
      }}
    >
      {/* Site-wide effects: smooth scrolling, progress line, gold cursor, magnetic buttons, film grain */}
      <SmoothScroll />
      <ScrollProgress />
      <GoldCursor />
      <MagneticButtons />
      <div className="film-grain" aria-hidden="true" />

      {/* Ambient Metallic Glows */}
      <div className="ambient-glow-top" />
      <div className="ambient-glow-left" />

      {/* Navbar */}
      <Navbar />

      {/* Preloader */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#000000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          transition: "opacity 0.4s ease, visibility 0.4s ease",
          opacity: isLoaded ? 0 : 1,
          visibility: isLoaded ? "hidden" : "visible",
          pointerEvents: isLoaded ? "none" : "auto",
        }}
      >
        <div
          style={{
            width: "220px",
            height: "4px",
            backgroundColor: "rgba(255, 255, 255, 0.12)",
            borderRadius: "4px",
            overflow: "hidden",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              width: `${loadProgress}%`,
              height: "100%",
              background: "var(--gradient-gold-btn)",
              transition: "width 0.15s ease-out",
              borderRadius: "4px",
            }}
          />
        </div>
        <div
          style={{
            color: "var(--text-muted)",
            fontSize: "13px",
            letterSpacing: "0.05em",
            fontWeight: 500,
          }}
        >
          Loading {loadProgress}%
        </div>
      </div>

      {/* Hero 3D Sequence Container (scroll track that scrubs the frames) */}
      <div id="home" style={{ height: `${HERO_SCROLL_HEIGHT}px`, width: "100%", position: "relative" }}>
        {/* Sticky viewport: pinned while the track scrubs the frames, then scrolls
            away with the page so the next section follows directly behind it */}
        <div
          style={{
            position: "sticky",
            top: 0,
            width: "100%",
            height: "100vh",
            overflow: "hidden",
            backgroundColor: "#000000",
            zIndex: 1,
          }}
        >
          {/* Canvas (Layer 0) */}
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              inset: 0,
              display: "block",
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          />

          {/* Layer 1: Dark Cinematic Overlay & Warm Gold Radial Glow */}
          <div
            className="hero-overlay"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 1,
              background: `
                linear-gradient(180deg, rgba(0,0,0,.38) 0%, rgba(0,0,0,.18) 35%, rgba(0,0,0,.62) 100%),
                radial-gradient(circle at 72% 18%, rgba(210,170,55,.14), transparent 38%)
              `,
            }}
          />

          {/* Clean Hero Section Main Content Overlay (Layer 3) */}
          <div
            className="hero-layer"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 3,
              display: "flex",
              alignItems: "center",
              padding: "0 clamp(16px, 5vw, 80px)",
            }}
          >
            <div
              ref={heroContentRef}
              className={`hero-content-left ${animated ? "is-active" : ""}`}
              style={{
                maxWidth: "min(100%, 720px)",
                pointerEvents: "auto",
                width: "100%",
              }}
            >
              {/* Main Headline */}
              <h1
                className="hero-main-title font-heading"
                style={{
                  fontSize: "clamp(1.75rem, 3.5vw, 2.9rem)",
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  color: "#FFFFFF",
                  marginBottom: "clamp(12px, 2.5vh, 20px)",
                  textShadow: "0 8px 30px rgba(0, 0, 0, 0.95)",
                }}
              >
                <span className="hero-line-mask">
                  <span className="hero-line-inner hero-line-1">BUILDING DIGITAL</span>
                </span>
                <span className="hero-line-mask">
                  <span className="hero-line-inner hero-line-2">
                    <span className="gold-text-sweep">EXPERIENCES THAT MOVE</span>
                  </span>
                </span>
                <span className="hero-line-mask">
                  <span className="hero-line-inner hero-line-3">
                    <span className="silver-text-gradient">BUSINESS</span> FORWARD.
                  </span>
                </span>
              </h1>

              {/* Subtitle Description */}
              <p
                className="hero-desc-reveal"
                style={{
                  fontSize: "clamp(0.88rem, 1.1vw, 1.05rem)",
                  lineHeight: 1.6,
                  color: "var(--text-muted)",
                  fontWeight: 400,
                  maxWidth: "520px",
                  marginBottom: "clamp(20px, 3vh, 32px)",
                  textShadow: "0 4px 15px rgba(0, 0, 0, 0.95)",
                }}
              >
                We design and engineer powerful digital products, intelligent software solutions and scalable experiences for ambitious businesses worldwide.
              </p>

              {/* Hero Action Buttons */}
              <div
                className="hero-actions"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(10px, 1.5vw, 14px)",
                  flexWrap: "wrap",
                }}
              >
                <GlassShaderButton />

                <a
                  href="#contact"
                  className="hero-btn-2"
                  data-magnetic
                  style={{
                    padding: "clamp(10px, 1.2vw, 12px) clamp(18px, 2vw, 24px)",
                    borderRadius: "var(--border-radius-full)",
                    fontSize: "clamp(12px, 0.9vw, 13.5px)",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    backgroundColor: "rgba(18, 18, 18, 0.7)",
                    border: "1px solid rgba(216, 216, 216, 0.3)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    textDecoration: "none",
                    transition: "all var(--transition-fast)",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    minHeight: "44px",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(18, 18, 18, 0.95)";
                    e.currentTarget.style.borderColor = "var(--border-gold)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(18, 18, 18, 0.7)";
                    e.currentTarget.style.borderColor = "rgba(216, 216, 216, 0.3)";
                  }}
                >
                  &lt;/&gt; Let's Build Together
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subsequent Web Agency Sections */}
      <StatsSection />
      <ServicesSection />
      <ProcessSection />
      <ProjectsSection />
      <SolutionsSection />
      <TestimonialsSection />
      <TechStackSection />
      <ContactSection />
      <Footer />

      {/* Phones only: sticky "Let's Talk" bar */}
      <MobileCtaBar />
    </div>
  );
}
