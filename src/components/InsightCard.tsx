import type { LucideIcon } from 'lucide-react';

interface InsightCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
}

export function InsightCard({ title, value, description, icon: Icon }: InsightCardProps) {
  return (
    <article className="rounded-lg border border-white/10 bg-zinc-900/80 p-5 shadow-xl shadow-black/20 transition hover:border-red-400/50 hover:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-red-500/15 text-red-300">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-zinc-400">{description}</p>
    </article>
  );
}
