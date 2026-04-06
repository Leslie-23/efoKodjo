export default function Marquee({ text }) {
  const repeated = `${text} `.repeat(10)

  return (
    <>
      <div className="marquee-strip">
        <div className="marquee-track">
          <span className="marquee-text">{repeated}</span>
          <span className="marquee-text">{repeated}</span>
        </div>
      </div>
      {/* Reverse direction secondary strip */}
      <div className="marquee-strip marquee-strip--reverse">
        <div className="marquee-track marquee-track--reverse">
          <span className="marquee-text marquee-text--outline">{repeated}</span>
          <span className="marquee-text marquee-text--outline">{repeated}</span>
        </div>
      </div>
    </>
  )
}
