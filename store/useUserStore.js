// User state management with Zustand
import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: null,
  score: 0,
  challengesCompleted: 0,
  streak: 0,
  setUser: (user) => set({ user }),
  setScore: (score) => set({ score }),
  setChallengesCompleted: (challengesCompleted) => set({ challengesCompleted }),
  setStreak: (streak) => set({ streak }),
  reset: () => set({ user: null, score: 0, challengesCompleted: 0, streak: 0 }),
}));

export default useUserStore;
