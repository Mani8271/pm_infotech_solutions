"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, [role='button'], select, label, .svc-tilt, .tech-card, .sol-card, .proj-card";
const TEXT_FIELDS = "input, textarea";

// Desktop-only custom cursor: a gold dot that tracks the mouse exactly and a ring that
// trails it, growing over anything clickable. Touch devices keep the normal cursor.
export default function GoldCursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    const root = document.documentElement;

    // Only with a real mouse. This is re-checked when the device changes (for example
    // DevTools switching to phone mode), so the ring never sticks around on touch screens.
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    function syncPointerType() {
      if (finePointer.matches) {
        root.classList.add("has-gold-cursor");
      } else {
        root.classList.remove("has-gold-cursor", "cursor-visible", "cursor-hover", "cursor-text", "cursor-down");
      }
    }
    syncPointerType();
    finePointer.addEventListener("change", syncPointerType);

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let frame = null;

    function tick() {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      const settled = Math.abs(mouseX - ringX) < 0.1 && Math.abs(mouseY - ringY) < 0.1;
      frame = settled ? null : requestAnimationFrame(tick);
    }

    function onMove(e) {
      if (e.pointerType !== "mouse" || !finePointer.matches) {
        root.classList.remove("cursor-visible");
        return;
      }
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      root.classList.add("cursor-visible");
      root.classList.toggle("cursor-hover", Boolean(e.target.closest?.(INTERACTIVE)));
      root.classList.toggle("cursor-text", Boolean(e.target.closest?.(TEXT_FIELDS)));
      if (frame === null) frame = requestAnimationFrame(tick);
    }

    const onDown = () => root.classList.add("cursor-down");
    const onUp = () => root.classList.remove("cursor-down");
    const onLeave = () => root.classList.remove("cursor-visible");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      finePointer.removeEventListener("change", syncPointerType);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      if (frame !== null) cancelAnimationFrame(frame);
      root.classList.remove("has-gold-cursor", "cursor-visible", "cursor-hover", "cursor-text", "cursor-down");
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
