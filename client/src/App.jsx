import { Routes, Route } from 'react-router-dom'
import PublicSite from './pages/PublicSite'
import Admin from './pages/Admin'
import LivePreview from './pages/LivePreview'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicSite />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/preview" element={<LivePreview />} />
    </Routes>
  )
}
