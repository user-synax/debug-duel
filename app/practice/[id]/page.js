import connectDB from "@/lib/db";
import Challenge from "@/models/Challenge";
import Submission from "@/models/Submission";
import ChallengeSolver from "@/components/challenge/ChallengeSolver";
import { auth } from "@/lib/auth";

export default async function ChallengeSolverPage({ params }) {
  await connectDB();

  const { id } = await params;
  const session = await auth();

  const challenge = await Challenge.findById(id).select(
    "-solutionCode"
  );

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white">Challenge not found</div>
      </div>
    );
  }

  // Check if user has already submitted this challenge
  let previousSubmission = null;
  if (session?.user?.id) {
    previousSubmission = await Submission.findOne({
      userId: session.user.id,
      challengeId: id,
      passed: true,
    }).lean();
  }

  return (
    <ChallengeSolver
      challenge={JSON.parse(JSON.stringify(challenge))}
      previousSubmission={previousSubmission}
    />
  );
}
