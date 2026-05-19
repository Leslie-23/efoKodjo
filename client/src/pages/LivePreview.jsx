import { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import Origin from '../components/Origin'
import Persona from '../components/Persona'
import Collabs from '../components/Collabs'
import ContentFeed from '../components/ContentFeed'
import Services from '../components/Services'
import Footer from '../components/Footer'
import Marquee from '../components/Marquee'
import '../styles/public.css'

export default function LivePreview() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'cms-preview') setData(e.data.payload)
    }
    window.addEventListener('message', handler)
    window.parent.postMessage({ type: 'cms-preview-ready' }, '*')
    return () => window.removeEventListener('message', handler)
  }, [])

  useEffect(() => {
    if (!data) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('in-view')
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [data])

  if (!data) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#111', color: 'rgba(245,240,232,0.3)',
        fontFamily: 'Syne, sans-serif', fontSize: '0.75rem',
        letterSpacing: '0.2em', textTransform: 'uppercase',
      }}>
        Waiting for edits...
      </div>
    )
  }

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
