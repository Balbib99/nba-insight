import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Code2,
  Database,
  GitBranch,
  Layers,
  LineChart,
  Lock,
  Network,
  Server,
  Trophy,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DataModeBadge } from '../components/DataModeBadge';

const demonstrations = [
  {
    title: 'Full-stack architecture',
    description: 'React, Node/Express, PostgreSQL and Python services composed as one product.',
    icon: Layers,
  },
  {
    title: 'Real historical NBA data',
    description: 'Analytics can consume nba_api league leader data through a backend gateway.',
    icon: LineChart,
  },
  {
    title: 'PostgreSQL persistence',
    description: 'The backend is prepared for account-based favorites and standings cache with relational constraints.',
    icon: Database,
  },
  {
    title: 'Python microservice',
    description: 'FastAPI isolates nba_api workflows from the main Node application.',
    icon: Code2,
  },
  {
    title: 'API gateway pattern',
    description: 'The frontend only talks to Node, keeping external integrations behind the backend.',
    icon: Network,
  },
  {
    title: 'Responsive dashboard UI',
    description: 'Dense NBA views, comparison tools and tables adapt across mobile and desktop.',
    icon: BarChart3,
  },
];

const dataSources = [
  {
    name: 'nba_api',
    detail: 'Historical stats and league leaders',
    icon: LineChart,
  },
  {
    name: 'API-Sports Basketball',
    detail: 'Standings and schedule provider prepared',
    icon: CalendarDays,
  },
  {
    name: 'Local historical data',
    detail: 'Playoffs, champions and Finals paths',
    icon: Trophy,
  },
  {
    name: 'PostgreSQL',
    detail: 'Account favorites and integration cache foundation',
    icon: Database,
  },
];

const stackRows = [
  { layer: 'Frontend views', tech: 'React' },
  { layer: 'Node API', tech: 'Node / Express' },
  { layer: 'PostgreSQL cache', tech: 'PostgreSQL' },
  { layer: 'Python analytics', tech: 'FastAPI' },
  { layer: 'External providers', tech: 'nba_api / API-Sports' },
];

const architectureNodes = [
  { label: 'Frontend React', description: 'Vite, TypeScript, Tailwind', icon: Code2 },
  { label: 'Node/Express API Gateway', description: 'REST API and service orchestration', icon: Server },
  { label: 'PostgreSQL', description: 'Favorites and cache storage', icon: Database },
  { label: 'Python nba-service', description: 'FastAPI + nba_api adapter', icon: GitBranch },
  { label: 'External NBA APIs', description: 'nba_api and API-Sports providers', icon: Network },
];

const limitations = [
  'Current-season live data depends on paid sports data providers.',
  'Public demo uses historical/demo data where needed.',
  'Architecture is prepared for real-time data integration.',
];

const roadmap = [
  'Games/Schedule page',
  'Real-time standings provider',
  'Favorites dual storage by auth mode',
  'PostgreSQL cache dashboard',
  'Advanced player trends',
];

const architectureStatus = [
  'Frontend deployed on Vercel from the stable main branch',
  'Backend Node/Express prepared for cloud deployment',
  'PostgreSQL prepared for authenticated favorites and cache',
  'API-BASKETBALL used through backend only',
  'nba_api used through Python service only',
  'Public demo supports mock/hybrid data mode',
  'Demo Mode: full public portfolio experience, with favorites stored locally in this browser',
  'Account Mode: authenticated users have persistent favorites stored in PostgreSQL by account',
];

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="border-t border-rule pt-6">
      <p className="font-body text-sm text-text-secondary">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl font-semibold text-text-primary">{title}</h2>
      {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">{description}</p> : null}
    </div>
  );
}

