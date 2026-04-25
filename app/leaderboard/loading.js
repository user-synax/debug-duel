export default function LeaderboardLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="h-20 bg-[#111111] border border-[#2a2a2a] rounded-lg mb-6 animate-pulse" />
        
        {/* Tabs Skeleton */}
        <div className="h-12 bg-[#111111] border border-[#2a2a2a] rounded-lg mb-6 animate-pulse" />

        {/* Table Skeleton */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg overflow-hidden">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-16 border-b border-[#2a2a2a] animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
