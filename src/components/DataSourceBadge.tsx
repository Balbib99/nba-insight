interface DataSourceBadgeProps {
  source: 'mock' | 'real';
}

export function DataSourceBadge({ source }: DataSourceBadgeProps) {
  if (source !== 'mock') {
    return null;
  }

  return (
    <span
      className="inline-flex h-7 w-fit items-center border border-rule px-2.5 text-xs font-medium text-text-secondary"
      title="Mock data is being displayed"
    >
      Mock data
    </span>
  );
}
