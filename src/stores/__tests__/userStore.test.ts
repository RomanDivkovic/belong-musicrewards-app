import { renderHook, act } from "@testing-library/react-native";
import { useUserStore } from "../userStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

describe("userStore", () => {
  beforeEach(async () => {
    // Clear AsyncStorage before each test
    await AsyncStorage.clear();
    // Reset the store
    const { result } = renderHook(() => useUserStore());
    act(() => {
      result.current.resetProgress();
    });
  });

  describe("initialization", () => {
    it("initializes with default values", () => {
      const { result } = renderHook(() => useUserStore());

      expect(result.current.totalPoints).toBe(0);
      expect(result.current.completedChallenges).toEqual([]);
    });
  });

  describe("addPoints", () => {
    it("adds points correctly", () => {
      const { result } = renderHook(() => useUserStore());

      act(() => {
        result.current.addPoints(100);
      });

      expect(result.current.totalPoints).toBe(100);
    });

    it("handles adding zero points", () => {
      const { result } = renderHook(() => useUserStore());

      act(() => {
        result.current.addPoints(0);
      });

      expect(result.current.totalPoints).toBe(0);
    });

    it("accumulates points from multiple challenges", () => {
      const { result } = renderHook(() => useUserStore());

      act(() => {
        result.current.addPoints(150); // Challenge 1
      });

      expect(result.current.totalPoints).toBe(150);

      act(() => {
        result.current.addPoints(300); // Challenge 2
      });

      expect(result.current.totalPoints).toBe(450);

      act(() => {
        result.current.addPoints(150); // Challenge 3
      });

      expect(result.current.totalPoints).toBe(600);
    });

    it("handles large point values", () => {
      const { result } = renderHook(() => useUserStore());

      act(() => {
        result.current.addPoints(10000);
      });

      expect(result.current.totalPoints).toBe(10000);
    });
  });

  describe("completeChallenge", () => {
    it("adds challenge ID to completedChallenges array", () => {
      const { result } = renderHook(() => useUserStore());

      act(() => {
        result.current.completeChallenge("challenge-1");
      });

      expect(result.current.completedChallenges).toContain("challenge-1");
      expect(result.current.completedChallenges).toHaveLength(1);
    });

    it("does not duplicate challenge IDs", () => {
      const { result } = renderHook(() => useUserStore());

      act(() => {
        result.current.completeChallenge("challenge-1");
        result.current.completeChallenge("challenge-1"); // Try to complete again
      });

      expect(result.current.completedChallenges).toContain("challenge-1");
      expect(result.current.completedChallenges).toHaveLength(1); // Should still be 1
    });

    it("tracks multiple different challenges", () => {
      const { result } = renderHook(() => useUserStore());

      act(() => {
        result.current.completeChallenge("challenge-1");
        result.current.completeChallenge("challenge-2");
        result.current.completeChallenge("challenge-3");
      });

      expect(result.current.completedChallenges).toHaveLength(3);
      expect(result.current.completedChallenges).toContain("challenge-1");
      expect(result.current.completedChallenges).toContain("challenge-2");
      expect(result.current.completedChallenges).toContain("challenge-3");
    });
  });

  describe("resetProgress", () => {
    it("resets all progress to initial state", () => {
      const { result } = renderHook(() => useUserStore());

      // Add some data first
      act(() => {
        result.current.addPoints(500);
        result.current.completeChallenge("challenge-1");
        result.current.completeChallenge("challenge-2");
      });

      // Verify data is set
      expect(result.current.totalPoints).toBe(500);
      expect(result.current.completedChallenges).toHaveLength(2);

      // Reset
      act(() => {
        result.current.resetProgress();
      });

      // Verify reset
      expect(result.current.totalPoints).toBe(0);
      expect(result.current.completedChallenges).toEqual([]);
    });
  });

  describe("integration scenarios", () => {
    it("simulates completing a challenge and earning points", () => {
      const { result } = renderHook(() => useUserStore());

      // Complete a challenge
      act(() => {
        result.current.addPoints(150);
        result.current.completeChallenge("all-night");
      });

      expect(result.current.totalPoints).toBe(150);
      expect(result.current.completedChallenges).toContain("all-night");
    });

    it("simulates completing multiple challenges", () => {
      const { result } = renderHook(() => useUserStore());

      // Complete first challenge (150 points)
      act(() => {
        result.current.addPoints(150);
        result.current.completeChallenge("all-night");
      });

      // Complete second challenge (300 points)
      act(() => {
        result.current.addPoints(300);
        result.current.completeChallenge("perfect-run");
      });

      // Complete third challenge (150 points)
      act(() => {
        result.current.addPoints(150);
        result.current.completeChallenge("all-night"); // Already completed, shouldn't duplicate
      });

      expect(result.current.totalPoints).toBe(600);
      expect(result.current.completedChallenges).toHaveLength(2); // Only 2 unique challenges
    });

    it("simulates earning points without completing challenges", () => {
      const { result } = renderHook(() => useUserStore());

      // Earn points (partial progress)
      act(() => {
        result.current.addPoints(150);
      });

      // No challenge completed yet
      expect(result.current.totalPoints).toBe(150);
      expect(result.current.completedChallenges).toHaveLength(0);
    });

    it("persists state to AsyncStorage", async () => {
      const { result } = renderHook(() => useUserStore());

      act(() => {
        result.current.addPoints(500);
        result.current.completeChallenge("all-night");
      });

      // Wait for AsyncStorage to be called
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify AsyncStorage was called
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it("simulates user earning 6600 points over multiple sessions", () => {
      const { result } = renderHook(() => useUserStore());

      // Simulate completing "All Night" challenge 44 times (150 points each)
      act(() => {
        for (let i = 0; i < 44; i++) {
          result.current.addPoints(150);
        }
      });

      expect(result.current.totalPoints).toBe(6600);
    });

    it("simulates real scenario: complete challenge once, earn points multiple times", () => {
      const { result } = renderHook(() => useUserStore());

      // Complete challenge once (marks it as completed)
      act(() => {
        result.current.completeChallenge("all-night");
        result.current.addPoints(150);
      });

      // Repeat the challenge (already marked complete, but still earn points)
      act(() => {
        result.current.completeChallenge("all-night"); // Won't duplicate
        result.current.addPoints(150);
      });

      expect(result.current.completedChallenges).toHaveLength(1); // Only 1 unique challenge
      expect(result.current.totalPoints).toBe(300); // But earned points twice
    });
  });
});
