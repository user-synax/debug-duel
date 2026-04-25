// Custom hook for challenge solving logic
import { useState, useEffect, useCallback } from 'react';
import { runValidation } from "@/lib/validation/runner";
import { scoreSubmission } from "@/lib/validation/scorer";

const useChallengeSolver = create((set, get) => ({
  code: "",
  isRunning: false,
  results: [],
  hasSubmitted: false,
  elapsedTime: 0,
  startTime: null,
  timerInterval: null,

  setCode: (code) => set({ code }),

  startChallenge: () => {
    const startTime = Date.now();
    set({
      startTime,
      elapsedTime: 0,
      hasSubmitted: false,
      results: [],
    });

    // Start timer
    const timerInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      set({ elapsedTime: elapsed });
    }, 1000);

    set({ timerInterval });
  },

  runTests: async (challenge) => {
    const { code } = get();
    set({ isRunning: true });

    try {
      const validationResults = await runValidation(code, challenge);
      set({ results: validationResults.results });
      return validationResults;
    } catch (error) {
      console.error("Test run failed:", error);
      set({
        results: [
          {
            description: "Test execution failed",
            passed: false,
            error: error.message,
          },
        ],
      });
      return { passed: false, results: [], timeTaken: 0 };
    } finally {
      set({ isRunning: false });
    }
  },

  submitSolution: async (challenge) => {
    const { code, startTime, timerInterval } = get();
    set({ isRunning: true });

    // Stop timer
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    const timeTaken = Date.now() - startTime;

    try {
      const validationResults = await runValidation(code, challenge);
      const scoring = scoreSubmission(
        validationResults.results,
        validationResults.timeTaken,
        challenge.difficulty
      );

      // Submit to API
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          challengeId: challenge._id,
          passed: validationResults.passed,
          timeTaken: validationResults.timeTaken,
          score: scoring.finalScore,
          testResults: validationResults.results,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit solution");
      }

      const apiResult = await response.json();

      set({
        results: validationResults.results,
        hasSubmitted: true,
        isRunning: false,
        timerInterval: null,
      });

      return {
        ...validationResults,
        score: scoring.finalScore,
        scoring,
        xpEarned: apiResult.xpEarned || scoring.finalScore,
      };
    } catch (error) {
      console.error("Submission failed:", error);
      set({
        isRunning: false,
        timerInterval: null,
      });
      throw error;
    }
  },

  resetChallenge: () => {
    const { timerInterval } = get();
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    set({
      code: "",
      isRunning: false,
      results: [],
      hasSubmitted: false,
      elapsedTime: 0,
      startTime: null,
      timerInterval: null,
    });
  },
}));

export default useChallengeSolver;
