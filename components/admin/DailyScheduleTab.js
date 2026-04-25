"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DailyScheduleTab() {
  const [schedule, setSchedule] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState("");

  useEffect(() => {
    fetchSchedule();
    fetchChallenges();
  }, [currentWeek]);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const startDate = new Date(currentWeek);
      startDate.setDate(startDate.getDate() - startDate.getDay()); // Start of week

      const params = new URLSearchParams({
        startDate: startDate.toISOString().split("T")[0],
      });

      const response = await fetch(`/api/admin/daily-schedule?${params}`);
      const data = await response.json();
      setSchedule(data.schedule || []);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChallenges = async () => {
    try {
      const response = await fetch("/api/admin/challenges");
      const data = await response.json();
      setChallenges(data.challenges?.filter((c) => c.isActive) || []);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  const getWeekDays = () => {
    const days = [];
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }

    return days;
  };

  const getScheduleForDay = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return schedule.find((s) => s.date === dateStr);
  };

  const handlePreviousWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() - 7);
    setCurrentWeek(newWeek);
  };

  const handleNextWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + 7);
    setCurrentWeek(newWeek);
  };

  const handleDayClick = (date) => {
    setSelectedDay(date);
    const scheduleForDay = getScheduleForDay(date);
    setSelectedChallenge(scheduleForDay?.challengeId?._id || "");
  };

  const handleAssignChallenge = async () => {
    if (!selectedDay || !selectedChallenge) return;

    try {
      const response = await fetch("/api/admin/daily-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDay.toISOString().split("T")[0],
          challengeId: selectedChallenge,
        }),
      });

      if (response.ok) {
        fetchSchedule();
        setSelectedDay(null);
        setSelectedChallenge("");
      }
    } catch (error) {
      console.error("Error assigning challenge:", error);
    }
  };

  const handleBulkAssign = async (challengeId) => {
    const days = getWeekDays();
    const promises = days.map((day) =>
      fetch("/api/admin/daily-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: day.toISOString().split("T")[0],
          challengeId,
        }),
      })
    );

    try {
      await Promise.all(promises);
      fetchSchedule();
    } catch (error) {
      console.error("Error bulk assigning:", error);
    }
  };

  const weekDays = getWeekDays();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Daily Schedule</h2>
        <div className="flex items-center gap-4">
          <select
            value={selectedChallenge}
            onChange={(e) => setSelectedChallenge(e.target.value)}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff87]"
          >
            <option value="">Select challenge for bulk assign</option>
            {challenges.map((challenge) => (
              <option key={challenge._id} value={challenge._id}>
                {challenge.title}
              </option>
            ))}
          </select>
          <Button
            onClick={() => handleBulkAssign(selectedChallenge)}
            disabled={!selectedChallenge}
          >
            Assign to Week
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={handlePreviousWeek}>
          <ChevronLeft className="w-4 h-4" />
          Previous Week
        </Button>
        <div className="text-white">
          {weekDays[0].toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          })}{" "}
          -{" "}
          {weekDays[6].toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        <Button variant="outline" onClick={handleNextWeek}>
          Next Week
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day, index) => {
            const scheduleForDay = getScheduleForDay(day);
            const isSelected =
              selectedDay?.toISOString().split("T")[0] ===
              day.toISOString().split("T")[0];

            return (
              <div
                key={index}
                onClick={() => handleDayClick(day)}
                className={`bg-[#111111] border border-[#2a2a2a] rounded-lg p-4 cursor-pointer hover:border-[#00ff87] transition-colors ${
                  isSelected ? "border-[#00ff87]" : ""
                }`}
              >
                <div className="text-gray-400 text-sm mb-2">
                  {dayNames[index]}
                </div>
                <div className="text-white font-medium mb-2">
                  {day.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
                {scheduleForDay ? (
                  <div className="p-2 bg-[#1a1a1a] rounded">
                    <div className="text-[#00ff87] text-sm font-medium truncate">
                      {scheduleForDay.challengeId?.title}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {scheduleForDay.challengeId?.category}
                    </div>
                  </div>
                ) : (
                  <div className="p-2 bg-[#1a1a1a] rounded text-gray-500 text-sm">
                    No challenge
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Assignment Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">
              Assign Challenge for{" "}
              {selectedDay.toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </h3>
            <select
              value={selectedChallenge}
              onChange={(e) => setSelectedChallenge(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff87] mb-4"
            >
              <option value="">Select a challenge</option>
              {challenges.map((challenge) => (
                <option key={challenge._id} value={challenge._id}>
                  {challenge.title}
                </option>
              ))}
            </select>
            <div className="flex gap-3">
              <Button onClick={handleAssignChallenge} className="flex-1">
                Assign
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedDay(null);
                  setSelectedChallenge("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
