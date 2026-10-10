"use client";

import { useEffect, useRef } from "react";

// Faint gold dust drifting upward. Fills its nearest positioned ancestor, so give
// the parent `position: relative` and put the content above it with a z-index.
export default function GoldParticles({ density = 0.00006, minParticles = 14, maxParticles = 70 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Soft glow dot rendered once and stamped for every particle (much cheaper than shadowBlur)
    const sprite = document.createElement("canvas");
    sprite.width = 32;
    sprite.height = 32;
    const spriteCtx = sprite.getContext("2d");
    const glow = spriteCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    glow.addColorStop(0, "rgba(255, 242, 190, 1)");
    glow.addColorStop(0.25, "rgba(240, 200, 90, 0.8)");
    glow.addColorStop(1, "rgba(212, 175, 55, 0)");
    spriteCtx.fillStyle = glow;
    spriteCtx.fillRect(0, 0, 32, 32);

    let width = 0;
    let height = 0;
    let particles = [];
    let frameId = null;

    function createParticle(anywhere) {
      return {
        x: Math.random() * width,
        y: anywhere ? Math.random() * height : height + 8,
        size: Math.random() * 7 + 3,
        speed: Math.random() * 0.22 + 0.06,
        sway: Math.random() * 12 + 4,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.012 + 0.004,
        alpha: Math.random() * 0.45 + 0.2,
      };
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        // Fade in near the bottom edge and out near the top
        const edgeFade = Math.min(1, p.y / 60, (height - p.y) / 60);
        const twinkle = 0.7 + 0.3 * Math.sin(p.phase * 3);
        ctx.globalAlpha = Math.max(0, p.alpha * edgeFade * twinkle);
        const x = p.x + Math.sin(p.phase) * p.sway;
        ctx.drawImage(sprite, x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
      ctx.globalAlpha = 1;
    }

    function step() {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speed;
        p.phase += p.phaseSpeed;
        if (p.y < -8) particles[i] = createParticle(false);
      }
      draw();
      frameId = requestAnimationFrame(step);
    }

    function start() {
      if (frameId === null && !reduceMotion) frameId = requestAnimationFrame(step);
    }

    function stop() {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(maxParticles, Math.max(minParticles, Math.round(width * height * density)));
      particles = Array.from({ length: count }, () => createParticle(true));
      draw();
    }

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // Only animate while the canvas is on screen
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    visibilityObserver.observe(canvas);

    return () => {
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [density, minParticles, maxParticles]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
