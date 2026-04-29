import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  metric: string;
  icon: LucideIcon;
}

export function FeatureCard({ title, description, metric, icon: Icon }: FeatureCardProps) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:border-red-400/50 hover:bg-white/[0.07]">
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-11 items-center justify-center rounded-lg bg-red-500/15 text-red-300">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-zinc-300">
          {metric}
        </span>
      </div>
      <h2 className="mt-5 text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
    </article>
  );
}
