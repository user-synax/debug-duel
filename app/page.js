import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Globe, Palette, Zap, Atom, Shield, Trophy, Star, Award, Crown } from "lucide-react";
import connectDB from "@/lib/db";
import User from "@/models/User";

async function getTopUsers() {
  try {
    await connectDB();
    const topUsers = await User.find()
      .sort({ xp: -1 })
      .limit(4)
      .select("username xp avatar")
      .lean();
    return topUsers;
  } catch (error) {
    console.error("Error fetching top users:", error);
    return [];
  }
}

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  const topUsers = await getTopUsers();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-5 landing-grid" />

        {/* Scanline Effect */}
        <div className="absolute inset-0 opacity-5 pointer-events-none landing-scanlines" />

        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight font-space-grotesk">
                Debug Faster Than Everyone Else.
              </h1>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                The competitive platform where frontend developers race to fix real bugs. Level up. Rank up. Win.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/login"
                  className="px-8 py-4 bg-[#00ff87] text-black font-bold rounded-lg hover:bg-[#00cc6a] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#00ff87]/20 text-lg text-center cursor-pointer"
                >
                  Start Debugging Free
                </Link>
                <Link 
                  href="/replays"
                  className="px-8 py-4 border-2 border-[#00ff87] text-[#00ff87] font-bold rounded-lg hover:bg-[#00ff87]/10 transition-all duration-300 hover:scale-105 text-lg text-center cursor-pointer"
                >
                  Watch a Match
                </Link>
              </div>
            </div>

            {/* Animated Code Mockup */}
            <div className="relative">
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg overflow-hidden shadow-2xl">
                <div className="bg-[#1a1a1a] px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff4444]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffaa00]" />
                  <div className="w-3 h-3 rounded-full bg-[#00ff87]" />
                </div>
                <div className="p-6 font-mono text-sm">
                  <div className="text-gray-500 mb-2">&lt;!-- Bug: Missing label --&gt;</div>
                  <div className="text-white mb-2">&lt;input type="text" name="email"&gt;</div>
                  <div className="text-[#00ff87] mb-2 animate-pulse">|</div>
                  <div className="text-gray-500 mb-4"># Fix: Add label</div>
                  <div className="text-white mb-2">&lt;label for="email"&gt;Email&lt;/label&gt;</div>
                  <div className="text-white">&lt;input type="email" id="email"&gt;</div>
                </div>
              </div>

              {/* Floating Rank Badges */}
              <div className="absolute -top-8 -right-8 bg-[#111111] border border-[#2a2a2a] rounded-lg px-4 py-2 opacity-50">
                <span className="text-purple-400 text-sm font-bold">Architect</span>
              </div>
              <div className="absolute -bottom-8 -left-8 bg-[#111111] border border-[#2a2a2a] rounded-lg px-4 py-2 opacity-50">
                <span className="text-green-400 text-sm font-bold">Senior</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white text-center mb-4 font-space-grotesk">
            Tired of algorithm puzzles that don't match real work?
          </h2>
          <p className="text-gray-400 text-center mb-12 text-lg">
            DebugDuel uses actual bugs you'll encounter in production.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-400 mb-4">LeetCode</h3>
              <ul className="space-y-3 text-gray-500">
                <li>• Abstract algorithm problems</li>
                <li>• Rarely used in daily work</li>
                <li>• No real-world context</li>
                <li>• Binary trees everywhere</li>
              </ul>
            </div>
            <div className="bg-[#111111] border border-[#00ff87]/30 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-[#00ff87] mb-4">DebugDuel</h3>
              <ul className="space-y-3 text-white">
                <li>• Real frontend bugs</li>
                <li>• HTML, CSS, JS, React</li>
                <li>• Production-ready skills</li>
                <li>• Competitive 1v1 matches</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white text-center mb-16 font-space-grotesk">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#111111] border-2 border-[#00ff87] rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-[#00ff87]">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Pick a Bug</h3>
              <p className="text-gray-400">Choose from HTML, CSS, JavaScript, or React challenges</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#111111] border-2 border-[#00ff87] rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-[#00ff87]">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Write the Fix</h3>
              <p className="text-gray-400">Edit the code in our editor and run tests to verify</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#111111] border-2 border-[#00ff87] rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-[#00ff87]">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Win the Round</h3>
              <p className="text-gray-400">Beat your opponent's time and climb the ranks</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bug Categories */}
      <section className="py-20 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white text-center mb-16 font-space-grotesk">
            Bug Categories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#ff6b35] transition-colors">
              <Globe className="w-12 h-12 mb-4 text-[#ff6b35]" />
              <h3 className="text-xl font-bold text-white mb-2">HTML</h3>
              <p className="text-gray-400 text-sm">Accessibility, forms, structure</p>
            </div>
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#3b82f6] transition-colors">
              <Palette className="w-12 h-12 mb-4 text-[#3b82f6]" />
              <h3 className="text-xl font-bold text-white mb-2">CSS</h3>
              <p className="text-gray-400 text-sm">Layout, flexbox, grid, responsive</p>
            </div>
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#eab308] transition-colors">
              <Zap className="w-12 h-12 mb-4 text-[#eab308]" />
              <h3 className="text-xl font-bold text-white mb-2">JavaScript</h3>
              <p className="text-gray-400 text-sm">Async, closures, DOM, events</p>
            </div>
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#06b6d4] transition-colors">
              <Atom className="w-12 h-12 mb-4 text-[#06b6d4]" />
              <h3 className="text-xl font-bold text-white mb-2">React</h3>
              <p className="text-gray-400 text-sm">Hooks, state, effects, performance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white text-center mb-16 font-space-grotesk">
            Top Debuggers
          </h2>

          <div className="max-w-2xl mx-auto bg-[#111111] border border-[#2a2a2a] rounded-lg overflow-hidden">
            {topUsers.length > 0 ? (
              topUsers.map((user, index) => (
                <div key={user._id} className={`p-4 ${index < topUsers.length - 1 ? 'border-b border-[#2a2a2a]' : ''} bg-[#1a1a1a]`}>
                  <div className="flex items-center gap-4">
                    <span className={`font-bold ${index === 0 ? 'text-[#ffaa00]' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-[#ff6b35]' : 'text-gray-400'}`}>
                      {index + 1}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center text-white font-bold">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full" />
                      ) : (
                        user.username[0].toUpperCase()
                      )}
                    </div>
                    <span className="text-white font-medium">{user.username}</span>
                    <span className="ml-auto text-[#00ff87] font-bold">{user.xp.toLocaleString()} XP</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400">
                <p>No users yet. Be the first to join!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Rank System */}
      <section className="py-20 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white text-center mb-4 font-space-grotesk">
            Rank System
          </h2>
          <p className="text-gray-400 text-center mb-16 text-lg">Where will you land?</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 text-center">
              <Shield className="w-12 h-12 mb-2 mx-auto text-orange-400" />
              <h3 className="text-lg font-bold text-orange-400">Intern</h3>
            </div>
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 text-center">
              <Star className="w-12 h-12 mb-2 mx-auto text-yellow-400" />
              <h3 className="text-lg font-bold text-yellow-400">Junior</h3>
            </div>
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 text-center">
              <Trophy className="w-12 h-12 mb-2 mx-auto text-yellow-400" />
              <h3 className="text-lg font-bold text-yellow-400">Mid</h3>
            </div>
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 text-center">
              <Award className="w-12 h-12 mb-2 mx-auto text-green-400" />
              <h3 className="text-lg font-bold text-green-400">Senior</h3>
            </div>
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 text-center">
              <Shield className="w-12 h-12 mb-2 mx-auto text-blue-400" />
              <h3 className="text-lg font-bold text-blue-400">Staff</h3>
            </div>
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 text-center">
              <Trophy className="w-12 h-12 mb-2 mx-auto text-pink-400" />
              <h3 className="text-lg font-bold text-pink-400">Principal</h3>
            </div>
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 text-center col-span-2 md:col-span-2">
              <Crown className="w-12 h-12 mb-2 mx-auto text-purple-400" />
              <h3 className="text-lg font-bold text-purple-400">Architect</h3>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4 font-space-grotesk">
            Join 1,000+ developers improving daily
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Start debugging real bugs and climb the competitive ladder today.
          </p>
          <Link 
            href="/login"
            className="inline-block px-12 py-4 bg-[#00ff87] text-black font-bold rounded-lg hover:bg-[#00cc6a] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#00ff87]/20 text-xl cursor-pointer"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
