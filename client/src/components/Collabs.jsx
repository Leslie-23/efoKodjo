export default function Collabs({ data }) {
  return (
    <section className="collabs" id="collabs">
      <div className="section-label">04 / COLLABORATIONS</div>
      <h2 className="collabs-title animate-on-scroll">
        {data.sectionTitle}
        <span className="collabs-title-accent" />
      </h2>
      <p className="collabs-subtitle animate-on-scroll">They didn't come to him by accident.</p>

      <div className="collabs-grid animate-on-scroll">
        {data.items.map((item, i) => (
          <div
            className={`collab-card collab-card--${i % 3 === 0 ? 'wide' : i % 3 === 1 ? 'tall' : 'normal'}`}
            key={i}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            {item.image ? (
              <img src={item.image} alt={`Collab with ${item.name}`} />
            ) : (
              <div className="collab-placeholder">
                <div className="placeholder-crosshair placeholder-crosshair--light" />
                <span className="collab-placeholder-initial">{item.name.charAt(0)}</span>
                <span className="collab-placeholder-name">{item.name}</span>
              </div>
            )}
            <div className="collab-caption">
              <span className="collab-caption-name">{item.name}</span>
              <span className="collab-caption-tag">COLLAB #{String(i + 1).padStart(2, '0')}</span>
            </div>
            {i % 2 === 0 && <div className="tape-strip tape-strip--corner" />}
          </div>
        ))}
      </div>

      {/* Extra wide collab image slot */}
      <div className="collabs-featured animate-on-scroll">
        <div className="img-placeholder img-placeholder--panoramic">
          <div className="placeholder-crosshair placeholder-crosshair--light" />
          <span className="placeholder-label">GROUP COLLAB<br/>FEATURED SHOT</span>
          <span className="placeholder-size">1200 x 500</span>
        </div>
        <div className="collabs-featured-label">THE SQUAD</div>
      </div>
    </section>
  )
}
