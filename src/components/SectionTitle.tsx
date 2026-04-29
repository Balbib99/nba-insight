import type { LucideIcon } from 'lucide-react';

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export function SectionTitle({ eyebrow, title, description, icon: Icon }: SectionTitleProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-red-300">
          <Icon className="size-4" aria-hidden="true" />
          {eyebrow}
        </div>
        <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{description}</p>
      </div>
    </div>
  );
}
