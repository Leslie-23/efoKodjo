export default function Persona({ data }) {
  return (
    <section className="persona" id="persona">
      <div className="section-label section-label--light">03 / THE PERSONA</div>
      <div className="persona-inner">
        <div className="persona-header animate-on-scroll">
          <h2 className="persona-title">Who Is<br/><em>Efo Kodjo?</em></h2>
          {/* Profile image placeholder */}
          <div className="persona-profile-img">
            <div className="img-placeholder img-placeholder--circle">
              <span className="placeholder-label">PROFILE</span>
            </div>
          </div>
        </div>

        <div className="stat-grid animate-on-scroll">
          {data.stats.map((stat, i) => (
            <div className="stat-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="stat-icon">{stat.icon}</span>
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
              <div className="stat-corner" />
            </div>
          ))}
        </div>

        <div className="persona-bio-row animate-on-scroll">
          <div className="persona-bio">
            <p>{data.bio}</p>
          </div>
          {/* Action shots grid */}
          <div className="persona-action-shots">
            <div className="img-placeholder img-placeholder--rect">
              <span className="placeholder-label">ON STAGE</span>
              <span className="placeholder-size">500 x 300</span>
            </div>
            <div className="img-placeholder img-placeholder--rect">
              <span className="placeholder-label">IN THE STUDIO</span>
              <span className="placeholder-size">500 x 300</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
