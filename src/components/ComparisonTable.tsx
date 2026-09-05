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

function getCellClass(value: number, otherValue: number) {
  if (value > otherValue) {
    return 'border-score-orange/40 bg-score-orange/10 text-text-primary';
  }

  if (value < otherValue) {
    return 'border-rule text-text-secondary';
  }

  return 'border-rule text-text-primary';
}

export function ComparisonTable({ playerAName, playerBName, metrics }: ComparisonTableProps) {
  return (
    <div className="border border-rule bg-ink-900">
      <div className="grid grid-cols-[1fr_96px_1fr] border-b border-rule font-display text-sm font-semibold text-text-primary sm:grid-cols-[1fr_140px_1fr]">
        <div className="px-4 py-4 text-left sm:px-5">{playerAName}</div>
        <div className="px-2 py-4 text-center font-body text-xs font-medium text-text-secondary">Metric</div>
        <div className="px-4 py-4 text-right sm:px-5">{playerBName}</div>
      </div>
      <div className="divide-y divide-rule">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="grid grid-cols-[1fr_96px_1fr] items-center gap-2 px-3 py-3 sm:grid-cols-[1fr_140px_1fr] sm:px-5"
          >
            <div
              className={`border px-3 py-2 text-left font-display tabular-nums text-sm font-semibold ${getCellClass(
                metric.playerAValue,
                metric.playerBValue,
              )}`}
            >
              {formatValue(metric.playerAValue, metric.suffix)}
            </div>
            <div className="text-center font-body text-xs font-medium text-text-secondary">{metric.label}</div>
            <div
              className={`border px-3 py-2 text-right font-display tabular-nums text-sm font-semibold ${getCellClass(
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
