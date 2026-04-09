"use client";

import { useQuery } from "@tanstack/react-query";
import type { PaginatedResponse, Pokemon } from "@/types/pokemon";

interface UsePokemonParams {
  query: string;
  genre: string;
  page: number;
  sortBy: string;
}

async function fetchPokemon(params: UsePokemonParams): Promise<PaginatedResponse<Pokemon>> {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    ...(params.query ? { query: params.query } : {}),
    ...(params.genre ? { genre: params.genre } : {}),
    sort_by: params.sortBy,
  });

  const res = await fetch(`/api/pokemon?${searchParams}`);
  if (!res.ok) throw new Error("Failed to fetch Pokémon");
  return res.json() as Promise<PaginatedResponse<Pokemon>>;
}

export function usePokemon(params: UsePokemonParams) {
  return useQuery({
    queryKey: ["pokemon", params],
    queryFn: () => fetchPokemon(params),
    placeholderData: (prev) => prev,
  });
}
