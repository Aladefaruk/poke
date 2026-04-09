import type { Pokemon, PokemonDetail, PokemonType, PaginatedResponse } from "@/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";
const PAGE_SIZE = 20;

export const spriteUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

// ── Raw PokéAPI shapes ────────────────────────────────────────────────────────

interface RawPokemon {
  id: number;
  name: string;
  base_experience: number | null;
  height: number;
  weight: number;
  sprites: { other?: { "official-artwork"?: { front_default: string | null } } };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  species: { url: string };
}

interface RawSpecies {
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function normalizeName(name: string) {
  return name.replace(/-/g, " ");
}

function toPage(offset: number): number {
  return Math.floor(offset / PAGE_SIZE) + 1;
}

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`PokéAPI ${res.status}: ${url}`);
  return res.json() as Promise<T>;
}

function rawToPokemon(raw: RawPokemon): Pokemon {
  return {
    id: raw.id,
    name: normalizeName(raw.name),
    sprite: raw.sprites.other?.["official-artwork"]?.front_default ?? spriteUrl(raw.id),
    types: raw.types.map((t) => t.type.name),
    base_experience: raw.base_experience,
    height: raw.height,
    weight: raw.weight,
  };
}


export async function fetchPokemons(
  page = 1,
  typeId?: string,
  sortBy = "id.asc"
): Promise<PaginatedResponse<Pokemon>> {
  if (typeId) {
    // Filter by type — fetch all members of that type
    const data = await apiFetch<{ pokemon: { pokemon: { name: string; url: string } }[] }>(
      `${BASE_URL}/type/${typeId}`,
      { cache: "force-cache" }
    );
    const members = data.pokemon.slice(0, 200); // cap at 200 for perf
    const details = await Promise.all(
      members.map((m) =>
        apiFetch<RawPokemon>(m.pokemon.url, { next: { revalidate: 3600 } } as RequestInit)
      )
    );
    let sorted = details.map(rawToPokemon);
    sorted = applySortAndPage(sorted, sortBy, page);
    return {
      page,
      results: sorted,
      total_pages: Math.ceil(members.length / PAGE_SIZE),
      total_results: members.length,
    };
  }

  const offset = (page - 1) * PAGE_SIZE;
  const list = await apiFetch<{ count: number; results: { name: string; url: string }[] }>(
    `${BASE_URL}/pokemon?limit=${PAGE_SIZE}&offset=${offset}`,
    { next: { revalidate: 600 } } as RequestInit
  );

  const details = await Promise.all(
    list.results.map((p) =>
      apiFetch<RawPokemon>(p.url, { next: { revalidate: 3600 } } as RequestInit)
    )
  );

  return {
    page,
    results: details.map(rawToPokemon),
    total_pages: Math.min(Math.ceil(list.count / PAGE_SIZE), 500),
    total_results: list.count,
  };
}

export async function searchPokemons(
  query: string,
  page = 1
): Promise<PaginatedResponse<Pokemon>> {
  // PokéAPI has no search — fetch by exact name (lowercase, hyphenated)
  const slug = query.trim().toLowerCase().replace(/\s+/g, "-");
  try {
    const raw = await apiFetch<RawPokemon>(`${BASE_URL}/pokemon/${slug}`, {
      cache: "no-store",
    });
    return { page: 1, results: [rawToPokemon(raw)], total_pages: 1, total_results: 1 };
  } catch {
    return { page: 1, results: [], total_pages: 1, total_results: 0 };
  }
}

export async function fetchPokemonDetail(id: number): Promise<PokemonDetail> {
  const raw = await apiFetch<RawPokemon>(
    `${BASE_URL}/pokemon/${id}`,
    { next: { revalidate: 3600 } } as RequestInit
  );

  let flavor_text: string | undefined;
  try {
    const species = await apiFetch<RawSpecies>(raw.species.url, {
      next: { revalidate: 3600 },
    } as RequestInit);
    flavor_text = species.flavor_text_entries
      .find((e) => e.language.name === "en")
      ?.flavor_text.replace(/\f/g, " ");
  } catch {
    // non-critical
  }

  return {
    ...rawToPokemon(raw),
    abilities: raw.abilities.map((a) => normalizeName(a.ability.name)),
    stats: raw.stats.map((s) => ({ name: normalizeName(s.stat.name), value: s.base_stat })),
    species_url: raw.species.url,
    flavor_text,
  };
}

export async function fetchTypes(): Promise<PokemonType[]> {
  const data = await apiFetch<{ results: { name: string; url: string }[] }>(
    `${BASE_URL}/type`,
    { cache: "force-cache" }
  );
  // Filter out non-standard types (unknown, shadow)
  const standard = data.results.filter((t) => !["unknown", "shadow"].includes(t.name));
  return standard.map((t, i) => ({
    id: i + 1,
    name: t.name.charAt(0).toUpperCase() + t.name.slice(1),
  }));
}

export async function fetchPopularPokemonIds(pages = 3): Promise<number[]> {
  const requests = Array.from({ length: pages }, (_, i) => fetchPokemons(i + 1));
  const results = await Promise.all(requests);
  return results.flatMap((r) => r.results.map((p) => p.id));
}

// ── Sort helper ───────────────────────────────────────────────────────────────

function applySortAndPage(items: Pokemon[], sortBy: string, page: number): Pokemon[] {
  const sorted = [...items].sort((a, b) => {
    switch (sortBy) {
      case "name.asc":
        return a.name.localeCompare(b.name);
      case "base_experience.desc":
        return (b.base_experience ?? 0) - (a.base_experience ?? 0);
      case "height.desc":
        return b.height - a.height;
      default: // id.asc
        return a.id - b.id;
    }
  });
  const start = (page - 1) * PAGE_SIZE;
  return sorted.slice(start, start + PAGE_SIZE);
}
