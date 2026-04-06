import { useEffect, useState } from 'react'
import { getContent } from '../api'
import Hero from '../components/Hero'
import Origin from '../components/Origin'
import Persona from '../components/Persona'
import Collabs from '../components/Collabs'
import ContentFeed from '../components/ContentFeed'
import Services from '../components/Services'
import Footer from '../components/Footer'
import Marquee from '../components/Marquee'
import '../styles/public.css'

export default function PublicSite() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getContent()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
          }
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [data])

  // Parallax on mouse move for hero stickers
  useEffect(() => {
    const handler = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      document.querySelectorAll('.hero-sticker').forEach((el, i) => {
        const factor = (i + 1) * 0.6
        el.style.transform = `translate(${x * factor}px, ${y * factor}px) rotate(${el.dataset.rot || 0}deg)`
      })
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  if (loading) {
    return (
      <div className="loader">
        <div className="loader-inner">
          <div className="loader-text">EFO KODJO</div>
          <div className="loader-sub">LOADING THE VIBES...</div>
          <div className="loader-bar"><div className="loader-bar-fill" /></div>
        </div>
      </div>
    )
  }

  if (!data) return <div className="loader">Failed to load content.</div>

  return (
    <div className="site-wrapper">
      <div className="grain-overlay" />
      <Hero data={data.hero} />
      <Marquee text={data.marqueeText} />
      <Origin data={data.origin} />
      <Persona data={data.persona} />
      <Collabs data={data.collabs} />
      <ContentFeed data={data.contentFeed} />
      <Services data={data.services} />
      <Marquee text="BOOK EFO • GET SEEN • GO VIRAL • DON'T SLEEP •" />
      <Footer data={data.contact} />
    </div>
  )
}
