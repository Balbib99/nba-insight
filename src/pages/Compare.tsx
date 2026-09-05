import { AlertCircle, ArrowRightLeft, Loader2, Scale, UserRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ComparisonSummary } from '../components/ComparisonSummary';
import { ComparisonTable, type ComparisonMetric } from '../components/ComparisonTable';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { FavoriteButton } from '../components/FavoriteButton';
import { PageHero } from '../components/PageHero';
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
    { label: 'PPG', playerAValue: playerAStats.pointsPerGame, playerBValue: playerBStats.pointsPerGame },
    { label: 'RPG', playerAValue: playerAStats.reboundsPerGame, playerBValue: playerBStats.reboundsPerGame },
    { label: 'APG', playerAValue: playerAStats.assistsPerGame, playerBValue: playerBStats.assistsPerGame },
    { label: 'SPG', playerAValue: playerAStats.stealsPerGame, playerBValue: playerBStats.stealsPerGame },
    { label: 'BPG', playerAValue: playerAStats.blocksPerGame, playerBValue: playerBStats.blocksPerGame },
    { label: 'FG%', playerAValue: playerAStats.fieldGoalPct, playerBValue: playerBStats.fieldGoalPct, suffix: '%' },
    { label: '3PT%', playerAValue: playerAStats.threePointPct, playerBValue: playerBStats.threePointPct, suffix: '%' },
    { label: 'FT%', playerAValue: playerAStats.freeThrowPct, playerBValue: playerBStats.freeThrowPct, suffix: '%' },
    { label: 'MPG', playerAValue: playerAStats.minutesPerGame, playerBValue: playerBStats.minutesPerGame },
  ];
}

function PlayerProfilePanel({ player }: { player: Player }) {
  return (
    <article className="border-t border-rule bg-ink-900 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ledger-blue">{player.teamName}</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-text-primary">{player.fullName}</h2>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="font-display text-2xl font-bold text-score-orange">{player.position}</span>
          <FavoriteButton player={player} />
        </div>
      </div>
      <dl className="mt-5 grid grid-cols-3 divide-x divide-rule border-t border-rule pt-4 text-sm">
        <div className="px-2 text-center">
          <dt className="text-xs text-text-secondary">Age</dt>
          <dd className="mt-1 font-display text-base font-semibold text-text-primary">{player.age}</dd>
        </div>
        <div className="px-2 text-center">
          <dt className="text-xs text-text-secondary">Country</dt>
          <dd className="mt-1 font-display text-base font-semibold text-text-primary">{player.country}</dd>
        </div>
        <div className="px-2 text-center">
          <dt className="text-xs text-text-secondary">Team</dt>
          <dd className="mt-1 font-display text-base font-semibold text-text-primary">{player.teamName}</dd>
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
      <PageHero
        eyebrow="Compare"
        title="Player Comparison Lab"
        description="Select two NBA players and compare their mock statistical profiles side by side with automatic category winners and scouting-style summary."
      />
      <div className="mt-4">
        <DataSourceBadge source="mock" />
      </div>

      <div className="mt-8 border-t border-rule bg-ink-900 p-4">
        {isLoadingPlayers ? (
          <div className="flex min-h-32 items-center justify-center">
            <div className="flex items-center gap-3 text-sm font-medium text-text-secondary">
              <Loader2 className="size-5 animate-spin text-score-orange" aria-hidden="true" />
              Loading player selectors
            </div>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
            <PlayerSelector id="player-a" label="Player A" players={players} value={playerAId} onChange={setPlayerAId} />
            <div className="hidden h-12 items-center justify-center text-text-secondary lg:flex">
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
        <div className="mt-8 border border-down/30 bg-down/10 p-5 text-sm text-text-primary">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-down" aria-hidden="true" />
            <div>
              <h2 className="font-display text-base font-semibold text-text-primary">Unable to compare players</h2>
              <p className="mt-1 text-text-secondary">{error}</p>
            </div>
          </div>
        </div>
      ) : null}

      {(!isLoadingPlayers && !playerAId) || (!isLoadingPlayers && !playerBId) ? (
        <div className="mt-8 border border-rule bg-ink-900 p-8 text-center">
          <Scale className="mx-auto size-8 text-text-secondary" aria-hidden="true" />
          <h2 className="mt-5 font-display text-xl font-semibold text-text-primary">Select two players to compare</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
            Choose a player on each side to unlock the head-to-head statistical breakdown.
          </p>
        </div>
      ) : null}

      {isLoadingStats ? (
        <div className="mt-8 flex min-h-48 items-center justify-center border border-rule bg-ink-900">
          <div className="flex items-center gap-3 text-sm font-medium text-text-secondary">
            <Loader2 className="size-5 animate-spin text-score-orange" aria-hidden="true" />
            Loading comparison
          </div>
        </div>
      ) : null}

      {!isLoadingStats && hasCompleteSelection && playerA && playerB && selectedStats.playerAStats && selectedStats.playerBStats ? (
        <div className="mt-8 space-y-8">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
            <PlayerProfilePanel player={playerA} />
            <div className="hidden items-center justify-center px-2 text-text-secondary lg:flex">
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
