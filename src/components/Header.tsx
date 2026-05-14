import {
  Activity,
  ArrowRightLeft,
  BarChart3,
  CalendarDays,
  GitBranch,
  Heart,
  Home,
  MoreHorizontal,
  Shield,
  Table2,
  UserRound,
  Users,
} from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Teams', path: '/teams', icon: Shield },
  { label: 'Players', path: '/players', icon: Users },
  { label: 'Games', path: '/games', icon: CalendarDays },
  { label: 'Standings', path: '/standings', icon: Table2 },
];

const moreNavItems = [
  { label: 'Playoffs', path: '/playoffs', icon: GitBranch },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Compare', path: '/compare', icon: ArrowRightLeft },
  { label: 'Favorites', path: '/favorites', icon: Heart },
];

export function Header() {
  const { isDemoMode, isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/auth');
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <NavLink to="/" className="flex w-fit items-center gap-3" aria-label="NBA Insight home">
          <span className="flex size-10 items-center justify-center rounded-lg bg-red-600 text-white shadow-lg shadow-red-950/40">
            <Activity className="size-5" aria-hidden="true" />
          </span>
          <span className="text-xl font-semibold tracking-normal text-white">NBA Insight</span>
        </NavLink>

        <nav className="flex flex-wrap items-center gap-1.5" aria-label="Main navigation">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition xl:h-10 xl:px-3 xl:text-sm ${
                  isActive
                    ? 'bg-white text-zinc-950 shadow-lg shadow-black/20'
                    : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
          <details className="group relative">
            <summary className="flex h-9 cursor-pointer list-none items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white marker:hidden xl:h-10 xl:px-3 xl:text-sm">
              <MoreHorizontal className="size-4" aria-hidden="true" />
              More
            </summary>
            <div className="absolute left-0 top-11 z-30 min-w-44 rounded-lg border border-white/10 bg-zinc-950 p-1.5 shadow-2xl shadow-black/40">
              {moreNavItems.map(({ label, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium transition ${
                      isActive
                        ? 'bg-white text-zinc-950'
                        : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </NavLink>
              ))}
            </div>
          </details>
        </nav>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {isDemoMode ? (
            <>
              <span className="rounded-lg border border-sky-300/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-100">
                Demo Mode
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-white/10 px-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 hover:text-white"
              >
                Exit Demo
              </button>
            </>
          ) : null}

          {isAuthenticated && user ? (
            <>
              <span className="inline-flex h-10 max-w-48 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-medium text-zinc-200">
                <UserRound className="size-4 shrink-0 text-zinc-400" aria-hidden="true" />
                <span className="truncate">{user.name || user.email}</span>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-white/10 px-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 hover:text-white"
              >
                Log out
              </button>
            </>
          ) : null}

          {!isDemoMode && !isAuthenticated ? (
            <Link
              to="/auth"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-white px-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
            >
              Sign in
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
