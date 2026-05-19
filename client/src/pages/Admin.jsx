import { useEffect, useState, useRef, useCallback } from 'react'
import { getContent, updateContent, uploadImage } from '../api'
import '../styles/admin.css'

function AuthGate({ onAuth }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (pw === 'efoKodjo') {
      sessionStorage.setItem('cms-auth', '1')
      onAuth()
    } else {
      setError(true)
      setTimeout(() => setError(false), 1500)
    }
  }

  return (
    <div className="auth-overlay">
      <form className="auth-modal" onSubmit={submit}>
        <div className="auth-label">CMS Access</div>
        <h2 className="auth-title">Enter Password</h2>
        <input
          type="password"
          className={`auth-input ${error ? 'auth-input--error' : ''}`}
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          autoFocus
        />
        <button type="submit" className="auth-submit">Unlock</button>
        {error && <div className="auth-error">Wrong password</div>}
      </form>
    </div>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('cms-auth') === '1')
  const [data, setData] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('hero')
  const [showPreview, setShowPreview] = useState(false)
  const previewRef = useRef(null)
  const previewReady = useRef(false)

  useEffect(() => {
    if (authed) getContent().then(setData).catch(console.error)
  }, [authed])

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'cms-preview-ready') previewReady.current = true
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  const sendPreview = useCallback(() => {
    if (!showPreview || !data || !previewRef.current) return
    previewRef.current.contentWindow?.postMessage(
      { type: 'cms-preview', payload: data }, '*'
    )
  }, [showPreview, data])

  useEffect(() => { sendPreview() }, [sendPreview])

  if (!authed) return <AuthGate onAuth={() => setAuthed(true)} />

  const save = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const updated = await updateContent(data)
      setData(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      alert('Save failed: ' + e.message)
    }
    setSaving(false)
  }

  const handleImageUpload = async (e, callback) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const { url } = await uploadImage(file)
      callback(url)
    } catch (err) {
      alert('Upload failed: ' + err.message)
    }
  }

  const update = (section, field, value) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }))
  }

  if (!data) return <div className="admin-loader">Loading CMS...</div>

  const tabs = [
    { key: 'hero', label: 'Hero' },
    { key: 'origin', label: 'Origin Story' },
    { key: 'persona', label: 'Persona & Stats' },
    { key: 'collabs', label: 'Collabs' },
    { key: 'contentFeed', label: 'Content Feed' },
    { key: 'services', label: 'Services' },
    { key: 'contact', label: 'Contact & Footer' },
    { key: 'marquee', label: 'Marquee' },
  ]

  return (
    <div className={`admin ${showPreview ? 'admin--with-preview' : ''}`}>
      <header className="admin-header">
        <h1>Efo Kodjo CMS</h1>
        <div className="admin-header-actions">
          <button
            className={`admin-preview-btn ${showPreview ? 'admin-preview-btn--active' : ''}`}
            onClick={() => setShowPreview((v) => !v)}
          >
            {showPreview ? 'Hide Preview' : 'Live Preview'}
          </button>
          <button onClick={save} disabled={saving} className="admin-save-btn">
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save All Changes'}
          </button>
        </div>
      </header>

      <div className="admin-body">
        <nav className="admin-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`admin-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="admin-content">
          {activeTab === 'hero' && (
            <HeroEditor data={data.hero} update={update} onUpload={handleImageUpload} />
          )}
          {activeTab === 'origin' && (
            <OriginEditor data={data.origin} update={update} onUpload={handleImageUpload} />
          )}
          {activeTab === 'persona' && (
            <PersonaEditor data={data.persona} setData={setData} />
          )}
          {activeTab === 'collabs' && (
            <CollabsEditor data={data.collabs} setData={setData} onUpload={handleImageUpload} />
          )}
          {activeTab === 'contentFeed' && (
            <FeedEditor data={data.contentFeed} setData={setData} onUpload={handleImageUpload} />
          )}
          {activeTab === 'services' && (
            <ServicesEditor data={data.services} update={update} setData={setData} />
          )}
          {activeTab === 'contact' && (
            <ContactEditor data={data.contact} update={update} setData={setData} />
          )}
          {activeTab === 'marquee' && (
            <div className="admin-section">
              <h2>Marquee Ticker Text</h2>
              <input
                type="text"
                value={data.marqueeText}
                onChange={(e) => setData((prev) => ({ ...prev, marqueeText: e.target.value }))}
              />
            </div>
          )}
        </div>
      </div>

      {showPreview && (
        <div className="admin-live-preview">
          <div className="admin-live-preview-bar">
            <span>Live Preview</span>
            <span className="admin-live-preview-dot" />
          </div>
          <iframe
            ref={previewRef}
            src="/admin/preview"
            title="Live Preview"
            className="admin-live-preview-frame"
            onLoad={sendPreview}
          />
        </div>
      )}
    </div>
  )
}

