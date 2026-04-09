export interface PokemonType {
  id: number;
  name: string;
}

export interface Pokemon {
  id: number;
  name: string;
  sprite: string | null;
  types: string[];
  base_experience: number | null;
  height: number; // decimetres
  weight: number; // hectograms
}

export interface PokemonDetail extends Pokemon {
  abilities: string[];
  stats: { name: string; value: number }[];
  species_url: string;
  flavor_text?: string;
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface SearchParams {
  query?: string;
  genre?: string; // reused as "type" filter
  page?: string;
  sort_by?: string;
}
