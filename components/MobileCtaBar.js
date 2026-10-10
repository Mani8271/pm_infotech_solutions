"use client";

import { useEffect, useState } from "react";

// Phones only (hidden by CSS on wider screens): a slim gold "Let's Talk" bar pinned to the
// bottom of the screen. It appears once the hero is behind you and steps aside when the
// contact form is on screen or the full-screen menu is open.
export default function MobileCtaBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = null;

    function update() {
      frame = null;
      const hero = document.getElementById("home");
      const contact = document.getElementById("contact");
      const pastHero = hero ? hero.getBoundingClientRect().bottom < window.innerHeight * 0.5 : true;
      const atContact = contact ? contact.getBoundingClientRect().top < window.innerHeight * 0.8 : false;
      const menuOpen = Boolean(document.querySelector(".mobile-menu.is-open"));
      setVisible(pastHero && !atContact && !menuOpen);
    }

    function schedule() {
      if (frame === null) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // The menu opens without scrolling, so also re-check whenever the page is tapped
    document.addEventListener("click", schedule);
    // iOS only applies :active (used for the tap feedback styles) when a touch listener exists
    const enableActiveStyles = () => {};
    document.addEventListener("touchstart", enableActiveStyles, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("click", schedule);
      document.removeEventListener("touchstart", enableActiveStyles);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={`mobile-cta ${visible ? "is-visible" : ""}`} aria-hidden={!visible} inert={!visible || undefined}>
      <div className="mobile-cta-text">
        <span className="mobile-cta-title">Have a project in mind?</span>
        <span className="mobile-cta-sub">We reply within 24 hours</span>
      </div>
      <a href="#contact" className="mobile-cta-btn">
        Let's Talk →
      </a>
    </div>
  );
}
