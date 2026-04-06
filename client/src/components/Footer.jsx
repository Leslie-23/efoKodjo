export default function Footer({ data }) {
  const socials = [
    { key: 'tiktok', label: 'TikTok' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'youtube', label: 'YouTube' },
    { key: 'twitter', label: 'X' },
  ]

  return (
    <footer className="site-footer" id="contact">
      <div className="footer-inner">
        {/* Big portrait placeholder */}
        <div className="footer-portrait">
          <div className="img-placeholder img-placeholder--circle img-placeholder--circle-lg">
            <span className="placeholder-label">EFO</span>
          </div>
        </div>

        <h2 className="footer-name">EFO KODJO</h2>
        <div className="footer-divider" />
        <a href={`mailto:${data.email}`} className="footer-email">{data.email}</a>

        <div className="footer-socials">
          {socials.map(({ key, label }) => {
            const url = data.socials[key]
            const hasLink = url && url !== '#'
            return hasLink ? (
              <a key={key} href={url} target="_blank" rel="noopener noreferrer" aria-label={label}>
                {label}
              </a>
            ) : (
              <span key={key} className="social-placeholder">{label}</span>
            )
          })}
        </div>

        <p className="footer-tagline">{data.tagline}</p>

        {/* Street-style bottom strip */}
        <div className="footer-strip">
          <span>ACCRA</span>
          <span>&bull;</span>
          <span>THE INTERNET</span>
          <span>&bull;</span>
          <span>EVERYWHERE</span>
        </div>

        <p className="footer-copy">&copy; {new Date().getFullYear()} Efo Kodjo. All rights reserved.</p>
      </div>
    </footer>
  )
}
