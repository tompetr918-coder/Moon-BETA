export function InfoSection({ t }) {
  const descriptionBlocks = (t.infoDescription || "").split("\n\n");

  return (
    <section id="informace" className="section">
      <div className="shell">
        <div className="section-intro reveal-block" data-reveal>
          <h2>{t.infoTitle}</h2>
          <div className="divider" />
          {descriptionBlocks.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="cards">
          <article className="card reveal-block" data-reveal>
            <div className="card-icon">01</div>
            <h3>{t.infoCard1Title}</h3>
            <p>{t.infoCard1Description}</p>
          </article>

          <article className="card card-shift reveal-block" data-reveal>
            <div className="card-icon">02</div>
            <h3>{t.infoCard2Title}</h3>
            <p>{t.infoCard2Description}</p>
          </article>

          <article className="card reveal-block" data-reveal>
            <div className="card-icon">03</div>
            <h3>{t.infoCard3Title}</h3>
            <p>{t.infoCard3Description}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
