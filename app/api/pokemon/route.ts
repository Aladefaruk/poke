import { type NextRequest, NextResponse } from "next/server";
import { fetchPokemons, searchPokemons } from "@/lib/pokeapi";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("query") ?? "";
  const genre = searchParams.get("genre") ?? ""; // used as type filter
  const page = Number(searchParams.get("page") ?? "1");
  const sortBy = searchParams.get("sort_by") ?? "id.asc";

  try {
    const data = query
      ? await searchPokemons(query, page)
      : await fetchPokemons(page, genre || undefined, sortBy);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
