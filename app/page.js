"use client";

import { useEffect, useState } from "react";
import { ChatWidget } from "../components/ChatWidget";
import { ContactSection } from "../components/ContactSection";
import { GallerySection } from "../components/GallerySection";
import { HeroSection } from "../components/HeroSection";
import { InfoSection } from "../components/InfoSection";
import { PricingSection } from "../components/PricingSection";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { translations } from "../components/translations";

export default function HomePage() {
  const basePath = process.env.NODE_ENV === "production" ? "/Moon-BETA" : "";
  const [navOpen, setNavOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [submitState, setSubmitState] = useState("idle");
  const [language, setLanguage] = useState("cs");

  const t = translations[language] ?? translations.cs;

  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const closeMenu = () => setNavOpen(false);
    window.addEventListener("resize", closeMenu);

    return () => window.removeEventListener("resize", closeMenu);
  }, []);

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem("moon-river-language");
    if (storedLanguage && translations[storedLanguage]) {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("moon-river-language", language);
  }, [language]);

  const handleContactSubmit = (event) => {
    event.preventDefault();
    setSubmitState("sending");

    window.setTimeout(() => {
      event.currentTarget.reset();
      setSubmitState("done");

      window.setTimeout(() => {
        setSubmitState("idle");
      }, 2200);
    }, 1200);
  };

  const submitLabel =
    submitState === "sending"
      ? t.formSending
      : submitState === "done"
        ? t.formSuccess
        : t.formSubmit;

  return (
    <>
      <div
        className="site-bg"
        aria-hidden="true"
        style={{ "--emboss-url": `url(${basePath}/branding/razba.png)` }}
      />

      <SiteHeader
        navOpen={navOpen}
        language={language}
        t={t}
        onLanguageChange={setLanguage}
        onToggle={() => setNavOpen((current) => !current)}
        onNavigate={() => setNavOpen(false)}
      />

      <main>
        <HeroSection t={t} />
        <InfoSection t={t} />
        <PricingSection t={t} />
        <GallerySection t={t} />
        <ContactSection
          t={t}
          submitLabel={submitLabel}
          submitState={submitState}
          onSubmit={handleContactSubmit}
        />
      </main>

      <SiteFooter t={t} />
      <ChatWidget
        chatOpen={chatOpen}
        t={t}
        onToggle={() => setChatOpen((current) => !current)}
        onClose={() => setChatOpen(false)}
      />
    </>
  );
}
