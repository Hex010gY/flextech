export default function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      {/* Image */}
      <div className="skeleton aspect-[4/3] rounded-none" />
      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="flex gap-1.5 mt-1">
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-5 w-14 rounded-full" />
          <div className="skeleton h-5 w-10 rounded-full" />
        </div>
        <div className="skeleton h-6 w-24 rounded mt-1" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
