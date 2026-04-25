"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, Shield, Ban } from "lucide-react";

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (userId, currentStatus) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, isAdmin: !currentStatus }),
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Error toggling admin:", error);
    }
  };

  const handleToggleBan = async (userId, currentStatus) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, isBanned: !currentStatus }),
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Error toggling ban:", error);
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case "Architect":
        return "bg-purple-500/20 text-purple-400";
      case "Principal":
        return "bg-pink-500/20 text-pink-400";
      case "Staff":
        return "bg-blue-500/20 text-blue-400";
      case "Senior":
        return "bg-green-500/20 text-green-400";
      case "Mid":
        return "bg-yellow-500/20 text-yellow-400";
      case "Junior":
        return "bg-orange-500/20 text-orange-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Users</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by username or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#00ff87] w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-8">Loading...</div>
      ) : (
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#0d0d0d]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Username
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  XP
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Wins/Losses
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Admin
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Banned
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-[#1a1a1a]">
                  <td className="px-4 py-3 text-white">{user.username}</td>
                  <td className="px-4 py-3 text-gray-400">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded ${getRankColor(
                        user.rank
                      )}`}
                    >
                      {user.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#00ff87]">{user.xp}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {user.wins} / {user.losses}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant={user.isAdmin ? "default" : "outline"}
                      onClick={() => handleToggleAdmin(user._id, user.isAdmin)}
                      className={user.isAdmin ? "bg-[#00ff87]" : ""}
                    >
                      <Shield className="w-4 h-4" />
                    </Button>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant={user.isBanned ? "default" : "outline"}
                      onClick={() => handleToggleBan(user._id, user.isBanned)}
                      className={user.isBanned ? "bg-[#ff4444]" : ""}
                    >
                      <Ban className="w-4 h-4" />
                    </Button>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
