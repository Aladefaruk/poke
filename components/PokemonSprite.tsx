"use client";

import Image from "next/image";
import { useState } from "react";

interface PokemonSpriteProps {
  src: string;
  name: string;
  priority?: boolean;
}

export function PokemonSprite({ src, name, priority = false }: PokemonSpriteProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-3">
        <span className="text-3xl" aria-hidden="true">?</span>
        <span className="text-[10px] text-zinc-500 text-center capitalize leading-tight">{name}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name}
      fill
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
      className="object-contain p-5 drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}
