"use client";

import { usePathname } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ChallengesTab from "@/components/admin/ChallengesTab";
import UsersTab from "@/components/admin/UsersTab";
import DailyScheduleTab from "@/components/admin/DailyScheduleTab";

export default function AdminPage() {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname === "/admin/users") return "users";
    if (pathname === "/admin/schedule") return "schedule";
    if (pathname === "/admin/analytics") return "analytics";
    if (pathname === "/admin/flagged") return "flagged";
    return "challenges";
  };

  const activeTab = getActiveTab();

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UsersTab />;
      case "schedule":
        return <DailyScheduleTab />;
      case "analytics":
        return <div className="text-white">Analytics coming soon...</div>;
      case "flagged":
        return <div className="text-white">Flagged submissions coming soon...</div>;
      default:
        return <ChallengesTab />;
    }
  };

  return <AdminLayout activeTab={activeTab}>{renderContent()}</AdminLayout>;
}
