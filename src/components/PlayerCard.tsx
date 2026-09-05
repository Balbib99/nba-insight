import { Link } from 'react-router-dom';
import type { Player } from '../types/player';
import { FavoriteButton } from './FavoriteButton';

interface PlayerCardProps {
  player: Player;
}

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <article className="border-t border-rule bg-ink-900 p-5 transition-colors hover:bg-ledger-blue/[0.06]">
      <div className="flex items-start justify-between gap-4">
        <Link
          to={`/players/${player.id}`}
          className="min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-cyan/60"
          aria-label={`View ${player.fullName} profile`}
        >
          <p className="text-sm font-medium text-ledger-blue">{player.teamName}</p>
          <h2 className="mt-1 font-display text-xl font-semibold text-text-primary">{player.fullName}</h2>
        </Link>
        <div className="flex shrink-0 items-center gap-3">
          <span className="font-display text-3xl font-bold leading-none text-score-orange">{player.position}</span>
          <FavoriteButton player={player} />
        </div>
      </div>

      <Link
        to={`/players/${player.id}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-cyan/60"
      >
        <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-rule pt-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-xs text-text-secondary">Age</dt>
            <dd className="mt-1 font-display text-base font-semibold text-text-primary">{player.age}</dd>
          </div>
          <div>
            <dt className="text-xs text-text-secondary">Height</dt>
            <dd className="mt-1 font-display text-base font-semibold text-text-primary">{player.height}</dd>
          </div>
          <div>
            <dt className="text-xs text-text-secondary">Weight</dt>
            <dd className="mt-1 font-display text-base font-semibold text-text-primary">{player.weight}</dd>
          </div>
          <div>
            <dt className="text-xs text-text-secondary">Country</dt>
            <dd className="mt-1 font-display text-base font-semibold text-text-primary">{player.country}</dd>
          </div>
        </dl>
      </Link>
    </article>
  );
}