function HeroEditor({ data, update, onUpload }) {
  return (
    <div className="admin-section">
      <h2>Hero Section</h2>
      <label>Name (display)</label>
      <input value={data.name} onChange={(e) => update('hero', 'name', e.target.value)} />
      <label>Subtitle</label>
      <input value={data.subtitle} onChange={(e) => update('hero', 'subtitle', e.target.value)} />
      <label>Badge Text</label>
      <input value={data.badgeText} onChange={(e) => update('hero', 'badgeText', e.target.value)} />
      <label>Hero Image</label>
      {data.image && <img src={data.image} alt="Hero preview" className="admin-preview-img" />}
      <input type="file" accept="image/*" onChange={(e) => onUpload(e, (url) => update('hero', 'image', url))} />
    </div>
  )
}

function OriginEditor({ data, update, onUpload }) {
  return (
    <div className="admin-section">
      <h2>Origin Story</h2>
      <label>Pull Quote</label>
      <input value={data.pullQuote} onChange={(e) => update('origin', 'pullQuote', e.target.value)} />
      <label>Story</label>
      <textarea rows={6} value={data.story} onChange={(e) => update('origin', 'story', e.target.value)} />
      <label>Image</label>
      {data.image && <img src={data.image} alt="Origin preview" className="admin-preview-img" />}
      <input type="file" accept="image/*" onChange={(e) => onUpload(e, (url) => update('origin', 'image', url))} />
    </div>
  )
}

function PersonaEditor({ data, setData }) {
  const updateStat = (index, field, value) => {
    setData((prev) => {
      const stats = [...prev.persona.stats]
      stats[index] = { ...stats[index], [field]: value }
      return { ...prev, persona: { ...prev.persona, stats } }
    })
  }

  const addStat = () => {
    setData((prev) => ({
      ...prev,
      persona: {
        ...prev.persona,
        stats: [...prev.persona.stats, { label: 'New Stat', value: '0', icon: '📊' }],
      },
    }))
  }

  const removeStat = (index) => {
    setData((prev) => ({
      ...prev,
      persona: { ...prev.persona, stats: prev.persona.stats.filter((_, i) => i !== index) },
    }))
  }

  return (
    <div className="admin-section">
      <h2>Persona & Stats</h2>
      <label>Bio</label>
      <textarea
        rows={5}
        value={data.bio}
        onChange={(e) =>
          setData((prev) => ({ ...prev, persona: { ...prev.persona, bio: e.target.value } }))
        }
      />
      <h3>Stats</h3>
      {data.stats.map((stat, i) => (
        <div key={i} className="admin-inline-group">
          <input placeholder="Icon" value={stat.icon} onChange={(e) => updateStat(i, 'icon', e.target.value)} style={{ width: 60 }} />
          <input placeholder="Value" value={stat.value} onChange={(e) => updateStat(i, 'value', e.target.value)} style={{ width: 100 }} />
          <input placeholder="Label" value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)} />
          <button className="admin-remove-btn" onClick={() => removeStat(i)}>×</button>
        </div>
      ))}
      <button className="admin-add-btn" onClick={addStat}>+ Add Stat</button>
    </div>
  )
}

function CollabsEditor({ data, setData, onUpload }) {
  const updateCollab = (index, field, value) => {
    setData((prev) => {
      const items = [...prev.collabs.items]
      items[index] = { ...items[index], [field]: value }
      return { ...prev, collabs: { ...prev.collabs, items } }
    })
  }

  const addCollab = () => {
    setData((prev) => ({
      ...prev,
      collabs: { ...prev.collabs, items: [...prev.collabs.items, { name: 'New Collab', image: '' }] },
    }))
  }

  const removeCollab = (index) => {
    setData((prev) => ({
      ...prev,
      collabs: { ...prev.collabs, items: prev.collabs.items.filter((_, i) => i !== index) },
    }))
  }

  return (
    <div className="admin-section">
      <h2>Collabs</h2>
      <label>Section Title</label>
      <input
        value={data.sectionTitle}
        onChange={(e) =>
          setData((prev) => ({ ...prev, collabs: { ...prev.collabs, sectionTitle: e.target.value } }))
        }
      />
      <h3>Collab Partners</h3>
      {data.items.map((item, i) => (
        <div key={i} className="admin-card">
          <input placeholder="Name" value={item.name} onChange={(e) => updateCollab(i, 'name', e.target.value)} />
          {item.image && <img src={item.image} alt={item.name} className="admin-preview-img-sm" />}
          <input type="file" accept="image/*" onChange={(e) => onUpload(e, (url) => updateCollab(i, 'image', url))} />
          <button className="admin-remove-btn" onClick={() => removeCollab(i)}>Remove</button>
        </div>
      ))}
      <button className="admin-add-btn" onClick={addCollab}>+ Add Collab</button>
    </div>
  )
}

