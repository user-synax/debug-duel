"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg flex items-center justify-center">
      <div className="text-gray-400">Loading editor...</div>
    </div>
  ),
});

export default function CodeEditor({
  value,
  onChange,
  language = "javascript",
  readOnly = false,
  height = "600px",
}) {
  useEffect(() => {
    // Define custom dark theme for Monaco
    if (typeof window !== "undefined" && window.monaco) {
      window.monaco.editor.defineTheme("debugduel-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "keyword", foreground: "00d4ff" },
          { token: "string", foreground: "00ff87" },
          { token: "comment", foreground: "555555" },
          { token: "number", foreground: "ff79c6" },
          { token: "type", foreground: "8be9fd" },
          { token: "function", foreground: "50fa7b" },
          { token: "variable", foreground: "f8f8f2" },
        ],
        colors: {
          "editor.background": "#0d0d0d",
          "editor.foreground": "#f8f8f2",
          "editor.lineHighlightBackground": "#1a1a1a",
          "editorCursor.foreground": "#00ff87",
          "editor.selectionBackground": "rgba(0, 255, 135, 0.15)",
          "editor.inactiveSelectionBackground": "rgba(0, 255, 135, 0.05)",
          "editorLineNumber.foreground": "#444444",
          "editorLineNumber.activeForeground": "#00ff87",
          "editorIndentGuide.background": "#2a2a2a",
          "editorIndentGuide.activeBackground": "#00ff87",
          "editorWhitespace.foreground": "#2a2a2a",
          "editorRuler.foreground": "#2a2a2a",
        },
      });
    }
  }, []);

  return (
    <Editor
      height={height}
      language={language}
      value={value}
      onChange={onChange}
      theme="debugduel-dark"
      options={{
        readOnly,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineHeight: 22,
        fontFamily: "'JetBrains Mono', monospace",
        tabSize: 2,
        insertSpaces: true,
        formatOnPaste: true,
        formatOnType: true,
        automaticLayout: true,
        wordWrap: "off",
        lineNumbers: "on",
        renderLineHighlight: "all",
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
        smoothScrolling: true,
        padding: { top: 16, bottom: 16 },
        suggest: {
          showKeywords: true,
          showSnippets: true,
        },
      }}
    />
  );
}
