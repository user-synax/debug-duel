export function scoreSubmission(results, timeTaken, difficulty) {
  const baseScores = {
    easy: 100,
    medium: 200,
    hard: 400,
  };

  const baseScore = baseScores[difficulty] || 100;
  const failedTests = results.filter((r) => !r.passed).length;
  const totalTests = results.length;

  // Calculate deduction for failed tests (20% of base score per failed test)
  const deductionPerTest = baseScore * 0.2;
  const totalDeduction = failedTests * deductionPerTest;

  // Calculate time bonus
  let timeBonus = 0;
  const timeTakenSeconds = timeTaken / 1000;

  if (timeTakenSeconds < 60) {
    timeBonus = 50;
  } else if (timeTakenSeconds < 120) {
    timeBonus = 25;
  } else if (timeTakenSeconds < 240) {
    timeBonus = 10;
  }

  // Calculate final score
  let finalScore = baseScore - totalDeduction + timeBonus;

  // Ensure minimum score is 0
  finalScore = Math.max(0, finalScore);

  return {
    baseScore,
    timeBonus,
    totalDeduction,
    finalScore,
    passed: failedTests === 0,
  };
}
