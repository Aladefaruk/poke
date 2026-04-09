"use client";

import type { PokemonType } from "@/types/pokemon";

const SORT_OPTIONS = [
  { value: "id.asc", label: "By Number" },
  { value: "name.asc", label: "A → Z" },
  { value: "base_experience.desc", label: "Highest XP" },
  { value: "height.desc", label: "Tallest" },
];

interface FilterBarProps {
  genres: PokemonType[];
  selectedGenre: string;
  sortBy: string;
  onGenreChange: (genre: string) => void;
  onSortChange: (sort: string) => void;
  disabled?: boolean;
}

const selectClass =
  "px-3 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-400 disabled:opacity-40 cursor-pointer";

export function FilterBar({
  genres,
  selectedGenre,
  sortBy,
  onGenreChange,
  onSortChange,
  disabled = false,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <label htmlFor="genre-filter" className="sr-only">Filter by type</label>
      <select
        id="genre-filter"
        value={selectedGenre}
        onChange={(e) => onGenreChange(e.target.value)}
        disabled={disabled}
        className={selectClass}
      >
        <option value="">All Types</option>
        {genres.map((g) => (
          <option key={g.id} value={g.name.toLowerCase()}>
            {g.name}
          </option>
        ))}
      </select>

      <label htmlFor="sort-filter" className="sr-only">Sort by</label>
      <select
        id="sort-filter"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        disabled={disabled}
        className={selectClass}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
