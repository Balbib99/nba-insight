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
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
          aria-hidden="true"
        />
        <input
          id={id}
          className="h-11 w-full rounded-lg border border-white/10 bg-zinc-950/80 px-10 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-red-400/70 focus:ring-2 focus:ring-red-500/20"
          placeholder={placeholder}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {value ? (
          <button
            className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white/10 hover:text-white"
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
