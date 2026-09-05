import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  metric: string;
  icon: LucideIcon;
}

export function FeatureCard({ title, description, metric, icon: Icon }: FeatureCardProps) {
  return (
    <article className="border-t border-rule bg-ink-900 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-score-orange" aria-hidden="true" />
          <h2 className="font-display text-lg font-semibold text-text-primary">{title}</h2>
        </div>
        <span className="border border-rule px-2.5 py-1 text-xs font-medium text-text-secondary">{metric}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-text-secondary">{description}</p>
    </article>
  );
}
