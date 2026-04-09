import type { Metadata } from "next";
import { Suspense } from "react";
import { fetchTypes } from "@/lib/pokeapi";
import type { SearchParams } from "@/types/pokemon";
import { PokemonExplorer } from "@/components/PokemonExplorer";
import { GridSkeleton } from "@/components/Skeletons";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Browse Pokémon",
  description: "Discover and search Pokémon. Filter by type, sort by ID or stats.",
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function PokemonPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.query ?? "";
  const genre = params.genre ?? "";
  const page = Math.max(1, Number(params.page ?? "1"));
  const sortBy = params.sort_by ?? "id.asc";

  const genres = await fetchTypes();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Pokémon Explorer</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Search by name or filter by type
        </p>
      </div>

      <Suspense fallback={<GridSkeleton count={20} />}>
        <PokemonExplorer
          genres={genres}
          initialQuery={query}
          initialGenre={genre}
          initialPage={page}
          initialSort={sortBy}
        />
      </Suspense>
    </div>
  );
}
