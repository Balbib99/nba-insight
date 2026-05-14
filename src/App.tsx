import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { useAuth } from './context/AuthContext';
import { Analytics } from './pages/Analytics';
import { AuthPage } from './pages/AuthPage';
import { Compare } from './pages/Compare';
import { Favorites } from './pages/Favorites';
import { Games } from './pages/Games';
import { HomePage } from './pages/HomePage';
import { PlayerDetail } from './pages/PlayerDetail';
import { Players } from './pages/Players';
import { Playoffs } from './pages/Playoffs';
import { Standings } from './pages/Standings';
import { TeamDetail } from './pages/TeamDetail';
import { TeamsPage } from './pages/TeamsPage';

export default function App() {
  const { authMode, isLoading } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
        <div className="rounded-lg border border-white/10 bg-zinc-900/80 px-5 py-4 text-sm font-medium text-zinc-200 shadow-xl shadow-black/20">
          Loading NBA Insight...
        </div>
      </div>
    );
  }

  if (authMode === 'guest') {
    return (
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  if (isAuthPage) {
    return <Navigate to="/" replace />;
  }

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
          <Route path="/games" element={<Games />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/playoffs" element={<Playoffs />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/auth" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
