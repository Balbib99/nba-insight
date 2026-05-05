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
    description: 'Favorites and standings cache are stored server-side with relational constraints.',
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
    detail: 'Favorites and integration cache',
    icon: Database,
  },
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
  'Auth and user accounts',
  'PostgreSQL cache dashboard',
  'Advanced player trends',
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
    <div>
      <p className="text-sm font-semibold text-red-300">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-normal text-white">{title}</h2>
      {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">{description}</p> : null}
    </div>
  );
}

export function HomePage() {
  return (
    <div className="bg-zinc-950">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.24),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.18),_transparent_30%),linear-gradient(135deg,_rgba(39,39,42,0.95),_rgba(9,9,11,1)_66%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-1 text-sm font-semibold text-red-100">
                <BarChart3 className="size-4" aria-hidden="true" />
                Full-stack NBA analytics platform
              </div>
              <h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-normal text-white sm:text-6xl lg:text-7xl">
                NBA Insight
              </h1>
              <p className="mt-5 max-w-2xl text-xl font-semibold leading-8 text-zinc-100">
                Full-stack NBA analytics platform
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                Explore NBA teams, players, historical analytics, playoffs and data-driven comparisons.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/analytics"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                >
                  Explore Analytics
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/playoffs"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 hover:text-white"
                >
                  View Playoffs
                </Link>
                <Link
                  to="/compare"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 hover:text-white"
                >
                  Compare Players
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-zinc-950/70 p-5 shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-zinc-400">Platform snapshot</p>
                  <p className="mt-1 text-2xl font-semibold text-white">Production-shaped demo</p>
                </div>
                <span className="rounded-lg bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Full stack
                </span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-white/[0.04] p-4">
                  <p className="text-2xl font-semibold text-white">React</p>
                  <p className="mt-1 text-xs text-zinc-500">Frontend</p>
                </div>
                <div className="rounded-lg bg-white/[0.04] p-4">
                  <p className="text-2xl font-semibold text-white">Node</p>
                  <p className="mt-1 text-xs text-zinc-500">Gateway</p>
                </div>
                <div className="rounded-lg bg-white/[0.04] p-4">
                  <p className="text-2xl font-semibold text-white">Python</p>
                  <p className="mt-1 text-xs text-zinc-500">Service</p>
                </div>
              </div>
              <div className="mt-5 rounded-lg bg-white/[0.04] p-4">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-300">Data pipeline coverage</span>
                  <span className="text-red-200">Gateway-first</span>
                </div>
                <div className="space-y-3">
                  {['Frontend views', 'Node API', 'PostgreSQL cache', 'Python analytics', 'External providers'].map(
                    (item, index) => (
                      <div key={item} className="flex items-center gap-3">
                        <span className="flex size-7 items-center justify-center rounded-lg bg-red-500/15 text-xs font-bold text-red-200">
                          {index + 1}
                        </span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-sky-300" />
                        </div>
                        <span className="w-32 text-right text-xs font-medium text-zinc-300">{item}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
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
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {demonstrations.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="rounded-lg border border-white/10 bg-zinc-900/80 p-5 shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:border-red-400/50 hover:bg-zinc-900"
            >
              <span className="flex size-11 items-center justify-center rounded-lg bg-red-500/15 text-red-300">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-zinc-900/30">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <SectionHeading
            eyebrow="Data Sources"
            title="Multiple data layers with clear ownership"
            description="Each data source has a specific role so the app can keep working even when current-season providers are limited."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {dataSources.map(({ name, detail, icon: Icon }) => (
              <article key={name} className="rounded-lg border border-white/10 bg-zinc-950/70 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-red-300">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{name}</h3>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">{detail}</p>
                  </div>
                </div>
              </article>
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
          <div className="grid min-w-[980px] grid-cols-5 gap-3">
            {architectureNodes.map(({ label, description, icon: Icon }, index) => (
              <div key={label} className="relative">
                <article className="h-full rounded-lg border border-white/10 bg-zinc-900/80 p-4 shadow-xl shadow-black/20">
                  <span className="flex size-11 items-center justify-center rounded-lg bg-white/[0.06] text-red-300">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-white">{label}</h3>
                  <p className="mt-2 text-xs leading-5 text-zinc-400">{description}</p>
                </article>
                {index < architectureNodes.length - 1 ? (
                  <div className="absolute right-[-18px] top-1/2 z-10 hidden -translate-y-1/2 text-zinc-600 xl:block">
                    <ArrowRight className="size-5" aria-hidden="true" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-zinc-900/30">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading
              eyebrow="Current Limitations"
              title="Transparent production constraints"
              description="The project makes realistic tradeoffs around sports data availability while preserving a clean path to production."
            />
            <div className="mt-5 space-y-3">
              {limitations.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-lg border border-white/10 bg-zinc-950/70 p-4">
                  <Lock className="mt-0.5 size-4 shrink-0 text-amber-200" aria-hidden="true" />
                  <p className="text-sm leading-6 text-zinc-300">{item}</p>
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
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {roadmap.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg border border-white/10 bg-zinc-950/70 p-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-200">
                    <CheckCircle2 className="size-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium text-zinc-200">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 rounded-lg border border-white/10 bg-zinc-900/80 p-6 shadow-xl shadow-black/20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-red-300">Recruiter-friendly walkthrough</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Start with analytics, then inspect the full app.</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/analytics"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
            >
              Open Analytics
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              to="/teams"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 hover:text-white"
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
