import { GridSkeleton } from "@/components/Skeletons";

export default function PokemonLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-72 bg-gray-200 rounded animate-pulse mt-2" />
      </div>

      <div className="flex gap-3">
        <div className="h-10 flex-1 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-10 w-36 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-10 w-36 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      <GridSkeleton count={20} />
    </div>
  );
}
