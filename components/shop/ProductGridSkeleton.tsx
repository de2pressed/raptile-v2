export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-x-5 md:gap-y-10">
      {Array.from({ length: 4 }).map((_, index) => {
        return (
          <div key={`skeleton-${index}`} className="min-w-0">
            <div className="skeleton-shimmer aspect-square w-full rounded-[28px]" />
            <div className="mt-4 space-y-2">
              <div className="skeleton-shimmer h-4 w-3/4 rounded-full" />
              <div className="skeleton-shimmer h-3 w-1/3 rounded-full" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
