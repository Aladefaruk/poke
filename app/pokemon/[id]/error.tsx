"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PokemonDetailError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[PokemonDetailError]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
      <div className="text-6xl" aria-hidden="true">🔴</div>
      <h2 className="text-xl font-semibold text-zinc-200">Pokémon not available</h2>
      <p className="text-zinc-500 max-w-sm">
        We couldn&apos;t load this Pokémon&apos;s details. It may not exist or there&apos;s a temporary issue.
      </p>
      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={reset}
          className="px-5 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/pokemon"
          className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 rounded-lg text-sm font-medium transition-colors"
        >
          Back to Pokémon
        </Link>
      </div>
    </div>
  );
}
