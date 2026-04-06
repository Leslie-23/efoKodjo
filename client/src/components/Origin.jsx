export default function Origin({ data }) {
  return (
    <section className="origin" id="origin">
      <div className="section-label">02 / ORIGIN STORY</div>
      <div className="origin-inner">
        <div className="origin-quote animate-on-scroll">
          <blockquote>&ldquo;{data.pullQuote}&rdquo;</blockquote>
          <div className="origin-quote-attr">— Efo Kodjo</div>
        </div>
        <div className="origin-body animate-on-scroll">
          <p>{data.story}</p>
          <div className="origin-images">
            {/* Main product image */}
            <div className="origin-img-slot origin-img-slot--main">
              {data.image ? (
                <img src={data.image} alt="Efo Kodjo Gari Mix" />
              ) : (
                <div className="img-placeholder img-placeholder--tall">
                  <div className="placeholder-crosshair" />
                  <span className="placeholder-label">GARI MIX<br/>PRODUCT</span>
                  <span className="placeholder-size">600 x 800</span>
                </div>
              )}
              <div className="img-stamp">THE ORIGINAL</div>
            </div>

            {/* Secondary street photo */}
            <div className="origin-img-slot origin-img-slot--side">
              <div className="img-placeholder img-placeholder--square">
                <span className="placeholder-label">STREET<br/>SCENE</span>
                <span className="placeholder-size">400 x 400</span>
              </div>
              <div className="tape-strip tape-strip--diagonal" />
            </div>

            {/* Small accent photo */}
            <div className="origin-img-slot origin-img-slot--accent">
              <div className="img-placeholder img-placeholder--xs">
                <span className="placeholder-label">MIX</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
