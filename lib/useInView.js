import { useEffect, useState } from "react";

// Tracks whether an element is on screen. It turns true once `threshold` of the element is
// visible, and back to false only after the element has fully left the viewport, so
// entrance animations replay on every visit. With `once`, it stays true after the first time.
export function useInView(ref, { threshold = 0.2, once = false } = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!entry.isIntersecting) {
          setInView(false);
        }
      },
      { threshold: [0, threshold] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold, once]);

  return inView;
}
