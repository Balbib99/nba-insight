import { Database, Radio, RefreshCw } from 'lucide-react';
import { DATA_MODE, type DataMode } from '../config/api';

interface DataModeBadgeProps {
  variant?: 'compact' | 'full';
  mode?: DataMode;
}

const config: Record<
  DataMode,
  {
    label: string;
    description: string;
    className: string;
    icon: typeof Database;
  }
> = {
  mock: {
    label: 'Mock Data',
    description: 'Using local demo data',
    className: 'border-amber-300/30 bg-amber-400/10 text-amber-100',
    icon: Database,
  },
  api: {
    label: 'Live API',
    description: 'Using backend API',
    className: 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100',
    icon: Radio,
  },
  hybrid: {
    label: 'Hybrid Mode',
    description: 'Backend first, mock fallback',
    className: 'border-sky-300/30 bg-sky-400/10 text-sky-100',
    icon: RefreshCw,
  },
};

export function DataModeBadge({ variant = 'compact', mode = DATA_MODE }: DataModeBadgeProps) {
  const modeConfig = config[mode];
  const Icon = modeConfig.icon;

  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${modeConfig.className}`}
      title={modeConfig.description}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {modeConfig.label}
      {variant === 'full' ? <span className="hidden font-medium opacity-80 sm:inline">{modeConfig.description}</span> : null}
    </span>
  );
}
