import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectFilterProps {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}

export function SelectFilter({ id, label, value, options, onChange }: SelectFilterProps) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-text-secondary">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className="h-11 w-full appearance-none border border-rule bg-ink-950 px-3 pr-10 text-sm text-text-primary outline-none transition-colors focus:border-live-cyan/60 focus:ring-2 focus:ring-live-cyan/20"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
