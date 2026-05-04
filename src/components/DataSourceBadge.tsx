interface DataSourceBadgeProps {
  source: 'mock' | 'real';
}

export function DataSourceBadge({ source }: DataSourceBadgeProps) {
  if (source !== 'mock') {
    return null;
  }

  return (
    <span
      className="inline-flex h-7 w-fit items-center justify-center rounded-lg border border-amber-300/30 bg-amber-400/10 px-2.5 text-xs font-semibold uppercase tracking-normal text-amber-100"
      title="Mock data is being displayed"
    >
      Mock
    </span>
  );
}
