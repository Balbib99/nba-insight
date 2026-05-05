import { Clock, MapPin, Radio, Trophy } from 'lucide-react';
import type { Game, GameStatus, GameTeam } from '../data/gamesMock';

const statusConfig: Record<GameStatus, { label: string; className: string; icon: typeof Clock }> = {
  scheduled: {
    label: 'Scheduled',
    className: 'border-sky-300/30 bg-sky-400/10 text-sky-100',
    icon: Clock,
  },
  live: {
    label: 'Live',
    className: 'border-red-300/40 bg-red-500/15 text-red-100',
    icon: Radio,
  },
  final: {
    label: 'Final',
    className: 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100',
    icon: Trophy,
  },
};

function TeamRow({
  team,
  isWinner,
  showScore,
}: {
  team: GameTeam;
  isWinner: boolean;
  showScore: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-3 py-3 transition ${
        isWinner ? 'bg-white/[0.06]' : 'bg-white/[0.025]'
      }`}
    >
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-lg border text-sm font-bold ${
          isWinner
            ? 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100'
            : 'border-white/10 bg-zinc-950/80 text-zinc-300'
        }`}
      >
        {team.abbreviation}
      </span>
      <div className="min-w-0 flex-1">
        <p className={`truncate font-semibold ${isWinner ? 'text-white' : 'text-zinc-200'}`}>
          {team.city} {team.name}
        </p>
        <p className="mt-0.5 text-xs text-zinc-500">{team.record ?? 'Record unavailable'}</p>
      </div>
      {showScore ? (
        <span className={`text-3xl font-bold tabular-nums ${isWinner ? 'text-white' : 'text-zinc-500'}`}>
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
  const config = statusConfig[game.status];
  const StatusIcon = config.icon;
  const winner = getWinner(game);
  const showScore = game.status !== 'scheduled';
  const liveDetail = game.status === 'live' && game.period && game.clock ? `${game.period} - ${game.clock}` : null;

  return (
    <article className="rounded-lg border border-white/10 bg-zinc-900/80 p-5 shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:border-red-400/40 hover:bg-zinc-900">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-2 rounded-lg border px-2.5 py-1 text-xs font-semibold ${config.className}`}>
            <StatusIcon className="size-3.5" aria-hidden="true" />
            {config.label}
          </span>
          <span className="text-sm font-medium text-zinc-300">{liveDetail ?? game.time}</span>
        </div>
        <p className="text-sm text-zinc-500">
          {game.awayTeam.abbreviation} at {game.homeTeam.abbreviation}
        </p>
      </div>

      <div className="mt-4 space-y-3">
        <TeamRow team={game.awayTeam} isWinner={winner === 'away'} showScore={showScore} />
        <TeamRow team={game.homeTeam} isWinner={winner === 'home'} showScore={showScore} />
      </div>

      <div className="mt-4 flex flex-col gap-2 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-red-300" aria-hidden="true" />
          <span>
            {game.arena} - {game.city}
          </span>
        </div>
        {game.notes ? <p className="text-zinc-500">{game.notes}</p> : null}
      </div>
    </article>
  );
}
