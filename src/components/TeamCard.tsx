import { Link } from 'react-router-dom';
import type { Team } from '../types/team';

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Link
      to={`/teams/${team.id}`}
      className="block border-t border-rule bg-ink-900 p-5 transition-colors hover:bg-ledger-blue/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-cyan/60"
      aria-label={`View ${team.fullName} profile`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ledger-blue">{team.city}</p>
          <h2 className="mt-1 font-display text-xl font-semibold text-text-primary">{team.fullName}</h2>
        </div>
        <span className="font-display text-3xl font-bold leading-none text-score-orange">{team.abbreviation}</span>
      </div>

      <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-rule pt-4 text-sm">
        <div>
          <dt className="text-xs text-text-secondary">Name</dt>
          <dd className="mt-1 font-display text-base font-semibold text-text-primary">{team.name}</dd>
        </div>
        <div>
          <dt className="text-xs text-text-secondary">Conference</dt>
          <dd className="mt-1 font-display text-base font-semibold text-text-primary">{team.conference}</dd>
        </div>
        <div>
          <dt className="text-xs text-text-secondary">Division</dt>
          <dd className="mt-1 font-display text-base font-semibold text-text-primary">{team.division}</dd>
        </div>
      </dl>
    </Link>
  );
}
