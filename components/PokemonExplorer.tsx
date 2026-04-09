"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { PokemonType } from "@/types/pokemon";
import { usePokemon } from "@/hooks/usePokemon";
import { useDebounce } from "@/hooks/useDebounce";
import { SearchBar } from "./SearchBar";
import { FilterBar } from "./FilterBar";
import { PokemonGrid } from "./PokemonGrid";
import { Pagination } from "./Pagination";
import { GridSkeleton } from "./Skeletons";
import { EmptyState } from "./EmptyState";

interface PokemonExplorerProps {
  genres: PokemonType[];
  initialQuery: string;
  initialGenre: string;
  initialPage: number;
  initialSort: string;
}

export function PokemonExplorer({
  genres,
  initialQuery,
  initialGenre,
  initialPage,
  initialSort,
}: PokemonExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [inputValue, setInputValue] = useState(initialQuery);
  const [genre, setGenre] = useState(initialGenre);
  const [page, setPage] = useState(initialPage);
  const [sortBy, setSortBy] = useState(initialSort || "id.asc");

  const debouncedQuery = useDebounce(inputValue, 350);

  const updateUrl = useCallback(
    (params: Record<string, string>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(params)) {
        if (v) next.set(k, v);
        else next.delete(k);
      }
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  useEffect(() => {
    setPage(1);
    updateUrl({ query: debouncedQuery, page: "" });
  }, [debouncedQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGenreChange = useCallback(
    (g: string) => {
      setGenre(g);
      setPage(1);
      updateUrl({ genre: g, page: "" });
    },
    [updateUrl]
  );

  const handleSortChange = useCallback(
    (s: string) => {
      setSortBy(s);
      setPage(1);
      updateUrl({ sort_by: s, page: "" });
    },
    [updateUrl]
  );

  const handlePageChange = useCallback(
    (p: number) => {
      setPage(p);
      updateUrl({ page: String(p) });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updateUrl]
  );

  const handleReset = useCallback(() => {
    setInputValue("");
    setGenre("");
    setPage(1);
    setSortBy("id.asc");
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  const { data, isLoading, isFetching } = usePokemon({
    query: debouncedQuery,
    genre,
    page,
    sortBy,
  });

  const pokemon = data?.results ?? [];
  const totalPages = data?.total_pages ?? 1;
  const isSearching = debouncedQuery !== inputValue;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <SearchBar value={inputValue} onChange={setInputValue} placeholder="Search Pokémon…" />
        <FilterBar
          genres={genres}
          selectedGenre={genre}
          sortBy={sortBy}
          onGenreChange={handleGenreChange}
          onSortChange={handleSortChange}
          disabled={isLoading}
        />
      </div>

      {/* Results count */}
      {data && !isLoading && (
        <p className="text-sm text-zinc-500" aria-live="polite">
          {data.total_results.toLocaleString()} Pokémon found
          {debouncedQuery ? ` for "${debouncedQuery}"` : ""}
        </p>
      )}

      {/* Grid */}
      <div className={isFetching && !isLoading ? "opacity-60 transition-opacity" : ""}>
        {isLoading || isSearching ? (
          <GridSkeleton count={20} />
        ) : pokemon.length === 0 ? (
          <EmptyState query={debouncedQuery} onReset={handleReset} />
        ) : (
          <PokemonGrid pokemon={pokemon} />
        )}
      </div>

      {/* Pagination */}
      {!isLoading && pokemon.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
