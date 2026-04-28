import { getGridPattern, GRID_PATTERNS } from "@/components/shop/productGridPattern";

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-[2px] md:grid-cols-6 lg:grid-cols-12">
      {GRID_PATTERNS.map((_, index) => {
        const pattern = getGridPattern(index);

        return (
          <div key={`skeleton-${index}`} className={`col-span-1 ${pattern.tabletSpan} ${pattern.desktopSpan}`}>
            <div className={`skeleton-shimmer w-full ${pattern.aspectRatioClass} lg:max-h-[72vh]`} />
          </div>
        );
      })}
    </div>
  );
}
