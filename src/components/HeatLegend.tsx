export function HeatLegend({ label = 'average' }: { label?: string }) {
  return (
    <p className="flex flex-wrap items-center gap-3 text-xs text-text-secondary">
      <span className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-score-orange" aria-hidden="true" />
        Above {label}
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-live-cyan" aria-hidden="true" />
        Below {label}
      </span>
    </p>
  );
}
