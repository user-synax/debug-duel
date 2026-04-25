"use client";

import { useEffect, useState } from "react";

export default function XPAnimation({ xp, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
      <div className="text-4xl font-bold text-[#00ff87] animate-bounce">
        +{xp} XP
      </div>
    </div>
  );
}
