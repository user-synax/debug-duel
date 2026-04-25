export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="h-32 bg-[#111111] border border-[#2a2a2a] rounded-lg mb-6 animate-pulse" />
        
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-[#111111] border border-[#2a2a2a] rounded-lg animate-pulse" />
          ))}
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-[#111111] border border-[#2a2a2a] rounded-lg animate-pulse" />
          <div className="h-96 bg-[#111111] border border-[#2a2a2a] rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
