export default function ContentFeed({ data }) {
  return (
    <section className="content-feed" id="content">
      <div className="section-label section-label--dark">05 / THE FEED</div>
      <div className="feed-header animate-on-scroll">
        <h2 className="feed-title">The Feed</h2>
        <span className="feed-count">{data.items.length} DROPS</span>
      </div>

      <div className="feed-scroll">
        {data.items.map((item, i) => (
          <div className="feed-card" key={i}>
            <div className="feed-card-number">#{String(i + 1).padStart(2, '0')}</div>
            {item.thumbnail ? (
              <img src={item.thumbnail} alt={item.title} className="feed-thumb" />
            ) : (
              <div className="feed-thumb-placeholder">
                <div className="feed-play-btn">
                  <span>&#9654;</span>
                </div>
                <div className="feed-thumb-lines">
                  <div /><div /><div />
                </div>
              </div>
            )}
            <div className="feed-card-body">
              <span className="feed-tag">{item.tag}</span>
              <p className="feed-card-title">{item.title}</p>
            </div>
            <div className="feed-card-stripe" />
          </div>
        ))}
      </div>

      {/* Feature video placeholder */}
      <div className="feed-feature animate-on-scroll">
        <div className="img-placeholder img-placeholder--video">
          <div className="feed-play-btn feed-play-btn--lg">
            <span>&#9654;</span>
          </div>
          <span className="placeholder-label">FEATURED VIDEO</span>
          <span className="placeholder-size">1280 x 720</span>
        </div>
        <div className="feed-feature-bar">
          <span>NOW PLAYING</span>
          <span className="feed-feature-dots">
            <i /><i /><i />
          </span>
        </div>
      </div>
    </section>
  )
}