export function HomePage() {
  return (
    <div className="bg-ink-950">
      <section className="relative overflow-hidden border-b border-rule">
        <div
          className="scorebug-reveal absolute inset-0 bg-[linear-gradient(105deg,transparent_58%,rgba(255,107,26,0.10)_58%,rgba(255,107,26,0.10)_64%,transparent_64%,transparent_82%,rgba(47,211,201,0.06)_82%,rgba(47,211,201,0.06)_86%,transparent_86%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <DataModeBadge variant="full" />
              <h1 className="mt-6 max-w-4xl font-display text-6xl font-bold leading-[0.95] tracking-tight text-text-primary sm:text-7xl lg:text-8xl">
                NBA Insight
              </h1>
              <p className="mt-5 max-w-2xl font-body text-xl font-medium leading-8 text-text-primary/90">
                Full-stack NBA analytics platform
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary sm:text-base">
                Explore NBA teams, players, historical analytics, playoffs and data-driven comparisons.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/analytics"
                  className="inline-flex h-11 items-center justify-center gap-2 bg-score-orange px-4 font-body text-sm font-semibold text-ink-950 transition-colors hover:bg-score-orange/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-cyan/60"
                >
                  Explore Analytics
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/playoffs"
                  className="inline-flex h-11 items-center justify-center gap-2 border border-rule px-4 font-body text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-cyan/60"
                >
                  View Playoffs
                </Link>
                <Link
                  to="/compare"
                  className="inline-flex h-11 items-center justify-center gap-2 border border-rule px-4 font-body text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-cyan/60"
                >
                  Compare Players
                </Link>
              </div>
            </div>

            <div className="relative border border-rule bg-ink-900 p-6">
              <div className="absolute -top-[3px] left-6 h-[3px] w-14 -skew-x-[20deg] bg-score-orange" aria-hidden="true" />
              <p className="font-body text-sm text-text-secondary">Platform snapshot</p>
              <p className="mt-1 font-display text-2xl font-semibold text-text-primary">Production-shaped demo</p>
              <dl className="mt-6 divide-y divide-rule border-t border-rule">
                {stackRows.map(({ layer, tech }) => (
                  <div key={layer} className="flex items-center justify-between py-3">
                    <dt className="text-sm text-text-secondary">{layer}</dt>
                    <dd className="font-display text-lg font-semibold text-text-primary">{tech}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What this project demonstrates"
          title="A real product architecture, not just screens"
          description="NBA Insight is built to show frontend polish, backend boundaries, persistence, service orchestration and practical API integration decisions."
        />
        <div className="mt-6 divide-y divide-rule border-y border-rule">
          {demonstrations.map(({ title, description, icon: Icon }) => (
            <div key={title} className="grid gap-2 py-5 sm:grid-cols-[260px_1fr] sm:items-start sm:gap-8">
              <div className="flex items-center gap-3">
                <Icon className="size-4 shrink-0 text-score-orange" aria-hidden="true" />
                <h3 className="font-display text-lg font-semibold text-text-primary">{title}</h3>
              </div>
              <p className="text-sm leading-6 text-text-secondary">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-rule-paper bg-paper-100">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="font-body text-sm text-ledger-ink/85">Data Sources</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ledger-ink">
              Multiple data layers with clear ownership
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ledger-ink/85">
              Each data source has a specific role so the app can keep working even when current-season providers are
              limited.
            </p>
          </div>
          <div className="divide-y divide-rule-paper border-t border-rule-paper sm:grid sm:grid-cols-2 sm:gap-x-8 sm:divide-y-0 sm:border-t-0">
            {dataSources.map(({ name, detail, icon: Icon }) => (
              <div key={name} className="flex items-start gap-3 border-rule-paper py-4 sm:border-t sm:py-5">
                <Icon className="mt-0.5 size-4 shrink-0 text-ledger-ink" aria-hidden="true" />
                <div>
                  <h3 className="font-display text-base font-semibold text-ledger-ink">{name}</h3>
                  <p className="mt-1 text-sm leading-6 text-ledger-ink/85">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Architecture Overview"
          title="Gateway-first data flow"
          description="The browser stays simple and secure: it talks to Node, while Node coordinates persistence, Python services and external providers."
        />
        <div className="mt-6 overflow-x-auto">
          <div className="grid min-w-[980px] grid-cols-5 divide-x divide-rule border-y border-rule">
            {architectureNodes.map(({ label, description, icon: Icon }, index) => (
              <div key={label} className="relative p-4">
                <Icon className="size-4 text-score-orange" aria-hidden="true" />
                <h3 className="mt-4 font-display text-base font-semibold text-text-primary">{label}</h3>
                <p className="mt-2 text-xs leading-5 text-text-secondary">{description}</p>
                {index < architectureNodes.length - 1 ? (
                  <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-text-secondary xl:block">
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-rule bg-ink-900/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <SectionHeading
            eyebrow="Current Architecture Status"
            title="Ready for staged production deployment"
            description="The frontend can run independently today, while backend services remain isolated for the next cloud deployment phase."
          />
          <div className="divide-y divide-rule border-t border-rule sm:grid sm:grid-cols-2 sm:gap-x-8 sm:divide-y-0 sm:border-t-0">
            {architectureStatus.map((item) => (
              <div key={item} className="flex items-start gap-3 border-rule py-4 sm:border-t sm:py-4">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-live-cyan" aria-hidden="true" />
                <p className="text-sm leading-6 text-text-secondary">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading
              eyebrow="Current Limitations"
              title="Transparent production constraints"
              description="The project makes realistic tradeoffs around sports data availability while preserving a clean path to production."
            />
            <div className="mt-5 divide-y divide-rule border-t border-rule">
              {limitations.map((item) => (
                <div key={item} className="flex items-start gap-3 py-4">
                  <Lock className="mt-0.5 size-4 shrink-0 text-text-secondary" aria-hidden="true" />
                  <p className="text-sm leading-6 text-text-secondary">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="Roadmap"
              title="Next practical milestones"
              description="The next phases would turn the platform into a richer product without changing its core architecture."
            />
            <div className="mt-5 divide-y divide-rule border-t border-rule">
              {roadmap.map((item) => (
                <div key={item} className="flex items-center gap-3 py-4">
                  <CheckCircle2 className="size-4 shrink-0 text-live-cyan" aria-hidden="true" />
                  <span className="text-sm font-medium text-text-primary">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 border-t border-rule pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-body text-sm text-text-secondary">Recruiter-friendly walkthrough</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-text-primary">
              Start with analytics, then inspect the full app.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/analytics"
              className="inline-flex h-11 items-center justify-center gap-2 bg-score-orange px-4 font-body text-sm font-semibold text-ink-950 transition-colors hover:bg-score-orange/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-cyan/60"
            >
              Open Analytics
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              to="/teams"
              className="inline-flex h-11 items-center justify-center gap-2 border border-rule px-4 font-body text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-cyan/60"
            >
              Browse Teams
              <Users className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
