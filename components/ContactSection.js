export function ContactSection({ submitLabel, submitMessage, submitState, onSubmit, t }) {
  const addressLines = t.contactAddress.split("\n");

  return (
    <section id="kontakt" className="section contact-section">
      <div className="shell contact-grid">
        <div className="contact-copy reveal-block" data-reveal>
          <p className="split-kicker">{t.contactKicker}</p>
          <h2>{t.contactTitle}</h2>
          <p>{t.contactDescription}</p>

          <div className="contact-list">
            <a href="mailto:info@villa-moonriver.cz">info@villa-moonriver.cz</a>
            <p>
              {addressLines.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          </div>
        </div>

        <form className="contact-form reveal-block" data-reveal onSubmit={onSubmit}>
          <input
            type="text"
            name="_honey"
            autoComplete="off"
            tabIndex="-1"
            className="contact-honeypot"
          />

          <div className="field-grid">
            <label className="field">
              <span>{t.formName}</span>
              <input type="text" name="name" autoComplete="name" required />
            </label>

            <label className="field">
              <span>{t.formEmail}</span>
              <input type="email" name="email" autoComplete="email" required />
            </label>
          </div>

          <label className="field">
            <span>{t.formPhoneOptional || t.formPhone}</span>
            <input type="tel" name="phone" autoComplete="tel" />
          </label>

          <label className="field">
            <span>{t.formMessage}</span>
            <textarea name="message" rows="5" required />
          </label>

          <button type="submit" className="button button-full" disabled={submitState === "sending"}>
            {submitLabel}
          </button>

          {submitMessage ? (
            <p
              className={`form-status${submitState === "done" ? " is-success" : " is-error"}`}
              aria-live="polite"
            >
              {submitMessage}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
