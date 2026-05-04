import { AlertCircle, Loader2, RotateCcw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { PlayerCard } from '../components/PlayerCard';
import { SearchInput } from '../components/SearchInput';
import { SelectFilter, type SelectOption } from '../components/SelectFilter';
import { getPlayers } from '../services/nbaService';
import type { Player, PlayerPosition } from '../types/player';

const allValue = 'all';

const positionOptions: SelectOption[] = [
  { label: 'All positions', value: allValue },
  { label: 'Point Guard', value: 'PG' },
  { label: 'Shooting Guard', value: 'SG' },
  { label: 'Small Forward', value: 'SF' },
  { label: 'Power Forward', value: 'PF' },
  { label: 'Center', value: 'C' },
];

export function Players() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [position, setPosition] = useState<PlayerPosition | typeof allValue>(allValue);
  const [teamId, setTeamId] = useState(allValue);

  useEffect(() => {
    let isMounted = true;

    async function loadPlayers() {
      try {
        setIsLoading(true);
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
          setIsLoading(false);
        }
      }
    }

    void loadPlayers();

    return () => {
      isMounted = false;
    };
  }, []);

  const teamOptions = useMemo<SelectOption[]>(() => {
    const teams = Array.from(
      new Map(players.map((player) => [player.teamId, player.teamName])).entries(),
    ).sort(([, teamA], [, teamB]) => teamA.localeCompare(teamB));

    return [
      { label: 'All teams', value: allValue },
      ...teams.map(([id, name]) => ({
        label: name,
        value: id,
      })),
    ];
  }, [players]);

  const filteredPlayers = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    return players.filter((player) => {
      const matchesSearch =
        normalizedSearchTerm.length === 0 ||
        player.firstName.toLowerCase().includes(normalizedSearchTerm) ||
        player.lastName.toLowerCase().includes(normalizedSearchTerm) ||
        player.fullName.toLowerCase().includes(normalizedSearchTerm) ||
        player.teamName.toLowerCase().includes(normalizedSearchTerm);

      const matchesPosition = position === allValue || player.position === position;
      const matchesTeam = teamId === allValue || player.teamId === teamId;

      return matchesSearch && matchesPosition && matchesTeam;
    });
  }, [players, position, searchTerm, teamId]);

  function resetFilters() {
    setSearchTerm('');
    setPosition(allValue);
    setTeamId(allValue);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-red-300">Players</p>
          <h1 className="mt-2 text-3xl font-bold text-white">NBA Players</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Explore a curated mock player dataset through the same service layer that can later connect to a real NBA API.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DataSourceBadge source="mock" />
          <span className="w-fit rounded-full border border-white/10 px-3 py-1 text-sm font-medium text-zinc-300">
            {isLoading ? 'Loading players' : `${filteredPlayers.length} of ${players.length} players`}
          </span>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.03] p-4 shadow-xl shadow-black/20">
        <div className="grid gap-4 lg:grid-cols-[1fr_210px_240px_auto] lg:items-end">
          <SearchInput
            id="player-search"
            label="Search"
            placeholder="Search by player or team"
            value={searchTerm}
            onChange={setSearchTerm}
          />
          <SelectFilter
            id="position-filter"
            label="Position"
            options={positionOptions}
            value={position}
            onChange={(value) => setPosition(value as PlayerPosition | typeof allValue)}
          />
          <SelectFilter
            id="team-filter"
            label="Team"
            options={teamOptions}
            value={teamId}
            onChange={setTeamId}
          />
          <button
            className="flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-medium text-zinc-200 transition hover:bg-white/10 hover:text-white"
            type="button"
            onClick={resetFilters}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-8 flex min-h-64 items-center justify-center rounded-lg border border-white/10 bg-zinc-900/70">
          <div className="flex items-center gap-3 text-sm font-medium text-zinc-300">
            <Loader2 className="size-5 animate-spin text-red-300" aria-hidden="true" />
            Loading NBA players
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="mt-8 rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-sm text-red-100">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-white">Unable to load players</h2>
              <p className="mt-1 text-red-100/80">{error}</p>
            </div>
          </div>
        </div>
      ) : null}

      {!isLoading && !error && filteredPlayers.length === 0 ? (
        <div className="mt-8 rounded-lg border border-white/10 bg-zinc-900/70 p-8 text-center">
          <h2 className="text-xl font-semibold text-white">No players found</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
            Try another search term or reset the filters.
          </p>
          <button
            className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
            type="button"
            onClick={resetFilters}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset filters
          </button>
        </div>
      ) : null}

      {!isLoading && !error && filteredPlayers.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredPlayers.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
