"use client";

import { useEffect } from "react";

const PULL_X = 0.3; // Share of the cursor's distance from the centre the element follows
const PULL_Y = 0.35;
const REACH = 40; // How far outside the element (px) the pull starts

// Makes every element marked `data-magnetic` lean toward a nearby cursor. It moves them with
// the `translate` property, so it never clashes with transforms the elements already use.
export default function MagneticButtons() {
  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion) return;

    const offsets = new Map(); // element -> { x, y, targetX, targetY }
    let pointerX = -1000;
    let pointerY = -1000;
    let frame = null;

    function updateTargets() {
      for (const el of document.querySelectorAll("[data-magnetic]")) {
        const rect = el.getBoundingClientRect();
        const dx = pointerX - (rect.left + rect.width / 2);
        const dy = pointerY - (rect.top + rect.height / 2);
        const inRange = Math.abs(dx) < rect.width / 2 + REACH && Math.abs(dy) < rect.height / 2 + REACH;
        const offset = offsets.get(el) ?? { x: 0, y: 0, targetX: 0, targetY: 0 };
        offset.targetX = inRange ? dx * PULL_X : 0;
        offset.targetY = inRange ? dy * PULL_Y : 0;
        offsets.set(el, offset);
      }
      if (frame === null) frame = requestAnimationFrame(tick);
    }

    function tick() {
      frame = null;
      let moving = false;
      offsets.forEach((offset, el) => {
        offset.x += (offset.targetX - offset.x) * 0.18;
        offset.y += (offset.targetY - offset.y) * 0.18;
        if (Math.abs(offset.targetX - offset.x) > 0.05 || Math.abs(offset.targetY - offset.y) > 0.05) {
          moving = true;
        } else {
          offset.x = offset.targetX;
          offset.y = offset.targetY;
        }
        el.style.translate = offset.x || offset.y ? `${offset.x.toFixed(2)}px ${offset.y.toFixed(2)}px` : "";
      });
      if (moving) frame = requestAnimationFrame(tick);
    }

    function onMove(e) {
      if (e.pointerType !== "mouse") return;
      pointerX = e.clientX;
      pointerY = e.clientY;
      updateTargets();
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", updateTargets, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", updateTargets);
      if (frame !== null) cancelAnimationFrame(frame);
      offsets.forEach((_, el) => (el.style.translate = ""));
    };
  }, []);

  return null;
}
