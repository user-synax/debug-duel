"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Something went wrong!</h2>
        <p className="text-gray-400 mb-8">An unexpected error occurred. Please try again.</p>
        <Button
          onClick={reset}
          className="px-8 py-3 bg-[#00ff87] text-black font-bold rounded-lg hover:bg-[#00cc6a] transition-colors"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
