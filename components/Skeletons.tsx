export function CardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 animate-pulse">
      <div className="aspect-square bg-zinc-800" />
      <div className="px-3 py-2.5 flex flex-col gap-2">
        <div className="h-3.5 bg-zinc-800 rounded w-3/4" />
        <div className="flex gap-1">
          <div className="h-3 bg-zinc-800 rounded-full w-12" />
          <div className="h-3 bg-zinc-800 rounded-full w-10" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 20 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
