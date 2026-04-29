import { Code2, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-zinc-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="font-semibold text-white">NBA Insight</p>
          <p className="mt-1">Built as a portfolio project</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 px-3 font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
            href="https://github.com/Balbib99"
            target="_blank"
            rel="noreferrer"
          >
            <Code2 className="size-4" aria-hidden="true" />
            GitHub
          </a>
          <a
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 px-3 font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
            href="https://www.linkedin.com/in/balbino-martinez-rodriguez-2912bb332"
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
