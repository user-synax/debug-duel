"use client";

import dynamic from "next/dynamic";

const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false });

export default function RankDistribution({ rankDistribution, usersAbove }) {
  const rankOrder = [
    "Intern",
    "Junior",
    "Mid",
    "Senior",
    "Staff",
    "Principal",
    "Architect",
  ];

  const data = rankOrder.map((rank) => {
    const found = rankDistribution.find((r) => r._id === rank);
    return {
      rank,
      count: found?.count || 0,
    };
  });

  const totalUsers = data.reduce((sum, item) => sum + item.count, 0);

  const getRankColor = (rank) => {
    switch (rank) {
      case "Architect":
        return "#a855f7";
      case "Principal":
        return "#ec4899";
      case "Staff":
        return "#3b82f6";
      case "Senior":
        return "#22c55e";
      case "Mid":
        return "#eab308";
      case "Junior":
        return "#f97316";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Rank Distribution</h2>
      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="rank"
              tick={{ fill: "#9ca3af", fontSize: 10 }}
              axisLine={{ stroke: "#2a2a2a" }}
              tickLine={{ stroke: "#2a2a2a" }}
            />
            <YAxis
              tick={{ fill: "#9ca3af", fontSize: 10 }}
              axisLine={{ stroke: "#2a2a2a" }}
              tickLine={{ stroke: "#2a2a2a" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "8px",
              }}
              itemStyle={{ color: "#fff" }}
            />
            <Bar dataKey="count" fill="#00ff87" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-gray-400 text-sm text-center">
        {usersAbove} developers above you
      </p>
    </div>
  );
}
