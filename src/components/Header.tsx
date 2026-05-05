import {
  Activity,
  ArrowRightLeft,
  BarChart3,
  CalendarDays,
  GitBranch,
  Heart,
  Home,
  Shield,
  Table2,
  Users,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Teams', path: '/teams', icon: Shield },
  { label: 'Players', path: '/players', icon: Users },
  { label: 'Games', path: '/games', icon: CalendarDays },
  { label: 'Standings', path: '/standings', icon: Table2 },
  { label: 'Playoffs', path: '/playoffs', icon: GitBranch },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Compare', path: '/compare', icon: ArrowRightLeft },
  { label: 'Favorites', path: '/favorites', icon: Heart },
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <NavLink to="/" className="flex w-fit items-center gap-3" aria-label="NBA Insight home">
          <span className="flex size-10 items-center justify-center rounded-lg bg-red-600 text-white shadow-lg shadow-red-950/40">
            <Activity className="size-5" aria-hidden="true" />
          </span>
          <span className="text-xl font-semibold tracking-normal text-white">NBA Insight</span>
        </NavLink>

        <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" aria-label="Main navigation">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium transition ${
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
        </nav>
      </div>
    </header>
  );
}
