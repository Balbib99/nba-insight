import { AlertCircle, ArrowRightLeft, Loader2, Scale, UserRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ComparisonSummary } from '../components/ComparisonSummary';
import { ComparisonTable, type ComparisonMetric } from '../components/ComparisonTable';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { FavoriteButton } from '../components/FavoriteButton';
import { PlayerSelector } from '../components/PlayerSelector';
import { getPlayers, getStatsByPlayerId } from '../services/nbaService';
import type { Player } from '../types/player';
import type { PlayerStats } from '../types/playerStats';

interface SelectedStats {
  playerAStats: PlayerStats | null;
  playerBStats: PlayerStats | null;
}

function buildComparisonMetrics(playerAStats: PlayerStats, playerBStats: PlayerStats): ComparisonMetric[] {
  return [
    {
      label: 'PPG',
      playerAValue: playerAStats.pointsPerGame,
      playerBValue: playerBStats.pointsPerGame,
    },
    {
      label: 'RPG',
      playerAValue: playerAStats.reboundsPerGame,
      playerBValue: playerBStats.reboundsPerGame,
    },
    {
      label: 'APG',
      playerAValue: playerAStats.assistsPerGame,
      playerBValue: playerBStats.assistsPerGame,
    },
    {
      label: 'SPG',
      playerAValue: playerAStats.stealsPerGame,
      playerBValue: playerBStats.stealsPerGame,
    },
    {
      label: 'BPG',
      playerAValue: playerAStats.blocksPerGame,
      playerBValue: playerBStats.blocksPerGame,
    },
    {
      label: 'FG%',
      playerAValue: playerAStats.fieldGoalPct,
      playerBValue: playerBStats.fieldGoalPct,
      suffix: '%',
    },
    {
      label: '3PT%',
      playerAValue: playerAStats.threePointPct,
      playerBValue: playerBStats.threePointPct,
      suffix: '%',
    },
    {
      label: 'FT%',
      playerAValue: playerAStats.freeThrowPct,
      playerBValue: playerBStats.freeThrowPct,
      suffix: '%',
    },
    {
      label: 'MPG',
      playerAValue: playerAStats.minutesPerGame,
      playerBValue: playerBStats.minutesPerGame,
    },
  ];
}

function PlayerProfilePanel({ player }: { player: Player }) {
  return (
    <article className="rounded-lg border border-white/10 bg-zinc-900/80 p-5 shadow-xl shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-red-300">{player.teamName}</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">{player.fullName}</h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="flex size-11 items-center justify-center rounded-lg bg-red-500/15 text-sm font-bold text-red-200">
            {player.position}
          </span>
          <FavoriteButton player={player} />
        </div>
      </div>
      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-white/[0.04] p-3">
          <dt className="text-xs text-zinc-500">Age</dt>
          <dd className="mt-1 font-semibold text-white">{player.age}</dd>
        </div>
        <div className="rounded-lg bg-white/[0.04] p-3">
          <dt className="text-xs text-zinc-500">Country</dt>
          <dd className="mt-1 font-semibold text-white">{player.country}</dd>
        </div>
        <div className="rounded-lg bg-white/[0.04] p-3">
          <dt className="text-xs text-zinc-500">Team</dt>
          <dd className="mt-1 font-semibold text-white">{player.teamName}</dd>
        </div>
      </dl>
    </article>
  );
}

