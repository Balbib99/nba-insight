import type { LucideIcon } from 'lucide-react';

interface InsightCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
}

export function InsightCard({ title, value, description, icon: Icon }: InsightCardProps) {
  return (
    <article className="border-t border-rule bg-ink-900 p-5">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Icon className="size-4 text-score-orange" aria-hidden="true" />
        {title}
      </div>
      <p className="mt-3 font-display text-3xl font-semibold text-text-primary">{value}</p>
      <p className="mt-3 text-sm leading-6 text-text-secondary">{description}</p>
    </article>
  );
}
