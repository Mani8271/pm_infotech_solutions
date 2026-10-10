"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis, scrollToTarget } from "@/lib/smoothScroll";

const NAV_OFFSET = -16; // Land a little above each section so its heading clears the navbar

// Inertia ("buttery") wheel scrolling for the whole page. Touch keeps native scrolling.
export default function SmoothScroll() {
  useEffect(() => {
    let lenis = null;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      lenis = new Lenis({ autoRaf: true, lerp: 0.1 });
      setLenis(lenis);
    }

    // In-page links ("#services", "#contact", ...) glide to their section instead of jumping
    function onClick(e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute("href");
      if (hash.length < 2) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target, { offset: NAV_OFFSET });
    }
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
