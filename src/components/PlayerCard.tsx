import { Flag, Ruler, Scale, Shirt, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Player } from '../types/player';
import { FavoriteButton } from './FavoriteButton';

interface PlayerCardProps {
  player: Player;
}

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <article className="rounded-lg border border-white/10 bg-zinc-900/80 p-5 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-red-400/50 hover:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <Link
          to={`/players/${player.id}`}
          className="min-w-0 focus:outline-none focus:ring-2 focus:ring-red-500/40"
          aria-label={`View ${player.fullName} profile`}
        >
          <p className="text-sm font-medium text-red-300">{player.teamName}</p>
          <h2 className="mt-1 text-xl font-semibold text-white">{player.fullName}</h2>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <span className="flex size-11 items-center justify-center rounded-lg bg-red-500/15 text-sm font-bold text-red-200">
            {player.position}
          </span>
          <FavoriteButton player={player} />
        </div>
      </div>

      <Link to={`/players/${player.id}`} className="block focus:outline-none focus:ring-2 focus:ring-red-500/40">
        <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-white/[0.04] p-3">
            <dt className="flex items-center gap-2 text-zinc-500">
              <Shirt className="size-4" aria-hidden="true" />
              Position
            </dt>
            <dd className="mt-1 font-medium text-zinc-100">{player.position}</dd>
          </div>
          <div className="rounded-lg bg-white/[0.04] p-3">
            <dt className="flex items-center gap-2 text-zinc-500">
              <UserRound className="size-4" aria-hidden="true" />
              Age
            </dt>
            <dd className="mt-1 font-medium text-zinc-100">{player.age}</dd>
          </div>
          <div className="rounded-lg bg-white/[0.04] p-3">
            <dt className="flex items-center gap-2 text-zinc-500">
              <Ruler className="size-4" aria-hidden="true" />
              Height
            </dt>
            <dd className="mt-1 font-medium text-zinc-100">{player.height}</dd>
          </div>
          <div className="rounded-lg bg-white/[0.04] p-3">
            <dt className="flex items-center gap-2 text-zinc-500">
              <Scale className="size-4" aria-hidden="true" />
              Weight
            </dt>
            <dd className="mt-1 font-medium text-zinc-100">{player.weight}</dd>
          </div>
        </dl>

        <div className="mt-5 flex items-center gap-2 text-sm text-zinc-400">
          <Flag className="size-4" aria-hidden="true" />
          {player.country}
        </div>
      </Link>
    </article>
  );
}
