"use client";

import { useEffect, useRef, useState } from "react";

export default function GlassShaderButton() {
  const btnRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);
  const burstParticlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0, isHovered: false, targetX: 0, targetY: 0, currentRX: 0, currentRY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const updateCanvasSize = () => {
      const btn = btnRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    updateCanvasSize();

    // Create persistent gold energy particles inside the glass capsule
    const particleCount = 18;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * 180,
        y: Math.random() * 50,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.5 + 0.2,
        baseAlpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = particles;

    let time = 0;

    const render = () => {
      time += 0.02;
      const btn = btnRef.current;
      if (!btn) return;
      const width = btn.offsetWidth;
      const height = btn.offsetHeight;

      ctx.clearRect(0, 0, width, height);

      // 1. Internal Ambient Gold Energy Stream (Horizontal light wave inside glass)
      const waveGradient = ctx.createLinearGradient(0, 0, width, height);
      const waveOffset = (Math.sin(time * 0.8) + 1) / 2;
      waveGradient.addColorStop(0, "rgba(255, 242, 178, 0.02)");
      waveGradient.addColorStop(Math.max(0, waveOffset - 0.2), "rgba(212, 175, 55, 0.04)");
      waveGradient.addColorStop(waveOffset, "rgba(255, 233, 154, 0.16)");
      waveGradient.addColorStop(Math.min(1, waveOffset + 0.2), "rgba(212, 175, 55, 0.04)");
      waveGradient.addColorStop(1, "rgba(255, 242, 178, 0.02)");

      ctx.fillStyle = waveGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Render & Update Floating Gold Energy Particles
      const isHovered = mouseRef.current.isHovered;
      const speedMult = isHovered ? 1.6 : 1.0;

      particlesRef.current.forEach((p) => {
        p.x += p.vx * speedMult;
        p.y += p.vy * speedMult;

        // Wrap particles around inside capsule bounds
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha =
          p.baseAlpha + Math.sin(time * p.pulseSpeed * 5 + p.pulseOffset) * 0.2;
        const finalAlpha = isHovered ? Math.min(1, currentAlpha * 1.4) : currentAlpha;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        // Soft gold particle glow
        ctx.shadowColor = "rgba(212, 175, 55, 0.7)";
        ctx.shadowBlur = isHovered ? 8 : 4;

        ctx.fillStyle = `rgba(255, 238, 170, ${finalAlpha})`;
        ctx.fill();
        ctx.restore();
      });

      // 3. Render Click Burst Energy Sparkles
      if (burstParticlesRef.current.length > 0) {
        burstParticlesRef.current.forEach((bp, index) => {
          bp.x += bp.vx;
          bp.y += bp.vy;
          bp.alpha -= bp.decay;
          bp.size *= 0.95;

          if (bp.alpha <= 0) {
            burstParticlesRef.current.splice(index, 1);
            return;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(bp.x, bp.y, Math.max(0.2, bp.size), 0, Math.PI * 2);
          ctx.shadowColor = "rgba(255, 220, 120, 0.9)";
          ctx.shadowBlur = 10;
          ctx.fillStyle = `rgba(255, 245, 200, ${bp.alpha})`;
          ctx.fill();
          ctx.restore();
        });
      }

      // Smooth 3D Tilt Lerp
      const mouse = mouseRef.current;
      const targetRX = mouse.isHovered ? mouse.targetRX : 0;
      const targetRY = mouse.isHovered ? mouse.targetRY : 0;

      mouse.currentRX += (targetRX - mouse.currentRX) * 0.12;
      mouse.currentRY += (targetRY - mouse.currentRY) * 0.12;

      if (btn) {
        if (Math.abs(mouse.currentRX) > 0.01 || Math.abs(mouse.currentRY) > 0.01 || mouse.isHovered) {
          btn.style.transform = `perspective(600px) rotateX(${mouse.currentRX.toFixed(2)}deg) rotateY(${mouse.currentRY.toFixed(2)}deg) scale(${mouse.isHovered ? 1.025 : 1})`;
        } else {
          btn.style.transform = "none";
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    btn.style.setProperty("--mouse-x", `${x}px`);
    btn.style.setProperty("--mouse-y", `${y}px`);

    // 3D Tilt Calculation (Max rotateX: 2deg, rotateY: 3deg)
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;

    mouseRef.current.targetRX = -normY * 4; // rotateX
    mouseRef.current.targetRY = normX * 6;  // rotateY
    mouseRef.current.isHovered = true;
  };

  const handleMouseEnter = () => {
    mouseRef.current.isHovered = true;
  };

  const handleMouseLeave = () => {
    mouseRef.current.isHovered = false;
    mouseRef.current.targetRX = 0;
    mouseRef.current.targetRY = 0;
  };

  const handleClick = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Spawn 22 Gold Activation Sparkles from Click Position
    const newBurst = [];
    for (let i = 0; i < 22; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3.5 + 1.2;
      newBurst.push({
        x: clickX,
        y: clickY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3.2 + 1.5,
        alpha: 1.0,
        decay: Math.random() * 0.04 + 0.02,
      });
    }
    burstParticlesRef.current = newBurst;

    // Activation Ripple Pulse
    btn.classList.add("glass-btn-active-pulse");
    setTimeout(() => {
      btn.classList.remove("glass-btn-active-pulse");
    }, 600);
  };

  return (
    <a
      ref={btnRef}
      href="#services"
      className="hero-btn-1 glass-shader-btn"
      data-magnetic
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* 1. Internal Gold Energy Shader Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          borderRadius: "inherit",
          zIndex: 1,
        }}
      />

      {/* 2. Cursor Spotlight Layer */}
      <div className="glass-spotlight" />

      {/* 3. Luminous Gold Border Pulse */}
      <div className="glass-border-pulse" />

      {/* 4. Button Foreground Content (Text & Animated Arrow) */}
      <span
        className="glass-btn-content"
        style={{
          position: "relative",
          zIndex: 4,
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          color: "#FFFFFF",
          fontWeight: 800,
          letterSpacing: "-0.01em",
          textShadow: "0 2px 8px rgba(0, 0, 0, 0.8)",
        }}
      >
        <span>Explore Our Services</span>
        <span className="glass-btn-arrow">→</span>
      </span>
    </a>
  );
}
