interface EmptyStateProps {
  query?: string;
  onReset: () => void;
}

export function EmptyState({ query, onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
      <div className="text-5xl" aria-hidden="true">?</div>
      <h2 className="text-lg font-semibold text-zinc-200">No Pokémon found</h2>
      <p className="text-zinc-500 max-w-sm text-sm">
        {query
          ? `Couldn't find a Pokémon named "${query}". Try the exact name — e.g. "pikachu" or "charizard".`
          : "No Pokémon match your current filters. Try adjusting them."}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        Clear filters
      </button>
    </div>
  );
}
