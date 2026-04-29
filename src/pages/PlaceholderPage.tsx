import type { LucideIcon } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export function PlaceholderPage({ title, label, description, icon: Icon }: PlaceholderPageProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 shadow-xl shadow-black/20">
        <span className="flex size-12 items-center justify-center rounded-lg bg-red-500/15 text-red-300">
          <Icon className="size-6" aria-hidden="true" />
        </span>
        <p className="mt-6 text-sm font-medium text-red-300">{label}</p>
        <h1 className="mt-2 text-3xl font-bold text-white">{title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">{description}</p>
      </div>
    </section>
  );
}
