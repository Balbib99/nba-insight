import {
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

function NavItem({ label, path, icon: Icon }: (typeof navItems)[number]) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `group relative flex h-9 shrink-0 items-center gap-1.5 px-2.5 font-body text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-cyan/60 ${
          isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon className="size-4" aria-hidden="true" />
          {label}
          <span
            aria-hidden="true"
            className={`absolute -bottom-[7px] left-2 right-2 h-[2px] -skew-x-[20deg] bg-score-orange transition-opacity ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </>
      )}
    </NavLink>
  );
}

export function Header() {
  const { isDemoMode, isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/auth');
  }

  return (
    <header className="sticky top-0 z-20 border-b border-rule bg-ink-950/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <NavLink
          to="/"
          className="flex w-fit flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-cyan/60"
          aria-label="NBA Insight home"
        >
          <span className="font-display text-2xl font-semibold leading-none tracking-tight text-text-primary">
            NBA Insight
          </span>
          <span className="mt-1.5 h-[3px] w-16 -skew-x-[20deg] bg-score-orange" aria-hidden="true" />
        </NavLink>

        <nav className="flex flex-wrap items-center gap-1" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
          <details className="group relative">
            <summary className="flex h-9 cursor-pointer list-none items-center gap-1.5 px-2.5 font-body text-sm font-medium text-text-secondary transition-colors marker:hidden hover:text-text-primary">
              <MoreHorizontal className="size-4" aria-hidden="true" />
              More
            </summary>
            <div className="absolute left-0 top-11 z-30 min-w-44 border border-rule bg-ink-900 p-1.5">
              {moreNavItems.map(({ label, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `flex h-9 items-center gap-2 px-3 font-body text-sm font-medium transition-colors ${
                      isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
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
              <span className="border border-rule px-3 py-1 font-body text-xs font-medium text-text-secondary">
                Demo mode
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-9 items-center justify-center border border-rule px-3 font-body text-sm font-medium text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-cyan/60"
              >
                Exit demo
              </button>
            </>
          ) : null}

          {isAuthenticated && user ? (
            <>
              <span className="inline-flex h-9 max-w-48 items-center gap-2 font-body text-sm text-text-secondary">
                <UserRound className="size-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{user.name || user.email}</span>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-9 items-center justify-center border border-rule px-3 font-body text-sm font-medium text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-cyan/60"
              >
                Log out
              </button>
            </>
          ) : null}

          {!isDemoMode && !isAuthenticated ? (
            <Link
              to="/auth"
              className="inline-flex h-9 items-center justify-center bg-score-orange px-3.5 font-body text-sm font-semibold text-ink-950 transition-colors hover:bg-score-orange/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-cyan/60"
            >
              Sign in
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
