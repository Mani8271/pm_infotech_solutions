"use client";

import { useRef } from "react";
import { useInView } from "@/lib/useInView";

// A heading whose words rise one after another from behind a mask each time it scrolls into
// view. `parts` splits the heading so a part can carry a class, e.g. the gold gradient:
//   parts={[{ text: "Engineered For " }, { text: "Maximum Impact.", className: "gold-text-gradient" }]}
export default function RevealHeading({ as: Tag = "h2", parts, className = "", style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.6 });
  let wordIndex = 0;

  return (
    <Tag
      ref={ref}
      className={`reveal-heading ${inView ? "is-in" : ""} ${className}`}
      style={style}
      aria-label={parts.map((part) => part.text).join("")}
    >
      {parts.map((part, p) =>
        part.text.split(/(\s+)/).map((chunk, c) => {
          if (!chunk) return null;
          if (/^\s+$/.test(chunk)) return " ";
          const i = wordIndex++;
          return (
            <span key={`${p}-${c}`} className="rh-mask" aria-hidden="true">
              <span className={`rh-word ${part.className ?? ""}`} style={{ "--i": i }}>
                {chunk}
              </span>
            </span>
          );
        })
      )}
    </Tag>
  );
}
