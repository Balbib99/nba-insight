import { Search, X } from 'lucide-react';

interface SearchInputProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ id, label, placeholder, value, onChange }: SearchInputProps) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-text-secondary">
        {label}
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary"
          aria-hidden="true"
        />
        <input
          id={id}
          className="h-11 w-full border border-rule bg-ink-950 px-10 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/60 focus:border-live-cyan/60 focus:ring-2 focus:ring-live-cyan/20"
          placeholder={placeholder}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {value ? (
          <button
            className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-cyan/60"
            type="button"
            aria-label="Clear search"
            title="Clear search"
            onClick={() => onChange('')}
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
