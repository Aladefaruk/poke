import Link from "next/link";
import type { Pokemon } from "@/types/pokemon";
import { spriteUrl } from "@/lib/pokeapi";
import { PokemonSprite } from "./PokemonSprite";

interface PokemonCardProps {
  pokemon: Pokemon;
  priority?: boolean;
}

// Subtle dark tint per primary type for the card image area
const TYPE_BG: Record<string, string> = {
  fire:     "bg-orange-950/60",
  water:    "bg-blue-950/60",
  grass:    "bg-green-950/60",
  electric: "bg-yellow-950/60",
  psychic:  "bg-pink-950/60",
  ice:      "bg-cyan-950/60",
  dragon:   "bg-indigo-950/60",
  dark:     "bg-zinc-900",
  fairy:    "bg-pink-950/60",
  fighting: "bg-red-950/60",
  poison:   "bg-purple-950/60",
  ground:   "bg-amber-950/60",
  rock:     "bg-stone-900",
  bug:      "bg-lime-950/60",
  ghost:    "bg-violet-950/60",
  steel:    "bg-slate-900",
  flying:   "bg-sky-950/60",
  normal:   "bg-zinc-800",
};

const TYPE_BADGE: Record<string, string> = {
  fire:     "bg-orange-500/20 text-orange-300",
  water:    "bg-blue-500/20 text-blue-300",
  grass:    "bg-green-500/20 text-green-300",
  electric: "bg-yellow-500/20 text-yellow-300",
  psychic:  "bg-pink-500/20 text-pink-300",
  ice:      "bg-cyan-500/20 text-cyan-300",
  dragon:   "bg-indigo-500/20 text-indigo-300",
  dark:     "bg-zinc-500/20 text-zinc-300",
  fairy:    "bg-pink-400/20 text-pink-200",
  fighting: "bg-red-500/20 text-red-300",
  poison:   "bg-purple-500/20 text-purple-300",
  ground:   "bg-amber-500/20 text-amber-300",
  rock:     "bg-stone-500/20 text-stone-300",
  bug:      "bg-lime-500/20 text-lime-300",
  ghost:    "bg-violet-500/20 text-violet-300",
  steel:    "bg-slate-400/20 text-slate-300",
  flying:   "bg-sky-500/20 text-sky-300",
  normal:   "bg-zinc-500/20 text-zinc-400",
};

export function PokemonCard({ pokemon, priority = false }: PokemonCardProps) {
  const image = pokemon.sprite ?? spriteUrl(pokemon.id);
  const primaryType = pokemon.types[0] ?? "normal";

  return (
    <Link
      href={`/pokemon/${pokemon.id}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <div className={`relative aspect-square flex items-center justify-center ${TYPE_BG[primaryType] ?? "bg-zinc-800"}`}>
        <PokemonSprite src={image} name={pokemon.name} priority={priority} />
        <span className="absolute top-2.5 left-2.5 text-[10px] font-bold text-zinc-500 tabular-nums">
          #{String(pokemon.id).padStart(4, "0")}
        </span>
      </div>

      <div className="px-3 py-2.5 flex flex-col gap-1.5">
        <h2 className="font-semibold text-zinc-100 text-sm capitalize leading-tight group-hover:text-white transition-colors">
          {pokemon.name}
        </h2>
        <div className="flex flex-wrap gap-1">
          {pokemon.types.map((t) => (
            <span
              key={t}
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${TYPE_BADGE[t] ?? "bg-zinc-700 text-zinc-400"}`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
