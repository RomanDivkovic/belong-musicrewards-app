import { renderHook, act } from "@testing-library/react-native";
import TrackPlayer from "react-native-track-player";
import { useMusicPlayer } from "../useMusicPlayer";

// This test file validates the useMusicPlayer hook
// Note: Due to the complexity of mocking Zustand stores with nested selectors,
// these tests verify the hook's basic interface and functionality

describe("useMusicPlayer", () => {
  it("returns the expected interface", () => {
    const { result } = renderHook(() => useMusicPlayer());

    // Verify hook returns expected methods and properties
    expect(typeof result.current.play).toBe("function");
    expect(typeof result.current.pause).toBe("function");
    expect(typeof result.current.seekTo).toBe("function");
    expect(typeof result.current.resume).toBe("function");
    expect(typeof result.current.isPlaying).toBe("boolean");
    expect(typeof result.current.loading).toBe("boolean");
    expect(result.current.currentPosition).toBeGreaterThanOrEqual(0);
    expect(result.current.duration).toBeGreaterThanOrEqual(0);
  });

  it("has async methods that can be called without errors", async () => {
    const { result } = renderHook(() => useMusicPlayer());

    const mockChallenge = {
      id: "1",
      title: "Test",
      artist: "Artist",
      description: "Test",
      duration: 180,
      points: 100,
      difficulty: "easy" as const,
      audioUrl: "https://example.com/audio.mp3",
      progress: 0,
      completed: false,
    };

    // Verify functions can be called
    await act(async () => {
      await result.current.play(mockChallenge);
    });

    await act(async () => {
      await result.current.pause();
    });

    await act(async () => {
      await result.current.resume();
    });

    await act(async () => {
      await result.current.seekTo(30);
    });

    // Verify TrackPlayer methods were called
    expect(TrackPlayer.play).toHaveBeenCalled();
    expect(TrackPlayer.pause).toHaveBeenCalled();
    expect(TrackPlayer.seekTo).toHaveBeenCalledWith(30);
  });
});
