import { AlertCircle, Loader2, RotateCcw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { PageHero } from '../components/PageHero';
import { SearchInput } from '../components/SearchInput';
import { SelectFilter, type SelectOption } from '../components/SelectFilter';
import { TeamCard } from '../components/TeamCard';
import { getTeams } from '../services/nbaService';
import type { Conference, Division, Team } from '../types/team';

const allValue = 'all';

const conferenceOptions: SelectOption[] = [
  { label: 'All', value: allValue },
  { label: 'East', value: 'East' },
  { label: 'West', value: 'West' },
];

export function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [conference, setConference] = useState<Conference | typeof allValue>(allValue);
  const [division, setDivision] = useState<Division | typeof allValue>(allValue);

  useEffect(() => {
    let isMounted = true;

    async function loadTeams() {
      try {
        setIsLoading(true);
        setError(null);
        const loadedTeams = await getTeams();

        if (isMounted) {
          setTeams(loadedTeams);
        }
      } catch {
        if (isMounted) {
          setError('Teams could not be loaded. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadTeams();

    return () => {
      isMounted = false;
    };
  }, []);

  const divisionOptions = useMemo<SelectOption[]>(() => {
    const divisions = Array.from(new Set(teams.map((team) => team.division))).sort();

    return [
      { label: 'All divisions', value: allValue },
      ...divisions.map((teamDivision) => ({
        label: teamDivision,
        value: teamDivision,
      })),
    ];
  }, [teams]);

  const filteredTeams = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    return teams.filter((team) => {
      const matchesSearch =
        normalizedSearchTerm.length === 0 ||
        team.name.toLowerCase().includes(normalizedSearchTerm) ||
        team.city.toLowerCase().includes(normalizedSearchTerm) ||
        team.fullName.toLowerCase().includes(normalizedSearchTerm) ||
        team.abbreviation.toLowerCase().includes(normalizedSearchTerm);

      const matchesConference = conference === allValue || team.conference === conference;
      const matchesDivision = division === allValue || team.division === division;

      return matchesSearch && matchesConference && matchesDivision;
    });
  }, [conference, division, searchTerm, teams]);

  function resetFilters() {
    setSearchTerm('');
    setConference(allValue);
    setDivision(allValue);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHero
        eyebrow="Teams"
        title="NBA teams directory"
        description="Search and filter the full mock dataset through a service layer prepared for real NBA data."
        tags={[isLoading ? 'Loading teams' : `${filteredTeams.length} of ${teams.length} teams`]}
      />
      <div className="mt-4">
        <DataSourceBadge source="mock" />
      </div>

      <div className="mt-8 border-t border-rule bg-ink-900 p-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_180px_220px_auto] lg:items-end">
          <SearchInput
            id="team-search"
            label="Search"
            placeholder="Search by team, city or abbreviation"
            value={searchTerm}
            onChange={setSearchTerm}
          />
          <SelectFilter
            id="conference-filter"
            label="Conference"
            options={conferenceOptions}
            value={conference}
            onChange={(value) => setConference(value as Conference | typeof allValue)}
          />
          <SelectFilter
            id="division-filter"
            label="Division"
            options={divisionOptions}
            value={division}
            onChange={(value) => setDivision(value as Division | typeof allValue)}
          />
          <button
            className="flex h-11 items-center justify-center gap-2 border border-rule px-4 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-cyan/60"
            type="button"
            onClick={resetFilters}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-8 flex min-h-64 items-center justify-center border border-rule bg-ink-900">
          <div className="flex items-center gap-3 text-sm font-medium text-text-secondary">
            <Loader2 className="size-5 animate-spin text-score-orange" aria-hidden="true" />
            Loading NBA teams
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="mt-8 border border-down/30 bg-down/10 p-5 text-sm text-text-primary">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-down" aria-hidden="true" />
            <div>
              <h2 className="font-display text-base font-semibold text-text-primary">Unable to load teams</h2>
              <p className="mt-1 text-text-secondary">{error}</p>
            </div>
          </div>
        </div>
      ) : null}

      {!isLoading && !error && filteredTeams.length === 0 ? (
        <div className="mt-8 border border-rule bg-ink-900 p-8 text-center">
          <h2 className="font-display text-xl font-semibold text-text-primary">No teams found</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
            Try a different search term or clear one of the filters.
          </p>
          <button
            className="mt-5 inline-flex h-10 items-center justify-center gap-2 bg-score-orange px-4 text-sm font-semibold text-ink-950 transition-colors hover:bg-score-orange/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-cyan/60"
            type="button"
            onClick={resetFilters}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset filters
          </button>
        </div>
      ) : null}

      {!isLoading && !error && filteredTeams.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
