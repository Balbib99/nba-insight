import { DATA_MODE, type DataMode } from '../config/api';

interface DataModeBadgeProps {
  variant?: 'compact' | 'full';
  mode?: DataMode;
}

export function DataModeBadge({ variant = 'compact', mode = DATA_MODE }: DataModeBadgeProps) {
  if (mode === 'api') {
    return (
      <span
        className="inline-flex w-fit items-center gap-2 text-xs font-medium text-live-cyan"
        title="Using backend API"
      >
        <span className="size-1.5 rounded-full bg-live-cyan motion-safe:animate-pulse" aria-hidden="true" />
        Live data
        {variant === 'full' ? (
          <span className="hidden font-normal text-text-secondary sm:inline">Using backend API</span>
        ) : null}
      </span>
    );
  }

  if (mode === 'hybrid') {
    return (
      <span
        className="inline-flex w-fit items-center gap-1.5 border border-rule px-2.5 py-1 text-xs font-medium text-text-secondary"
        title="Backend first, mock fallback"
      >
        <span className="font-display text-score-orange" aria-hidden="true">
          &dagger;
        </span>
        Hybrid mode
        {variant === 'full' ? (
          <span className="hidden font-normal opacity-80 sm:inline">Backend first, mock fallback</span>
        ) : null}
      </span>
    );
  }

  return (
    <span
      className="inline-flex w-fit items-center border border-rule px-2.5 py-1 text-xs font-medium text-text-secondary"
      title="Using local demo data"
    >
      Mock data
      {variant === 'full' ? (
        <span className="hidden font-normal opacity-80 sm:ml-1.5 sm:inline">Using local demo data</span>
      ) : null}
    </span>
  );
}
