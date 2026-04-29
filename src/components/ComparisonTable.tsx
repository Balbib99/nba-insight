export interface ComparisonMetric {
  label: string;
  playerAValue: number;
  playerBValue: number;
  suffix?: string;
}

interface ComparisonTableProps {
  playerAName: string;
  playerBName: string;
  metrics: ComparisonMetric[];
}

function formatValue(value: number, suffix = '') {
  return `${value.toFixed(1)}${suffix}`;
}

function getWinnerClass(value: number, otherValue: number) {
  if (value <= otherValue) {
    return 'border-white/10 bg-white/[0.04] text-zinc-100';
  }

  return 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200';
}

export function ComparisonTable({ playerAName, playerBName, metrics }: ComparisonTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900/80 shadow-xl shadow-black/20">
      <div className="grid grid-cols-[1fr_96px_1fr] border-b border-white/10 bg-white/[0.03] text-sm font-semibold text-zinc-300 sm:grid-cols-[1fr_140px_1fr]">
        <div className="px-4 py-4 text-left sm:px-5">{playerAName}</div>
        <div className="px-2 py-4 text-center text-zinc-500">Metric</div>
        <div className="px-4 py-4 text-right sm:px-5">{playerBName}</div>
      </div>
      <div className="divide-y divide-white/10">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="grid grid-cols-[1fr_96px_1fr] items-center gap-2 px-3 py-3 sm:grid-cols-[1fr_140px_1fr] sm:px-5"
          >
            <div
              className={`rounded-lg border px-3 py-2 text-left text-sm font-semibold ${getWinnerClass(
                metric.playerAValue,
                metric.playerBValue,
              )}`}
            >
              {formatValue(metric.playerAValue, metric.suffix)}
            </div>
            <div className="text-center text-xs font-semibold uppercase text-zinc-500">{metric.label}</div>
            <div
              className={`rounded-lg border px-3 py-2 text-right text-sm font-semibold ${getWinnerClass(
                metric.playerBValue,
                metric.playerAValue,
              )}`}
            >
              {formatValue(metric.playerBValue, metric.suffix)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
