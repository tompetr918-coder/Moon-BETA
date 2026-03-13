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
  const [submitMessage, setSubmitMessage] = useState("");
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

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    // Basic anti-spam honeypot for static-form delivery.
    if (String(formData.get("_honey") || "").trim()) {
      return;
    }

    setSubmitState("sending");
    setSubmitMessage("");

    formData.set("_subject", "Moon River - nova poptavka z webu");
    formData.set("_captcha", "false");
    formData.set("_template", "table");
    formData.set("_url", window.location.href);

    try {
      const response = await fetch("https://formsubmit.co/ajax/info@villa-moonriver.cz", {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Form submit failed with ${response.status}`);
      }

      form.reset();
      setSubmitState("done");
      setSubmitMessage(t.formSuccess);

      window.setTimeout(() => {
        setSubmitState("idle");
        setSubmitMessage("");
      }, 3200);
    } catch (error) {
      console.error("Contact form send failed:", error);
      setSubmitState("error");
      setSubmitMessage(t.formError);
    }
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
        style={{ "--emboss-url": `url(${basePath}/branding/razba-wide.png)` }}
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
          submitMessage={submitMessage}
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
