// Holds the page's Lenis instance (set by <SmoothScroll />) so any component can scroll smoothly.
let lenis = null;

export function setLenis(instance) {
  lenis = instance;
}

// Freezes page scrolling, e.g. while the full-screen mobile menu is open
export function setScrollLocked(locked) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

// Smooth-scrolls to a y position, a "#id" selector or an element. Falls back to native
// smooth scrolling when Lenis is off (for example with reduced motion).
export function scrollToTarget(target, options = {}) {
  if (lenis) {
    lenis.scrollTo(target, options);
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: "smooth" });
}