export function Compare() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerAId, setPlayerAId] = useState('');
  const [playerBId, setPlayerBId] = useState('');
  const [selectedStats, setSelectedStats] = useState<SelectedStats>({
    playerAStats: null,
    playerBStats: null,
  });
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPlayers() {
      try {
        setIsLoadingPlayers(true);
        setError(null);
        const loadedPlayers = await getPlayers();

        if (isMounted) {
          setPlayers(loadedPlayers);
        }
      } catch {
        if (isMounted) {
          setError('Players could not be loaded. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingPlayers(false);
        }
      }
    }

    void loadPlayers();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadSelectedStats() {
      if (!playerAId || !playerBId) {
        setSelectedStats({ playerAStats: null, playerBStats: null });
        return;
      }

      try {
        setIsLoadingStats(true);
        setError(null);
        const [playerAStats, playerBStats] = await Promise.all([
          getStatsByPlayerId(playerAId),
          getStatsByPlayerId(playerBId),
        ]);

        if (isMounted) {
          if (!playerAStats || !playerBStats) {
            setError('Statistics were not found for one of the selected players.');
            setSelectedStats({ playerAStats: playerAStats ?? null, playerBStats: playerBStats ?? null });
            return;
          }

          setSelectedStats({ playerAStats, playerBStats });
        }
      } catch {
        if (isMounted) {
          setError('Comparison stats could not be loaded. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingStats(false);
        }
      }
    }

    void loadSelectedStats();

    return () => {
      isMounted = false;
    };
  }, [playerAId, playerBId]);

  const playerA = useMemo(() => players.find((player) => player.id === playerAId) ?? null, [playerAId, players]);
  const playerB = useMemo(() => players.find((player) => player.id === playerBId) ?? null, [playerBId, players]);

  const comparisonMetrics = useMemo(() => {
    if (!selectedStats.playerAStats || !selectedStats.playerBStats) {
      return [];
    }

    return buildComparisonMetrics(selectedStats.playerAStats, selectedStats.playerBStats);
  }, [selectedStats]);

  const hasCompleteSelection = Boolean(playerA && playerB && selectedStats.playerAStats && selectedStats.playerBStats);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900/70 shadow-2xl shadow-black/30">
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.26),_transparent_34%),linear-gradient(135deg,_rgba(39,39,42,0.96),_rgba(9,9,11,1)_65%)]" />
          <div className="relative px-5 py-8 sm:px-8 lg:px-10">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-red-300">Compare</p>
              <DataSourceBadge source="mock" />
            </div>
            <h1 className="mt-3 text-4xl font-bold tracking-normal text-white sm:text-5xl">
              Player Comparison Lab
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-300 sm:text-base">
              Select two NBA players and compare their mock statistical profiles side by side with automatic category winners and scouting-style summary.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.03] p-4 shadow-xl shadow-black/20">
        {isLoadingPlayers ? (
          <div className="flex min-h-32 items-center justify-center">
            <div className="flex items-center gap-3 text-sm font-medium text-zinc-300">
              <Loader2 className="size-5 animate-spin text-red-300" aria-hidden="true" />
              Loading player selectors
            </div>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
            <PlayerSelector
              id="player-a"
              label="Player A"
              players={players}
              value={playerAId}
              onChange={setPlayerAId}
            />
            <div className="hidden h-12 items-center justify-center text-zinc-500 lg:flex">
              <ArrowRightLeft className="size-5" aria-hidden="true" />
            </div>
            <PlayerSelector
              id="player-b"
              label="Player B"
              players={players.filter((player) => player.id !== playerAId)}
              value={playerBId}
              onChange={setPlayerBId}
            />
          </div>
        )}
      </div>

      {error ? (
        <div className="mt-8 rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-sm text-red-100">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-white">Unable to compare players</h2>
              <p className="mt-1 text-red-100/80">{error}</p>
            </div>
          </div>
        </div>
      ) : null}

      {!isLoadingPlayers && !playerAId || (!isLoadingPlayers && !playerBId) ? (
        <div className="mt-8 rounded-lg border border-white/10 bg-zinc-900/70 p-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-red-500/15 text-red-300">
            <Scale className="size-6" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-white">Select two players to compare</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
            Choose a player on each side to unlock the head-to-head statistical breakdown.
          </p>
        </div>
      ) : null}

      {isLoadingStats ? (
        <div className="mt-8 flex min-h-48 items-center justify-center rounded-lg border border-white/10 bg-zinc-900/70">
          <div className="flex items-center gap-3 text-sm font-medium text-zinc-300">
            <Loader2 className="size-5 animate-spin text-red-300" aria-hidden="true" />
            Loading comparison
          </div>
        </div>
      ) : null}

      {!isLoadingStats && hasCompleteSelection && playerA && playerB && selectedStats.playerAStats && selectedStats.playerBStats ? (
        <div className="mt-8 space-y-8">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
            <PlayerProfilePanel player={playerA} />
            <div className="hidden items-center justify-center px-2 text-zinc-500 lg:flex">
              <UserRound className="size-6" aria-hidden="true" />
            </div>
            <PlayerProfilePanel player={playerB} />
          </div>

          <ComparisonSummary
            playerA={playerA}
            playerB={playerB}
            playerAStats={selectedStats.playerAStats}
            playerBStats={selectedStats.playerBStats}
          />

          <ComparisonTable playerAName={playerA.fullName} playerBName={playerB.fullName} metrics={comparisonMetrics} />
        </div>
      ) : null}
    </section>
  );
}
