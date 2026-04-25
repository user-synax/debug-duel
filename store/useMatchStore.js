// Match state management with Zustand
import { create } from 'zustand';

const useMatchStore = create((set) => ({
  matchId: null,
  challenge: null,
  opponent: null,
  myResults: null,
  opponentProgress: { passed: 0, total: 0 },
  matchStatus: "idle", // idle, queueing, matched, active, completed
  matchResult: null,
  timer: null,

  setMatchId: (matchId) => set({ matchId }),
  setChallenge: (challenge) => set({ challenge }),
  setOpponent: (opponent) => set({ opponent }),
  setMyResults: (results) => set({ myResults: results }),
  setOpponentProgress: (progress) => set({ opponentProgress: progress }),
  setMatchStatus: (status) => set({ matchStatus: status }),
  setMatchResult: (result) => set({ matchResult: result }),
  setTimer: (timer) => set({ timer }),
  reset: () =>
    set({
      matchId: null,
      challenge: null,
      opponent: null,
      myResults: null,
      opponentProgress: { passed: 0, total: 0 },
      matchStatus: "idle",
      matchResult: null,
      timer: null,
    }),
}));

export default useMatchStore;
