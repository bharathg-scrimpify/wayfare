import { HashRouter, Route, Routes } from 'react-router-dom'
import { TripProvider } from './store/trip'
import { Shell } from './components/Shell'
import Home from './pages/Home'
import Create from './pages/Create'
import Import from './pages/Import'
import Overview from './pages/Overview'
import Itinerary from './pages/Itinerary'
import Discover from './pages/Discover'
import Wishlist from './pages/Wishlist'
import Group from './pages/Group'
import Concierge from './pages/Concierge'
import Nearby from './pages/Nearby'
import Final from './pages/Final'
import Dna from './pages/Dna'
import Admin from './pages/Admin'

export default function App() {
  return (
    <TripProvider>
      <HashRouter useTransitions={false}>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/trip" element={<Overview />} />
            <Route path="/trip/import" element={<Import />} />
            <Route path="/trip/itinerary" element={<Itinerary />} />
            <Route path="/trip/discover" element={<Discover />} />
            <Route path="/trip/wishlist" element={<Wishlist />} />
            <Route path="/trip/group" element={<Group />} />
            <Route path="/trip/concierge" element={<Concierge />} />
            <Route path="/trip/nearby" element={<Nearby />} />
            <Route path="/trip/final" element={<Final />} />
            <Route path="/trip/dna" element={<Dna />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </HashRouter>
    </TripProvider>
  )
}
