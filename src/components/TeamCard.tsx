import { Badge, MapPin, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Team } from '../types/team';

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Link
      to={`/teams/${team.id}`}
      className="block rounded-lg border border-white/10 bg-zinc-900/80 p-5 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-red-400/50 hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-500/40"
      aria-label={`View ${team.fullName} profile`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-red-300">{team.city}</p>
          <h2 className="mt-1 text-xl font-semibold text-white">{team.fullName}</h2>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-red-500/15 text-sm font-bold text-red-200">
          {team.abbreviation}
        </span>
      </div>

      <dl className="mt-6 grid grid-cols-1 gap-3 text-sm">
        <div className="rounded-lg bg-white/[0.04] p-3">
          <dt className="flex items-center gap-2 text-zinc-500">
            <Badge className="size-4" aria-hidden="true" />
            Name
          </dt>
          <dd className="mt-1 font-medium text-zinc-100">{team.name}</dd>
        </div>
        <div className="rounded-lg bg-white/[0.04] p-3">
          <dt className="flex items-center gap-2 text-zinc-500">
            <Shield className="size-4" aria-hidden="true" />
            Conference
          </dt>
          <dd className="mt-1 font-medium text-zinc-100">{team.conference}</dd>
        </div>
        <div className="rounded-lg bg-white/[0.04] p-3">
          <dt className="text-zinc-500">Division</dt>
          <dd className="mt-1 font-medium text-zinc-100">{team.division}</dd>
        </div>
      </dl>

      <div className="mt-5 flex items-center gap-2 text-sm text-zinc-400">
        <MapPin className="size-4" aria-hidden="true" />
        {team.city} - {team.division}
      </div>
    </Link>
  );
}
