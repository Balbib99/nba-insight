import { Search } from 'lucide-react';
import type { Player } from '../types/player';

interface PlayerSelectorProps {
  id: string;
  label: string;
  players: Player[];
  value: string;
  onChange: (playerId: string) => void;
}

export function PlayerSelector({ id, label, players, value, onChange }: PlayerSelectorProps) {
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
        <select
          id={id}
          className="h-12 w-full appearance-none border border-rule bg-ink-950 px-10 text-sm text-text-primary outline-none transition-colors focus:border-live-cyan/60 focus:ring-2 focus:ring-live-cyan/20"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">Select a player</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.fullName} - {player.teamName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
