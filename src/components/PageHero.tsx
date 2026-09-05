import type { ReactNode } from 'react';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: ReactNode;
  tags?: string[];
  right?: ReactNode;
}

export function PageHero({ eyebrow, title, description, tags, right }: PageHeroProps) {
  return (
    <div className="relative border-b border-rule pb-8">
      <div className="absolute left-0 top-0 h-[3px] w-16 -skew-x-[20deg] bg-score-orange" aria-hidden="true" />
      <div className="flex flex-col gap-6 pt-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-ledger-blue">{eyebrow}</span>
            {tags?.map((tag) => (
              <span key={tag} className="border border-rule px-2.5 py-1 text-xs font-medium text-text-secondary">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold text-text-primary sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-text-secondary sm:text-base">{description}</p>
        </div>
        {right ? <div className="w-full sm:max-w-md lg:w-auto lg:max-w-none">{right}</div> : null}
      </div>
    </div>
  );
}

export function HeroStatLedger({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div
      className="grid divide-x divide-rule border border-rule sm:w-full sm:max-w-md"
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map((item) => (
        <div key={item.label} className="p-3 text-center">
          <p className="font-display text-2xl font-bold text-text-primary">{item.value}</p>
          <p className="mt-1 text-xs text-text-secondary">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
