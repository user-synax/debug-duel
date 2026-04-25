export default function PracticeLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="h-20 bg-[#111111] border border-[#2a2a2a] rounded-lg mb-6 animate-pulse" />
        
        {/* Filters Skeleton */}
        <div className="h-16 bg-[#111111] border border-[#2a2a2a] rounded-lg mb-6 animate-pulse" />

        {/* Challenge Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-[#111111] border border-[#2a2a2a] rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
