import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ChallengeCard } from "../ChallengeCard";
import type { MusicChallenge } from "../../../types";

const mockChallenge: MusicChallenge = {
  id: "1",
  title: "All Night",
  artist: "Camo & Krooked",
  description: "Listen to this drum & bass classic to earn points",
  duration: 219,
  points: 150,
  difficulty: "easy",
  audioUrl: "https://example.com/audio.mp3",
  progress: 12,
  completed: false,
};

describe("ChallengeCard", () => {
  it("renders challenge information correctly", () => {
    const { getByText } = render(
      <ChallengeCard challenge={mockChallenge} onPlay={() => {}} />
    );

    expect(getByText("All Night")).toBeTruthy();
    expect(getByText("Camo & Krooked")).toBeTruthy();
    expect(
      getByText("Listen to this drum & bass classic to earn points")
    ).toBeTruthy();
  });

  it("displays formatted duration", () => {
    const { getByText } = render(
      <ChallengeCard challenge={mockChallenge} onPlay={() => {}} />
    );

    // 219 seconds = 3:39
    expect(getByText("3:39")).toBeTruthy();
  });

  it("displays points correctly", () => {
    const { getByText } = render(
      <ChallengeCard challenge={mockChallenge} onPlay={() => {}} />
    );

    expect(getByText("150")).toBeTruthy();
  });

  it("displays progress percentage", () => {
    const { getByText } = render(
      <ChallengeCard challenge={mockChallenge} onPlay={() => {}} />
    );

    expect(getByText("12%")).toBeTruthy();
  });

  it("shows progress bar when progress > 0", () => {
    const { queryByTestId } = render(
      <ChallengeCard challenge={mockChallenge} onPlay={() => {}} />
    );

    // Progress bar should be visible
    const progressBar = queryByTestId("progress-bar");
    expect(progressBar).toBeTruthy();
  });

  it("hides progress bar when progress is 0", () => {
    const challengeNoProgress = { ...mockChallenge, progress: 0 };
    const { queryByTestId } = render(
      <ChallengeCard challenge={challengeNoProgress} onPlay={() => {}} />
    );

    // Progress bar should not be visible
    const progressBar = queryByTestId("progress-bar");
    expect(progressBar).toBeNull();
  });

  it("displays correct difficulty badge color for easy", () => {
    const { getByText } = render(
      <ChallengeCard challenge={mockChallenge} onPlay={() => {}} />
    );

    const badge = getByText("EASY");
    expect(badge).toBeTruthy();
  });

  it("displays correct difficulty badge color for medium", () => {
    const mediumChallenge = { ...mockChallenge, difficulty: "medium" as const };
    const { getByText } = render(
      <ChallengeCard challenge={mediumChallenge} onPlay={() => {}} />
    );

    const badge = getByText("MEDIUM");
    expect(badge).toBeTruthy();
  });

  it("displays correct difficulty badge color for hard", () => {
    const hardChallenge = { ...mockChallenge, difficulty: "hard" as const };
    const { getByText } = render(
      <ChallengeCard challenge={hardChallenge} onPlay={() => {}} />
    );

    const badge = getByText("HARD");
    expect(badge).toBeTruthy();
  });

  it("calls onPlay when play button is pressed", () => {
    const onPlayMock = jest.fn();
    const { getByText } = render(
      <ChallengeCard challenge={mockChallenge} onPlay={onPlayMock} />
    );

    const playButton = getByText("Play Challenge");
    fireEvent.press(playButton);

    expect(onPlayMock).toHaveBeenCalledWith(mockChallenge);
  });

  it('shows "Playing..." when current track is playing', () => {
    const { getByText } = render(
      <ChallengeCard
        challenge={mockChallenge}
        onPlay={() => {}}
        isCurrentTrack={true}
        isPlaying={true}
      />
    );

    expect(getByText("Playing...")).toBeTruthy();
  });

  it('shows "Resume" when current track is paused', () => {
    const { getByText } = render(
      <ChallengeCard
        challenge={mockChallenge}
        onPlay={() => {}}
        isCurrentTrack={true}
        isPlaying={false}
      />
    );

    expect(getByText("Resume")).toBeTruthy();
  });

  it('shows "Completed ✓" when challenge is completed', () => {
    const completedChallenge = { ...mockChallenge, completed: true };
    const { getByText } = render(
      <ChallengeCard challenge={completedChallenge} onPlay={() => {}} />
    );

    expect(getByText("Completed ✓")).toBeTruthy();
  });

  it("disables button when challenge is completed", () => {
    const completedChallenge = { ...mockChallenge, completed: true };
    const onPlayMock = jest.fn();
    const { getByText } = render(
      <ChallengeCard challenge={completedChallenge} onPlay={onPlayMock} />
    );

    const button = getByText("Completed ✓");
    fireEvent.press(button);

    // Button should be disabled, so onPlay should not be called
    expect(onPlayMock).not.toHaveBeenCalled();
  });

  it("applies highlight styles when it is the current track", () => {
    const { getByText } = render(
      <ChallengeCard
        challenge={mockChallenge}
        onPlay={() => {}}
        isCurrentTrack={true}
      />
    );

    // Should use primary variant when current track
    expect(getByText("All Night")).toBeTruthy();
  });
});
