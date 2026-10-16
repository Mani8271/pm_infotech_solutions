"use client";

import { useRef } from "react";
import RevealHeading from "@/components/RevealHeading";
import { useInView } from "@/lib/useInView";
import { useSwipeCarousel } from "@/lib/useSwipeCarousel";

// Real client work. `url` adds a "Visit live site" link; `imagePosition: "top"` keeps a
// website screenshot's header in view when the card crops it.
// Set `sample: true` on a placeholder card and it shows a "Sample" badge so it can't go live by accident.
const projects = [
  {
    title: "Manasho",
    category: "E-COMMERCE · DIRECT SELLING",
    desc: "Online store and entrepreneur platform: product catalogue, cart, secure checkout, member registration and a downloadable business plan.",
    result: "Live at manasho.in",
    tags: ["React", "Redux", "Node.js", "Razorpay"],
    image: "/projects/manasho.webp",
    imagePosition: "left top",
    url: "https://manasho.in",
  },
  {
    title: "SUN Distributors",
    category: "E-COMMERCE · DIRECT SELLING",
    desc: "Multi-category online store for SUN Distributors Pvt. Ltd. (garments, pharmacy, electronics, beauty care and more) with cart, online payments and a business-partner portal.",
    result: "8 product categories",
    tags: ["React", "Redux", "Node.js", "Razorpay"],
    image: "/projects/mysun.webp",
    imagePosition: "top",
    url: "https://mysun.in",
  },
  {
    title: "Hotel Marina Grand",
    category: "HOSPITALITY · HOTEL MANAGEMENT SOFTWARE",
    desc: "Front-desk software for daily hotel operations: bookings, check-in and check-out, guest records, billing and invoices, OTA commissions, maintenance and Excel reports.",
    result: "Check-in to invoice",
    tags: ["Laravel", "PHP", "MySQL"],
    image: "/cards_1/card_software.webp",
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
  const { active, scrollToIndex } = useSwipeCarousel(gridRef); // Swipe carousel on phones

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
                <img
                  src={project.image}
                  alt={project.url ? `${project.title} website` : ""}
                  loading="lazy"
                  decoding="async"
                  className="proj-img"
                  style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
                />
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
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="proj-link">
                    Visit live site <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </article>
          </div>
        ))}
      </div>

      {/* Carousel position dots (phones only) */}
      <div className="carousel-dots">
        {projects.map((project, i) => (
          <button
            key={project.title}
            type="button"
            className={`carousel-dot ${i === active ? "is-active" : ""}`}
            aria-label={`Show ${project.title}`}
            aria-current={i === active || undefined}
            onClick={() => scrollToIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
