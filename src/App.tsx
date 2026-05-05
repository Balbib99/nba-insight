import { Route, Routes } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Analytics } from './pages/Analytics';
import { Compare } from './pages/Compare';
import { Favorites } from './pages/Favorites';
import { HomePage } from './pages/HomePage';
import { PlayerDetail } from './pages/PlayerDetail';
import { Players } from './pages/Players';
import { Playoffs } from './pages/Playoffs';
import { Standings } from './pages/Standings';
import { TeamDetail } from './pages/TeamDetail';
import { TeamsPage } from './pages/TeamsPage';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />
      <main className="min-h-[calc(100vh-160px)]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/teams/:id" element={<TeamDetail />} />
          <Route path="/players" element={<Players />} />
          <Route path="/players/:id" element={<PlayerDetail />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/playoffs" element={<Playoffs />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
