import { galleryItems } from "./data";

export function GallerySection({ t }) {
  const basePath = process.env.NODE_ENV === "production" ? "/Moon-BETA" : "";

  return (
    <section id="galerie" className="section section-muted">
      <div className="shell">
        <div className="gallery-heading reveal-block" data-reveal>
          <div>
            <h2>{t.galleryTitle}</h2>
            <p>{t.galleryDescription}</p>
          </div>
          <a href="#kontakt" className="text-link">{t.galleryCta}</a>
        </div>

        <div className="gallery-grid">
          {galleryItems.map((item) => {
            const resolvedSrc = item.src.startsWith("/")
              ? `${basePath}${item.src}`
              : item.src;

            return (
              <figure
                key={item.src}
                className={`gallery-item${item.wide ? " gallery-item-wide" : ""} reveal-block`}
                data-reveal
              >
                <img src={resolvedSrc} alt={item.alt} />
                <figcaption>{t[item.titleKey]}</figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
