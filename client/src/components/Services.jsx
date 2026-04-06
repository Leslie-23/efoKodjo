export default function Services({ data }) {
  return (
    <section className="services" id="services">
      <div className="section-label">06 / SERVICES</div>
      <div className="services-inner">
        <div className="services-left animate-on-scroll">
          <h2>{data.headline}</h2>
          <div className="services-left-img">
            <div className="img-placeholder img-placeholder--tall">
              <div className="placeholder-crosshair" />
              <span className="placeholder-label">EFO AT<br/>WORK</span>
              <span className="placeholder-size">500 x 700</span>
            </div>
            <div className="img-stamp img-stamp--rotated">HIRE ME</div>
          </div>
        </div>
        <div className="services-right animate-on-scroll">
          {data.items.map((item, i) => (
            <div className="service-item" key={i}>
              <div className="service-number">{String(i + 1).padStart(2, '0')}</div>
              <div className="service-body">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
          <a href={data.ctaLink} className="cta-button">
            <span className="cta-button-text">{data.ctaText}</span>
            <span className="cta-button-arrow">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  )
}
