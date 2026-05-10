export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-[#090F24]">
      <div className="container-page py-4">
        <div className="skeleton h-3 w-48 rounded" />
      </div>
      <div className="container-page pb-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="skeleton aspect-[4/3] rounded-2xl" />
          <div className="space-y-5">
            <div className="skeleton h-4 w-20 rounded" />
            <div className="skeleton h-8 w-3/4 rounded" />
            <div className="skeleton h-8 w-1/3 rounded" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-16 rounded-xl" />
              ))}
            </div>
            <div className="skeleton h-24 w-full rounded" />
            <div className="skeleton h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
