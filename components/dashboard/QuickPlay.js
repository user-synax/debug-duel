"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function QuickPlay() {
  const router = useRouter();

  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-white mb-4">Quick Play</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={() => router.push("/practice")}
          size="lg"
          className="h-16 text-lg"
        >
          Practice
        </Button>
        <Button
          size="lg"
          className="h-16 text-lg"
          disabled
          variant="outline"
        >
          Live 1v1
          <span className="ml-2 px-2 py-0.5 text-xs bg-[#2a2a2a] text-gray-500 rounded">
            Coming Soon
          </span>
        </Button>
        <Button
          size="lg"
          className="h-16 text-lg"
          disabled
          variant="outline"
        >
          Ranked
          <span className="ml-2 px-2 py-0.5 text-xs bg-[#2a2a2a] text-gray-500 rounded">
            Coming Soon
          </span>
        </Button>
      </div>
    </div>
  );
}
