"use client";

import { useState, useRef, useEffect } from "react";
import CodeEditor from "./CodeEditor";
import { Button } from "@/components/ui/button";

export default function EditorPanel({
  challenge,
  code,
  onCodeChange,
  onRunTests,
  onSubmit,
  testResults,
  isRunning,
  hasSubmitted,
  elapsedTime,
}) {
  const [activeTab, setActiveTab] = useState("preview");
  const [showHints, setShowHints] = useState(false);
  const [splitPosition, setSplitPosition] = useState(55);
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !panelRef.current) return;
      const rect = panelRef.current.getBoundingClientRect();
      const newPosition = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitPosition(Math.max(30, Math.min(70, newPosition)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    const seconds = elapsedTime / 1000;
    if (seconds > 300) return "text-[#ff4444]";
    if (seconds > 120) return "text-[#ffaa00]";
    return "text-[#00ff87]";
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-[#00ff87]/20 text-[#00ff87]";
      case "medium":
        return "bg-[#00d4ff]/20 text-[#00d4ff]";
      case "hard":
        return "bg-[#ff4444]/20 text-[#ff4444]";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "html":
        return "bg-orange-500/20 text-orange-400";
      case "css":
        return "bg-blue-500/20 text-blue-400";
      case "javascript":
        return "bg-yellow-500/20 text-yellow-400";
      case "react":
        return "bg-cyan-500/20 text-cyan-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div
      ref={panelRef}
      className="w-full bg-[#111111] border border-[#2a2a2a] rounded-lg overflow-hidden"
      style={{ minHeight: "600px" }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a] bg-[#0d0d0d]">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-white">{challenge?.title}</h2>
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(
              challenge?.category
            )}`}
          >
            {challenge?.category?.toUpperCase()}
          </span>
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(
              challenge?.difficulty
            )}`}
          >
            {challenge?.difficulty?.toUpperCase()}
          </span>
        </div>
        <div className={`text-sm font-mono ${getTimerColor()}`}>
          {formatTime(elapsedTime)}
        </div>
      </div>

      {/* Split Panel */}
      <div className="flex" style={{ height: "calc(100% - 120px)" }}>
        {/* Left Panel - Code Editor */}
        <div style={{ width: `${splitPosition}%` }} className="border-r border-[#2a2a2a]">
          <CodeEditor
            value={code}
            onChange={onCodeChange}
            language={challenge?.category || "javascript"}
            height="100%"
          />
        </div>

        {/* Drag Handle */}
        <div
          className="w-1 bg-[#2a2a2a] cursor-col-resize hover:bg-[#00ff87] transition-colors"
          onMouseDown={handleMouseDown}
        />

        {/* Right Panel - Tabs */}
        <div style={{ width: `${100 - splitPosition}%` }} className="flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-[#2a2a2a] bg-[#0d0d0d]">
            {["preview", "console", "tests"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "text-[#00ff87] border-b-2 border-[#00ff87]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto p-4">
            {activeTab === "preview" && (
              <div className="h-full">
                <iframe
                  srcDoc={code}
                  className="w-full h-full bg-white rounded border border-[#2a2a2a]"
                  title="Preview"
                />
              </div>
            )}

            {activeTab === "console" && (
              <div className="text-sm text-gray-400 font-mono">
                <p className="text-gray-500 italic">Console output will appear here</p>
              </div>
            )}

            {activeTab === "tests" && (
              <div className="space-y-2">
                {testResults.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">
                    Run tests to see results
                  </p>
                ) : (
                  testResults.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-2 rounded bg-[#1a1a1a] border border-[#2a2a2a]"
                    >
                      {result.passed ? (
                        <svg
                          className="w-5 h-5 text-[#00ff87] flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 text-[#ff4444] flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                      <div className="flex-1">
                        <p
                          className={`text-sm ${
                            result.passed ? "text-white" : "text-[#ff4444]"
                          }`}
                        >
                          {result.description}
                        </p>
                        {result.error && (
                          <p className="text-xs text-[#ff4444] mt-1">
                            {result.error}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-[#2a2a2a] bg-[#0d0d0d]">
        <Button
          variant="outline"
          onClick={() => setShowHints(!showHints)}
          className="text-sm"
        >
          {showHints ? "Hide Hints" : "Show Hints"}
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onRunTests}
            disabled={isRunning}
            className="text-sm"
          >
            {isRunning ? "Running..." : "Run Tests"}
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isRunning || hasSubmitted}
            className="text-sm"
          >
            {hasSubmitted ? "Submitted" : "Submit Fix"}
          </Button>
        </div>
      </div>

      {/* Hints Panel */}
      {showHints && challenge?.hints && challenge.hints.length > 0 && (
        <div className="px-4 py-3 border-t border-[#2a2a2a] bg-[#1a1a1a]">
          <h3 className="text-sm font-semibold text-[#00ff87] mb-2">Hints</h3>
          <ul className="space-y-1">
            {challenge.hints.map((hint, index) => (
              <li key={index} className="text-sm text-gray-400">
                • {hint}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
