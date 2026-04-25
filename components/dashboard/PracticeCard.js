"use client";

import { useRouter } from "next/navigation";
import { Code, ArrowRight } from "lucide-react";

export default function PracticeCard() {
  const router = useRouter();

  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#00ff87] transition-colors cursor-pointer group"
         onClick={() => router.push("/practice")}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#00ff87]/10 rounded-lg flex items-center justify-center group-hover:bg-[#00ff87]/20 transition-colors">
            <Code className="w-6 h-6 text-[#00ff87]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Practice Mode</h3>
            <p className="text-gray-400 text-sm">Solve challenges and earn XP</p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#00ff87] transition-colors" />
      </div>
    </div>
  );
}
