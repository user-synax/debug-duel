"use client";

import { useState } from "react";

export default function ActivityHeatmap({ data }) {
  const [tooltip, setTooltip] = useState(null);

  const getLevelColor = (count) => {
    if (count === 0) return "#1a1a1a";
    if (count <= 2) return "#064e29";
    if (count <= 5) return "#00a854";
    return "#00ff87";
  };

  // Group data by week (7 days each) - 52 weeks for full year
  const weeks = [];
  for (let i = 0; i < 52; i++) {
    const weekStart = i * 7;
    const weekData = data.slice(weekStart, weekStart + 7);
    weeks.push(weekData);
  }

  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const handleMouseEnter = (day, e) => {
    const rect = e.target.getBoundingClientRect();
    setTooltip({
      date: day.date,
      count: day.count,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Activity</h2>
      <div className="w-full overflow-x-auto">
        <svg width="750" height="128" className="mx-auto">
          {/* Day labels */}
          {dayLabels.map((label, i) => (
            <text
              key={i}
              x={0}
              y={i * 18 + 20}
              className="text-[10px] fill-gray-500"
              fontSize="10"
            >
              {label}
            </text>
          ))}

          {/* Week columns */}
          {weeks.map((week, weekIndex) => {
            const weekDate = new Date(week[0]?.date || new Date());
            const monthIndex = weekDate.getMonth();
            const showMonthLabel = weekIndex % 4 === 0;

            return (
              <g key={weekIndex} transform={`translate(${weekIndex * 13 + 30}, 0)`}>
                {/* Month label */}
                {showMonthLabel && (
                  <text
                    x={0}
                    y={10}
                    className="text-[10px] fill-gray-500"
                    fontSize="10"
                  >
                    {monthLabels[monthIndex]}
                  </text>
                )}

                {/* Day cells */}
                {week.map((day, dayIndex) => (
                  <rect
                    key={`${weekIndex}-${dayIndex}`}
                    x={0}
                    y={dayIndex * 18 + 20}
                    width={11}
                    height={11}
                    rx={2}
                    fill={getLevelColor(day.count)}
                    className="hover:stroke-white hover:stroke-2 transition-all cursor-pointer"
                    onMouseEnter={(e) => handleMouseEnter(day, e)}
                    onMouseLeave={handleMouseLeave}
                  />
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Custom Tooltip */}
      {tooltip && (
        <div
          className="fixed bg-[#1a1a1a] border border-[#2a2a2a] rounded px-2 py-1 text-xs text-white pointer-events-none z-50"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          {tooltip.date}: {tooltip.count} solves
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-500">
        <span>Less</span>
        {[0, 1, 2, 3].map((level) => (
          <div
            key={level}
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: getLevelColor(level) }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
