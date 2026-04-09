import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchPokemonDetail, fetchPopularPokemonIds, spriteUrl } from "@/lib/pokeapi";
import { Breadcrumb } from "@/components/Breadcrumb";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const ids = await fetchPopularPokemonIds(3);
  return ids.map((id) => ({ id: String(id) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const pokemon = await fetchPokemonDetail(Number(id));
    return {
      title: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
      description: pokemon.flavor_text ?? `Details for ${pokemon.name}`,
      openGraph: {
        title: pokemon.name,
        description: pokemon.flavor_text,
        images: pokemon.sprite ? [{ url: pokemon.sprite, width: 475, height: 475 }] : [],
      },
    };
  } catch {
    return { title: "Pokémon Not Found" };
  }
}

export const runtime = "edge";

const TYPE_HERO_BG: Record<string, string> = {
  fire:     "from-orange-950 to-zinc-950",
  water:    "from-blue-950 to-zinc-950",
  grass:    "from-green-950 to-zinc-950",
  electric: "from-yellow-950 to-zinc-950",
  psychic:  "from-pink-950 to-zinc-950",
  ice:      "from-cyan-950 to-zinc-950",
  dragon:   "from-indigo-950 to-zinc-950",
  dark:     "from-zinc-900 to-zinc-950",
  fairy:    "from-pink-950 to-zinc-950",
  fighting: "from-red-950 to-zinc-950",
  poison:   "from-purple-950 to-zinc-950",
  ground:   "from-amber-950 to-zinc-950",
  rock:     "from-stone-900 to-zinc-950",
  bug:      "from-lime-950 to-zinc-950",
  ghost:    "from-violet-950 to-zinc-950",
  steel:    "from-slate-900 to-zinc-950",
  flying:   "from-sky-950 to-zinc-950",
  normal:   "from-zinc-800 to-zinc-950",
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

function statColor(value: number) {
  if (value >= 100) return "bg-emerald-500";
  if (value >= 70)  return "bg-lime-500";
  if (value >= 50)  return "bg-yellow-500";
  return "bg-red-500";
}

export default async function PokemonDetailPage({ params }: PageProps) {
  const { id } = await params;
  const pokemonId = Number(id);
  if (isNaN(pokemonId)) notFound();

  let pokemon;
  try {
    pokemon = await fetchPokemonDetail(pokemonId);
  } catch {
    notFound();
  }

  const image = pokemon.sprite ?? spriteUrl(pokemon.id);
  const primaryType = pokemon.types[0] ?? "normal";
  const heroBg = TYPE_HERO_BG[primaryType] ?? "from-zinc-900 to-zinc-950";

  return (
    <article className="flex flex-col gap-8">
      <Breadcrumb
        crumbs={[
          { label: "Pokédex", href: "/pokemon" },
          { label: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) },
        ]}
      />

      {/* Hero */}
      <div className={`relative rounded-2xl bg-gradient-to-b ${heroBg} border border-zinc-800 overflow-hidden`}>
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_50%_0%,white,transparent_70%)]" />
        <div className="flex flex-col md:flex-row gap-0">

          {/* Sprite panel */}
          <div className="flex items-center justify-center p-8 md:p-12 md:w-72 shrink-0">
            <div className="relative w-44 h-44 md:w-56 md:h-56 drop-shadow-2xl">
              <Image
                src={image}
                alt={pokemon.name}
                fill
                sizes="(max-width: 768px) 176px, 224px"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Info panel */}
          <div className="flex flex-col justify-center gap-5 px-6 pb-8 md:py-10 md:pr-10 flex-1 min-w-0">
            <div>
              <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase mb-1">
                #{String(pokemon.id).padStart(4, "0")}
              </p>
              <h1 className="text-4xl font-bold text-zinc-50 capitalize tracking-tight leading-none">
                {pokemon.name}
              </h1>
              {pokemon.flavor_text && (
                <p className="text-zinc-400 text-sm mt-3 leading-relaxed max-w-md">
                  {pokemon.flavor_text}
                </p>
              )}
            </div>

            {/* Types */}
            <div className="flex flex-wrap gap-2">
              {pokemon.types.map((t) => (
                <a
                  key={t}
                  href={`/pokemon?genre=${t}`}
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-opacity hover:opacity-80 ${TYPE_BADGE[t] ?? "bg-zinc-700 text-zinc-300"}`}
                >
                  {t}
                </a>
              ))}
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-4 text-sm">
              <Stat label="Height" value={`${(pokemon.height / 10).toFixed(1)} m`} />
              <Stat label="Weight" value={`${(pokemon.weight / 10).toFixed(1)} kg`} />
              {pokemon.base_experience != null && (
                <Stat label="Base XP" value={String(pokemon.base_experience)} />
              )}
              {pokemon.abilities.length > 0 && (
                <Stat label="Abilities" value={pokemon.abilities.join(", ")} capitalize />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Base stats */}
      {pokemon.stats.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Base Stats</h2>
          <div className="flex flex-col gap-3">
            {pokemon.stats.map((s) => (
              <div key={s.name} className="flex items-center gap-4">
                <span className="text-xs text-zinc-500 capitalize w-32 shrink-0">{s.name}</span>
                <div className="flex-1 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${statColor(s.value)}`}
                    style={{ width: `${(s.value / 255) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-zinc-300 w-8 text-right tabular-nums">
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function Stat({ label, value, capitalize = false }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">{label}</span>
      <span className={`text-sm text-zinc-200 font-medium ${capitalize ? "capitalize" : ""}`}>{value}</span>
    </div>
  );
}
