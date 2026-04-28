export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => {
        return (
          <div key={`skeleton-${index}`} className="min-w-0">
            <div className="skeleton-shimmer aspect-[4/5] w-full rounded-[28px]" />
          </div>
        );
      })}
    </div>
  );
}