function FeedEditor({ data, setData, onUpload }) {
  const updateItem = (index, field, value) => {
    setData((prev) => {
      const items = [...prev.contentFeed.items]
      items[index] = { ...items[index], [field]: value }
      return { ...prev, contentFeed: { ...prev.contentFeed, items } }
    })
  }

  const addItem = () => {
    setData((prev) => ({
      ...prev,
      contentFeed: {
        ...prev.contentFeed,
        items: [...prev.contentFeed.items, { title: 'New Post', thumbnail: '', tag: '📢 New', url: '' }],
      },
    }))
  }

  const removeItem = (index) => {
    setData((prev) => ({
      ...prev,
      contentFeed: { ...prev.contentFeed, items: prev.contentFeed.items.filter((_, i) => i !== index) },
    }))
  }

  return (
    <div className="admin-section">
      <h2>Content Feed</h2>
      <label>Featured Video URL (TikTok)</label>
      <input
        placeholder="https://www.tiktok.com/@user/video/..."
        value={data.featuredVideo || ''}
        onChange={(e) =>
          setData((prev) => ({ ...prev, contentFeed: { ...prev.contentFeed, featuredVideo: e.target.value } }))
        }
      />
      <h3>Feed Items</h3>
      {data.items.map((item, i) => (
        <div key={i} className="admin-card">
          <input placeholder="Title" value={item.title} onChange={(e) => updateItem(i, 'title', e.target.value)} />
          <input placeholder="Tag (e.g. 🔥 Viral)" value={item.tag} onChange={(e) => updateItem(i, 'tag', e.target.value)} />
          <input placeholder="Video URL (TikTok link)" value={item.url || ''} onChange={(e) => updateItem(i, 'url', e.target.value)} />
          {item.thumbnail && <img src={item.thumbnail} alt={item.title} className="admin-preview-img-sm" />}
          <input type="file" accept="image/*" onChange={(e) => onUpload(e, (url) => updateItem(i, 'thumbnail', url))} />
          <button className="admin-remove-btn" onClick={() => removeItem(i)}>Remove</button>
        </div>
      ))}
      <button className="admin-add-btn" onClick={addItem}>+ Add Content</button>
    </div>
  )
}

function ServicesEditor({ data, update, setData }) {
  const updateItem = (index, field, value) => {
    setData((prev) => {
      const items = [...prev.services.items]
      items[index] = { ...items[index], [field]: value }
      return { ...prev, services: { ...prev.services, items } }
    })
  }

  return (
    <div className="admin-section">
      <h2>Services</h2>
      <label>Headline</label>
      <input value={data.headline} onChange={(e) => update('services', 'headline', e.target.value)} />
      <label>CTA Button Text</label>
      <input value={data.ctaText} onChange={(e) => update('services', 'ctaText', e.target.value)} />
      <label>CTA Link</label>
      <input value={data.ctaLink} onChange={(e) => update('services', 'ctaLink', e.target.value)} />
      <h3>Service Items</h3>
      {data.items.map((item, i) => (
        <div key={i} className="admin-card">
          <input placeholder="Title" value={item.title} onChange={(e) => updateItem(i, 'title', e.target.value)} />
          <textarea placeholder="Description" rows={2} value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} />
        </div>
      ))}
    </div>
  )
}

function ContactEditor({ data, update, setData }) {
  const updateSocial = (platform, value) => {
    setData((prev) => ({
      ...prev,
      contact: { ...prev.contact, socials: { ...prev.contact.socials, [platform]: value } },
    }))
  }

  return (
    <div className="admin-section">
      <h2>Contact & Footer</h2>
      <label>Email</label>
      <input value={data.email} onChange={(e) => update('contact', 'email', e.target.value)} />
      <label>Tagline</label>
      <input value={data.tagline} onChange={(e) => update('contact', 'tagline', e.target.value)} />
      <h3>Social Links</h3>
      <label>TikTok URL</label>
      <input value={data.socials.tiktok} onChange={(e) => updateSocial('tiktok', e.target.value)} />
      <label>Instagram URL</label>
      <input value={data.socials.instagram} onChange={(e) => updateSocial('instagram', e.target.value)} />
      <label>YouTube URL</label>
      <input value={data.socials.youtube} onChange={(e) => updateSocial('youtube', e.target.value)} />
      <label>X / Twitter URL</label>
      <input value={data.socials.twitter} onChange={(e) => updateSocial('twitter', e.target.value)} />
    </div>
  )
}
