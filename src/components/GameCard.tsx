import { MapPin } from 'lucide-react';
import type { Game, GameStatus, GameTeam } from '../data/gamesMock';

const statusLabel: Record<GameStatus, string> = {
  scheduled: 'Scheduled',
  live: 'Live',
  final: 'Final',
};

function TeamRow({ team, isWinner, showScore }: { team: GameTeam; isWinner: boolean; showScore: boolean }) {
  return (
    <div className="flex items-center gap-4 py-3">
      <span className={`font-display text-2xl font-bold ${isWinner ? 'text-text-primary' : 'text-text-secondary'}`}>
        {team.abbreviation}
      </span>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${isWinner ? 'text-text-primary' : 'text-text-secondary'}`}>
          {team.city} {team.name}
        </p>
        <p className="mt-0.5 text-xs text-text-secondary">{team.record ?? 'Record unavailable'}</p>
      </div>
      {showScore ? (
        <span
          className={`font-display text-3xl font-bold tabular-nums ${
            isWinner ? 'text-score-orange' : 'text-text-secondary'
          }`}
        >
          {team.score ?? '-'}
        </span>
      ) : null}
    </div>
  );
}

function getWinner(game: Game): 'home' | 'away' | null {
  if (game.status === 'scheduled') {
    return null;
  }

  const homeScore = game.homeTeam.score ?? 0;
  const awayScore = game.awayTeam.score ?? 0;

  if (homeScore === awayScore) {
    return null;
  }

  return homeScore > awayScore ? 'home' : 'away';
}

export function GameCard({ game }: { game: Game }) {
  const winner = getWinner(game);
  const showScore = game.status !== 'scheduled';
  const liveDetail = game.status === 'live' && game.period && game.clock ? `${game.period} - ${game.clock}` : null;

  return (
    <article className="border-t border-rule bg-ink-900 p-5">
      <div className="flex flex-col gap-3 border-b border-rule pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {game.status === 'live' ? (
            <span className="flex items-center gap-1.5 font-medium text-live-cyan">
              <span className="size-1.5 rounded-full bg-live-cyan motion-safe:animate-pulse" aria-hidden="true" />
              Live
            </span>
          ) : (
            <span className="text-text-secondary">{statusLabel[game.status]}</span>
          )}
          <span className="font-medium text-text-primary">{liveDetail ?? game.time}</span>
        </div>
        <p className="text-sm text-text-secondary">
          {game.awayTeam.abbreviation} at {game.homeTeam.abbreviation}
        </p>
      </div>

      <div className="divide-y divide-rule">
        <TeamRow team={game.awayTeam} isWinner={winner === 'away'} showScore={showScore} />
        <TeamRow team={game.homeTeam} isWinner={winner === 'home'} showScore={showScore} />
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-rule pt-4 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-score-orange" aria-hidden="true" />
          <span>
            {game.arena} - {game.city}
          </span>
        </div>
        {game.notes ? <p>{game.notes}</p> : null}
      </div>
    </article>
  );
}
