import {
  ArrowRight,
  BarChart3,
  Code2,
  Database,
  GitBranch,
  Layers,
  LineChart,
  Network,
  Route,
  Shield,
  Smartphone,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const highlights = [
  {
    title: 'Dynamic routing',
    description: 'Player and team detail pages use route params and service-layer data loading.',
    icon: Route,
  },
  {
    title: 'Player comparison',
    description: 'Side-by-side player comparison with automatic stat winners and generated summary.',
    icon: GitBranch,
  },
  {
    title: 'Detail pages',
    description: 'Dedicated views for players and teams with profile, roster, stats and analysis sections.',
    icon: Users,
  },
  {
    title: 'Analytics dashboard',
    description: 'Mock advanced rankings for scorers, playmakers, efficiency and league insights.',
    icon: LineChart,
  },
  {
    title: 'Responsive UI',
    description: 'Dashboard layouts built to work across mobile, tablet and desktop breakpoints.',
    icon: Smartphone,
  },
  {
    title: 'API-ready structure',
    description: 'Mock data is accessed through services so real NBA API data can replace it later.',
    icon: Network,
  },
];

const techStack = [
  'React',
  'Vite',
  'TypeScript',
  'Tailwind CSS',
  'React Router',
  'Mock data service layer',
];

const roadmap = [
  'Real NBA API integration',
  'Backend with Node/Express or similar',
  'PostgreSQL database',
  'Authentication',
  'User favorites',
  'Personalized dashboards',
  'Deployment pipeline',
];

export function HomePage() {
  return (
    <div className="bg-zinc-950">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.26),_transparent_32%),linear-gradient(135deg,_rgba(39,39,42,0.92),_rgba(9,9,11,1)_62%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-sm font-medium text-red-200">
                <BarChart3 className="size-4" aria-hidden="true" />
                Portfolio MVP
              </div>
              <h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-normal text-white sm:text-6xl lg:text-7xl">
                NBA Insight
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-200">
                A modern NBA analytics dashboard built with React, TypeScript and Tailwind CSS.
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                The app currently uses mock data to validate UI architecture, dynamic routing, local state,
                favorites persistence and analysis logic before connecting to real NBA data.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/players"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                >
                  Explore Players
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/compare"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 hover:text-white"
                >
                  Compare Players
                </Link>
                <Link
                  to="/analytics"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 hover:text-white"
                >
                  View Analytics
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-zinc-950/70 p-5 shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-zinc-400">Dashboard snapshot</p>
                  <p className="mt-1 text-2xl font-semibold text-white">Portfolio Demo</p>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Mock data
                </span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-white/[0.04] p-4">
                  <p className="text-2xl font-semibold text-white">30</p>
                  <p className="mt-1 text-xs text-zinc-500">Teams</p>
                </div>
                <div className="rounded-lg bg-white/[0.04] p-4">
                  <p className="text-2xl font-semibold text-white">26</p>
                  <p className="mt-1 text-xs text-zinc-500">Players</p>
                </div>
                <div className="rounded-lg bg-white/[0.04] p-4">
                  <p className="text-2xl font-semibold text-white">8</p>
                  <p className="mt-1 text-xs text-zinc-500">Views</p>
                </div>
              </div>
              <div className="mt-5 rounded-lg bg-white/[0.04] p-4">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-300">Analytics readiness</span>
                  <span className="text-red-200">API-ready</span>
                </div>
                <div className="flex h-32 items-end gap-2">
                  {[38, 54, 48, 70, 62, 86, 74, 92, 80].map((height, index) => (
                    <span
                      key={index}
                      className="flex-1 rounded-t bg-gradient-to-t from-red-500 to-white"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-red-300">Project Highlights</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Built like a real dashboard</h2>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {highlights.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="rounded-lg border border-white/10 bg-zinc-900/80 p-5 shadow-xl shadow-black/20 transition hover:border-red-400/50 hover:bg-zinc-900"
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
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-medium text-red-300">About this MVP</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Frontend product structure first</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-400">
              NBA Insight is a frontend portfolio MVP focused on user interface, routing, data visualization logic
              and product structure. It currently uses mock data through a service layer, making it easy to replace
              with real NBA API data in future versions.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-red-300">Tech Stack</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {techStack.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-zinc-950/70 p-4 text-sm font-semibold text-zinc-100"
                >
                  <Code2 className="size-4 text-red-300" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-medium text-red-300">Roadmap</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Next production steps</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-400">
              The project is intentionally frontend-first today. The next iterations would move data and user
              features into a real full-stack architecture.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {roadmap.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border border-white/10 bg-zinc-900/80 p-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-red-300">
                  {item.includes('database') || item.includes('PostgreSQL') ? (
                    <Database className="size-4" aria-hidden="true" />
                  ) : item.includes('API') ? (
                    <Layers className="size-4" aria-hidden="true" />
                  ) : (
                    <Shield className="size-4" aria-hidden="true" />
                  )}
                </span>
                <span className="text-sm font-medium text-zinc-200">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
