import { Routes, Route } from 'react-router-dom'
import PublicSite from './pages/PublicSite'
import Admin from './pages/Admin'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicSite />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}
