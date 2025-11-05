// usePointsCounter hook - Track points earned during playback
import { useState, useEffect, useCallback, useRef } from "react";
import { useProgress } from "react-native-track-player";
import type { PointsCounterConfig, UsePointsCounterReturn } from "../types";

export const usePointsCounter = (): UsePointsCounterReturn => {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [config, setConfig] = useState<PointsCounterConfig | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const progress = useProgress();

  const startCounting = useCallback((newConfig: PointsCounterConfig) => {
    setConfig(newConfig);
    setIsActive(true);
    setCurrentPoints(0);
    setPointsEarned(0);
  }, []);

  const stopCounting = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetProgress = useCallback(() => {
    setCurrentPoints(0);
    setPointsEarned(0);
  }, []);

  // Calculate points based on progress
  useEffect(() => {
    if (!isActive || !config || !progress.duration) return;

    const progressPercentage = (progress.position / progress.duration) * 100;
    const earnedPoints = Math.floor(
      (progressPercentage / 100) * config.totalPoints
    );

    if (earnedPoints > pointsEarned) {
      setPointsEarned(earnedPoints);
      setCurrentPoints(earnedPoints);
    }
  }, [progress.position, progress.duration, isActive, config, pointsEarned]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    currentPoints,
    pointsEarned,
    progress:
      config && progress.duration
        ? (progress.position / progress.duration) * 100
        : 0,
    isActive,
    startCounting,
    stopCounting,
    resetProgress,
  };
};
