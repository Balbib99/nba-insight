import type { LucideIcon } from 'lucide-react';

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export function SectionTitle({ eyebrow, title, description, icon: Icon }: SectionTitleProps) {
  return (
    <div className="border-t border-rule pt-6">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Icon className="size-4 text-score-orange" aria-hidden="true" />
        {eyebrow}
      </div>
      <h2 className="mt-2 font-display text-2xl font-semibold text-text-primary">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">{description}</p>
    </div>
  );
}
