import { useEffect, useState } from "react";

const MOBILE_QUERY = "(max-width: 767px)";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// One-time sideways nudge of every slide so visitors see the row can be swiped.
// It moves the slides with `translate`, so it never clashes with their own transforms.
export function playSwipeHint(track) {
  if (prefersReducedMotion() || track.scrollLeft > 4) return; // Already swiped
  for (const slide of track.children) {
    slide.animate(
      [{ translate: "0 0" }, { translate: "-56px 0", offset: 0.4 }, { translate: "0 0" }],
      { duration: 1100, easing: "cubic-bezier(0.45, 0, 0.2, 1)" }
    );
  }
}

// Plays the swipe hint the first time `track` is mostly on screen (mobile only)
export function useSwipeHint(trackRef, enabled) {
  useEffect(() => {
    const track = trackRef.current;
    if (!enabled || !track) return;
    let timer;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timer = setTimeout(() => playSwipeHint(track), 900);
      },
      { threshold: 0.6 }
    );
    observer.observe(track);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [trackRef, enabled]);
}

// Turns a grid into a phone swipe carousel helper: reports which slide is centred (for the
// dots), sets --s/--op on each slide so side slides shrink and fade, and plays the swipe hint.
// The carousel layout itself (scroll-snap row) lives in CSS under the same 767px breakpoint.
export function useSwipeCarousel(trackRef) {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.children);

    if (!enabled) {
      slides.forEach((slide) => {
        slide.style.removeProperty("--s");
        slide.style.removeProperty("--op");
      });
      return;
    }

    let frame = null;
    function update() {
      frame = null;
      const center = track.scrollLeft + track.clientWidth / 2;
      let closest = 0;
      let closestDistance = Infinity;
      slides.forEach((slide, i) => {
        const distance = slide.offsetLeft + slide.offsetWidth / 2 - center;
        const strength = Math.min(1, Math.abs(distance) / slide.offsetWidth);
        slide.style.setProperty("--s", (1 - strength * 0.07).toFixed(3));
        slide.style.setProperty("--op", (1 - strength * 0.45).toFixed(3));
        if (Math.abs(distance) < closestDistance) {
          closestDistance = Math.abs(distance);
          closest = i;
        }
      });
      setActive(closest);
    }

    function schedule() {
      if (frame === null) frame = requestAnimationFrame(update);
    }

    update();
    track.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      track.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [trackRef, enabled]);

  useSwipeHint(trackRef, enabled);

  function scrollToIndex(index) {
    const track = trackRef.current;
    const slide = track?.children[index];
    if (!slide) return;
    track.scrollTo({ left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2, behavior: "smooth" });
  }

  return { enabled, active, scrollToIndex };
}
