"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/shared/Navbar";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [username, setUsername] = useState(session?.user?.username || "");
  const [avatar, setAvatar] = useState(session?.user?.avatar || "");
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, avatar }),
      });

      if (response.ok) {
        await update();
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Account deleted successfully");
        window.location.href = "/";
      } else {
        toast.error("Failed to delete account");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-white mb-8">Settings</h1>

        <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Profile</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Username
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-[#1a1a1a] border-[#2a2a2a]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Avatar URL
              </label>
              <Input
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="bg-[#1a1a1a] border-[#2a2a2a]"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>

        <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Connected Accounts</h2>
          <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-xl">G</span>
              </div>
              <div>
                <p className="text-white font-medium">Google</p>
                <p className="text-gray-400 text-sm">
                  {session?.user?.provider === "google" ? "Connected" : "Not connected"}
                </p>
              </div>
            </div>
            <Button variant="outline" disabled>
              {session?.user?.provider === "google" ? "Connected" : "Connect"}
            </Button>
          </div>
        </div>

        <div className="bg-[#111111] border border-red-500/30 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h2>
          <p className="text-gray-400 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          {!showDeleteConfirm ? (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                Confirm Delete
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
