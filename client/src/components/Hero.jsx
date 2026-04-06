export default function Hero({ data }) {
  const nameParts = data.name.split(' ')

  return (
    <section className="hero" id="hero">
      {/* Floating street sticker */}
      <div className="hero-sticker hero-sticker--1">ORIGINAL</div>

      <div className="hero-content">
        <div className="hero-text animate-on-scroll">
          <div className="hero-issue-tag">ISSUE 001 — THE RISE</div>
          {nameParts.map((part, i) => (
            <h1 key={i} className="hero-name-line" style={{ animationDelay: `${i * 0.15}s` }}>
              {part}
            </h1>
          ))}
          <p className="hero-subtitle">{data.subtitle}</p>
          <div className="hero-badges">
            <span className="hero-badge">{data.badgeText}</span>
            <span className="hero-badge hero-badge--outline">EST. ACCRA</span>
          </div>
        </div>

        <div className="hero-images animate-on-scroll">
          {/* Main editorial photo */}
          <div className="hero-image-main">
            {data.image ? (
              <img src={data.image} alt="Efo Kodjo — editorial portrait" className="hero-image" />
            ) : (
              <div className="hero-image-placeholder">
                <div className="placeholder-crosshair" />
                <span className="placeholder-label">EDITORIAL<br/>PORTRAIT</span>
                <span className="placeholder-size">800 x 1000</span>
              </div>
            )}
            <div className="hero-tape hero-tape--top" />
            <div className="hero-tape hero-tape--bottom" />
          </div>

          {/* Secondary floating photo */}
          <div className="hero-image-secondary">
            <div className="hero-image-placeholder hero-image-placeholder--sm">
              <span className="placeholder-label">BTS<br/>SHOT</span>
              <span className="placeholder-size">400 x 400</span>
            </div>
          </div>

          {/* Polaroid accent */}
          <div className="hero-polaroid">
            <div className="hero-image-placeholder hero-image-placeholder--polaroid">
              <span className="placeholder-label">SNAP</span>
            </div>
            <p className="hero-polaroid-caption">day one energy</p>
          </div>
        </div>
      </div>

      {/* Bottom halftone divider */}
      <div className="halftone-divider" />
    </section>
  )
}
