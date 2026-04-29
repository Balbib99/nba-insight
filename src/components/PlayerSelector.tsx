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
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
          aria-hidden="true"
        />
        <select
          id={id}
          className="h-12 w-full appearance-none rounded-lg border border-white/10 bg-zinc-950/80 px-10 text-sm text-white outline-none transition focus:border-red-400/70 focus:ring-2 focus:ring-red-500/20"
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
