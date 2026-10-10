"use client";

import { useRef } from "react";
import RevealHeading from "@/components/RevealHeading";
import { useInView } from "@/lib/useInView";

// PLACEHOLDER CONTENT: replace every project below with real work (title, client industry,
// what you built, the measurable result, the stack, and a real screenshot as `image`).
// While `sample` is true the card shows a "Sample" badge so it can't go live by accident.
const projects = [
  {
    title: "Your Flagship Project",
    category: "INDUSTRY · PLATFORM TYPE",
    desc: "Two or three lines on the client's challenge, what your team built, and the outcome it delivered.",
    result: "Key result, e.g. +40% conversions",
    tags: ["Next.js", "Node.js", "AWS"],
    image: "/cards_1/card_web.webp",
    sample: true,
  },
  {
    title: "Second Project Name",
    category: "INDUSTRY · MOBILE APP",
    desc: "Describe the problem, your solution and the measurable impact for the client.",
    result: "Key result",
    tags: ["Flutter", "Firebase"],
    image: "/cards_1/card_ai.webp",
    sample: true,
  },
  {
    title: "Third Project Name",
    category: "INDUSTRY · CLOUD",
    desc: "Describe the problem, your solution and the measurable impact for the client.",
    result: "Key result",
    tags: ["Docker", "Azure"],
    image: "/cards_1/card_cloud.webp",
    sample: true,
  },
];

// Tilt toward the cursor; CSS turns --px/--py into the tilt and the image parallax
function handleTiltMove(e) {
  if (e.pointerType !== "mouse") return;
  const card = e.currentTarget;
  const rect = card.parentElement.getBoundingClientRect();
  card.style.setProperty("--px", ((e.clientX - rect.left) / rect.width - 0.5).toFixed(3));
  card.style.setProperty("--py", ((e.clientY - rect.top) / rect.height - 0.5).toFixed(3));
}

function handleTiltLeave(e) {
  e.currentTarget.style.setProperty("--px", "0");
  e.currentTarget.style.setProperty("--py", "0");
}

export default function ProjectsSection() {
  const gridRef = useRef(null);
  const inView = useInView(gridRef, { threshold: 0.15 });

  return (
    <section
      id="projects"
      className="responsive-container"
      style={{
        padding: "clamp(60px, 8vw, 110px) 0",
        position: "relative",
        zIndex: 20,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "clamp(36px, 5vw, 60px)" }}>
        <div className="section-pill">
          <span className="section-pill-dot" />
          FEATURED WORK
        </div>
        <RevealHeading
          className="font-heading section-title"
          parts={[{ text: "Projects That " }, { text: "Speak For Us.", className: "gold-text-gradient" }]}
        />
        <p className="section-subtitle">
          A closer look at products we have designed, engineered and launched with our clients.
        </p>
      </div>

      {/* Bento grid: one feature card and two stacked cards; they rotate in from depth */}
      <div ref={gridRef} className={`projects-grid ${inView ? "is-in" : ""}`}>
        {projects.map((project, i) => (
          <div
            key={project.title}
            className={`proj-wrap ${i === 0 ? "is-feature" : ""}`}
            style={{ "--i": i, "--ry": i === 0 ? "-16deg" : "16deg" }}
          >
            <article className="proj-card" onPointerMove={handleTiltMove} onPointerLeave={handleTiltLeave}>
              <div className="proj-media">
                <img src={project.image} alt="" loading="lazy" decoding="async" className="proj-img" />
                <div className="proj-media-shade" />
                <span className="proj-result">{project.result}</span>
              </div>

              <div className="proj-body">
                {project.sample && <span className="proj-sample">Sample · replace with your project</span>}
                <div className="proj-category">{project.category}</div>
                <h3 className="font-heading proj-title">{project.title}</h3>
                <p className="proj-desc">{project.desc}</p>
                <div className="proj-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="proj-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
