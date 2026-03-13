import exchangeRate from "../data/exchange-rate.json";

function formatCzk(value) {
  return new Intl.NumberFormat("cs-CZ").format(value);
}

function formatEur(value) {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export function PricingSection({ t }) {
  const ownFurniturePrice = 37500;
  const ownerFurniturePrice = 50000;
  const rate = exchangeRate.rateCzkPerEur;
  const ownFurnitureEur = Math.round(ownFurniturePrice / rate);
  const ownerFurnitureEur = Math.round(ownerFurniturePrice / rate);

  return (
    <section id="ceny" className="section section-muted">
      <div className="shell">
        <div className="section-intro reveal-block" data-reveal>
          <h2>{t.pricingTitle}</h2>
          <div className="divider" />
          <p>{t.pricingDescription}</p>
        </div>

        <div className="pricing-grid">
          <article className="pricing-card reveal-block" data-reveal>
            <p className="pricing-label">{t.pricingOwnTitle}</p>
            <strong>{formatCzk(ownFurniturePrice)} {t.pricingCzkSuffix}</strong>
            <span>{formatEur(ownFurnitureEur)} {t.pricingEurSuffix}</span>
            <p>{t.pricingOwnDescription}</p>
          </article>

          <article className="pricing-card pricing-card-featured reveal-block" data-reveal>
            <p className="pricing-label">{t.pricingOwnerTitle}</p>
            <strong>{formatCzk(ownerFurniturePrice)} {t.pricingCzkSuffix}</strong>
            <span>{formatEur(ownerFurnitureEur)} {t.pricingEurSuffix}</span>
            <p>{t.pricingOwnerDescription}</p>
          </article>
        </div>

        <p className="pricing-note reveal-block" data-reveal>
          {t.pricingNote} {t.pricingRateNote} {exchangeRate.publishedDate}
        </p>
      </div>
    </section>
  );
}
