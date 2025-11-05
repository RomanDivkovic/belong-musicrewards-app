import { renderHook, act } from "@testing-library/react-native";
import { useMusicStore } from "../musicStore";
import type { MusicChallenge } from "../../types";

describe("musicStore", () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useMusicStore());
    act(() => {
      result.current.setCurrentTrack(null);
      result.current.setIsPlaying(false);
      result.current.setCurrentPosition(0);
    });
  });

  it("initializes with default values", () => {
    const { result } = renderHook(() => useMusicStore());

    expect(result.current.currentTrack).toBeNull();
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentPosition).toBe(0);
    expect(result.current.challenges).toHaveLength(2);
  });

  it("sets current track", () => {
    const { result } = renderHook(() => useMusicStore());
    const mockTrack: MusicChallenge = {
      id: "1",
      title: "Test Track",
      artist: "Test Artist",
      description: "Test Description",
      duration: 180,
      points: 100,
      difficulty: "easy",
      audioUrl: "https://example.com/audio.mp3",
      progress: 0,
      completed: false,
    };

    act(() => {
      result.current.setCurrentTrack(mockTrack);
    });

    expect(result.current.currentTrack).toEqual(mockTrack);
  });

  it("sets playing state", () => {
    const { result } = renderHook(() => useMusicStore());

    act(() => {
      result.current.setIsPlaying(true);
    });

    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.setIsPlaying(false);
    });

    expect(result.current.isPlaying).toBe(false);
  });

  it("updates current position", () => {
    const { result } = renderHook(() => useMusicStore());

    act(() => {
      result.current.setCurrentPosition(50);
    });

    expect(result.current.currentPosition).toBe(50);
  });

  it("updates challenge progress", () => {
    const { result } = renderHook(() => useMusicStore());
    const challengeId = result.current.challenges[0].id;

    act(() => {
      result.current.updateProgress(challengeId, 50);
    });

    const updatedChallenge = result.current.challenges.find(
      (c) => c.id === challengeId
    );
    expect(updatedChallenge?.progress).toBe(50);
  });

  it("marks challenge as completed when progress reaches 100%", () => {
    const { result } = renderHook(() => useMusicStore());
    const challengeId = result.current.challenges[0].id;

    act(() => {
      result.current.markChallengeComplete(challengeId);
    });

    const updatedChallenge = result.current.challenges.find(
      (c) => c.id === challengeId
    );
    expect(updatedChallenge?.completed).toBe(true);
    expect(updatedChallenge?.progress).toBe(100);
  });

  it("does not update progress for non-existent challenge", () => {
    const { result } = renderHook(() => useMusicStore());
    const initialChallenges = [...result.current.challenges];

    act(() => {
      result.current.updateProgress("non-existent-id", 50);
    });

    expect(result.current.challenges).toEqual(initialChallenges);
  });

  it("gets challenge by id", () => {
    const { result } = renderHook(() => useMusicStore());
    const firstChallengeId = result.current.challenges[0].id;

    const challenge = result.current.challenges.find(
      (c) => c.id === firstChallengeId
    );

    expect(challenge).toBeDefined();
    expect(challenge?.id).toBe(firstChallengeId);
  });

  it("persists state to AsyncStorage", async () => {
    const { result } = renderHook(() => useMusicStore());
    const mockTrack: MusicChallenge = {
      id: "1",
      title: "Test Track",
      artist: "Test Artist",
      description: "Test Description",
      duration: 180,
      points: 100,
      difficulty: "easy",
      audioUrl: "https://example.com/audio.mp3",
      progress: 0,
      completed: false,
    };

    act(() => {
      result.current.setCurrentTrack(mockTrack);
      result.current.setCurrentPosition(50);
    });

    // Give time for AsyncStorage to persist
    await new Promise((resolve) => setTimeout(resolve, 100));

    // State should be persisted
    expect(result.current.currentTrack).toEqual(mockTrack);
    expect(result.current.currentPosition).toBe(50);
  });
});
