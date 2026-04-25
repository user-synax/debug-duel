"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Plus, Trash2, Play } from "lucide-react";
import CodeEditor from "@/components/editor/CodeEditor";

export default function ChallengeForm({ challenge, onClose }) {
  const [formData, setFormData] = useState(
    challenge || {
      title: "",
      category: "html",
      difficulty: "easy",
      description: "",
      starterCode: "",
      solutionCode: "",
      validationTests: [{ description: "", testFn: "" }],
      hints: [],
      tags: [],
      isActive: true,
    }
  );
  const [testResults, setTestResults] = useState(null);
  const [testing, setTesting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTestChange = (index, field, value) => {
    const newTests = [...formData.validationTests];
    newTests[index][field] = value;
    setFormData((prev) => ({ ...prev, validationTests: newTests }));
  };

  const addTest = () => {
    setFormData((prev) => ({
      ...prev,
      validationTests: [...prev.validationTests, { description: "", testFn: "" }],
    }));
  };

  const removeTest = (index) => {
    setFormData((prev) => ({
      ...prev,
      validationTests: prev.validationTests.filter((_, i) => i !== index),
    }));
  };

  const addHint = () => {
    setFormData((prev) => ({
      ...prev,
      hints: [...prev.hints, ""],
    }));
  };

  const removeHint = (index) => {
    setFormData((prev) => ({
      ...prev,
      hints: prev.hints.filter((_, i) => i !== index),
    }));
  };

  const handleHintChange = (index, value) => {
    const newHints = [...formData.hints];
    newHints[index] = value;
    setFormData((prev) => ({ ...prev, hints: newHints }));
  };

  const handleTagAdd = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, e.target.value.trim().toLowerCase()],
      }));
      e.target.value = "";
    }
  };

  const handleTagRemove = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const runTests = async () => {
    setTesting(true);
    setTestResults(null);

    try {
      const response = await fetch("/api/admin/test-validation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          solutionCode: formData.solutionCode,
          validationTests: formData.validationTests,
        }),
      });

      const data = await response.json();
      setTestResults(data);
    } catch (error) {
      console.error("Error running tests:", error);
      setTestResults({ error: "Failed to run tests" });
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const url = challenge
        ? "/api/admin/challenges"
        : "/api/admin/challenges";
      const method = challenge ? "PATCH" : "POST";

      const body = challenge
        ? { ...formData, id: challenge._id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        onClose();
      }
    } catch (error) {
      console.error("Error saving challenge:", error);
    }
  };

  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          {challenge ? "Edit Challenge" : "Add Challenge"}
        </h2>
        <Button variant="outline" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff87]"
          />
        </div>

        {/* Category & Difficulty */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff87]"
            >
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="javascript">JavaScript</option>
              <option value="react">React</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Difficulty
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => handleChange("difficulty", e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff87]"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff87]"
          />
        </div>

        {/* Starter Code */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Starter Code
          </label>
          <CodeEditor
            code={formData.starterCode}
            onChange={(code) => handleChange("starterCode", code)}
            language="html"
            height="200px"
          />
        </div>

        {/* Solution Code */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Solution Code
          </label>
          <CodeEditor
            code={formData.solutionCode}
            onChange={(code) => handleChange("solutionCode", code)}
            language="html"
            height="200px"
          />
        </div>

        {/* Validation Tests */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-400">
              Validation Tests
            </label>
            <Button size="sm" onClick={addTest}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {formData.validationTests.map((test, index) => (
              <div key={index} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <input
                    type="text"
                    placeholder="Test description"
                    value={test.description}
                    onChange={(e) =>
                      handleTestChange(index, "description", e.target.value)
                    }
                    className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00ff87]"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeTest(index)}
                    className="ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <textarea
                  placeholder="Test function (e.g., return document.querySelector('.test') !== null)"
                  value={test.testFn}
                  onChange={(e) =>
                    handleTestChange(index, "testFn", e.target.value)
                  }
                  rows={2}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00ff87]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Test Validation Button */}
        <Button
          onClick={runTests}
          disabled={testing}
          className="flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          {testing ? "Running Tests..." : "Test Validation"}
        </Button>

        {testResults && (
          <div
            className={`p-4 rounded-lg ${
              testResults.error
                ? "bg-[#ff4444]/20 border border-[#ff4444]/30"
                : testResults.allPassed
                ? "bg-[#00ff87]/20 border border-[#00ff87]/30"
                : "bg-[#ffaa00]/20 border border-[#ffaa00]/30"
            }`}
          >
            {testResults.error ? (
              <p className="text-[#ff4444]">{testResults.error}</p>
            ) : (
              <p className={testResults.allPassed ? "text-[#00ff87]" : "text-[#ffaa00]"}>
                {testResults.allPassed
                  ? "All tests passed!"
                  : `${testResults.passed}/${testResults.total} tests passed`}
              </p>
            )}
          </div>
        )}

        {/* Hints */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-400">Hints</label>
            <Button size="sm" onClick={addHint}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {formData.hints.map((hint, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={hint}
                  onChange={(e) => handleHintChange(index, e.target.value)}
                  placeholder="Hint text"
                  className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00ff87]"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeHint(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Tags
          </label>
          <input
            type="text"
            placeholder="Type tag and press Enter"
            onKeyDown={handleTagAdd}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff87]"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-[#2a2a2a] text-white rounded-full text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  onClick={() => handleTagRemove(tag)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => handleChange("isActive", e.target.checked)}
            className="w-4 h-4 accent-[#00ff87]"
          />
          <label htmlFor="isActive" className="text-white">
            Active
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <Button onClick={handleSubmit} className="flex-1">
            {challenge ? "Update Challenge" : "Create Challenge"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
