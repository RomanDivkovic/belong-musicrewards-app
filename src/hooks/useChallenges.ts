// useChallenges hook - Manage challenge data and operations
import { useCallback, useState, useEffect } from 'react';
import { useMusicStore, selectChallenges } from '../stores/musicStore';
import { useUserStore, selectCompletedChallenges } from '../stores/userStore';
import type { UseChallengesReturn } from '../types';

export const useChallenges = (): UseChallengesReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Store selectors
  const challenges = useMusicStore(selectChallenges);
  const completedChallenges = useUserStore(selectCompletedChallenges);
  const loadChallenges = useMusicStore((state) => state.loadChallenges);
  const markChallengeComplete = useMusicStore((state) => state.markChallengeComplete);
  const userCompleteChallenge = useUserStore((state) => state.completeChallenge);
  const addPoints = useUserStore((state) => state.addPoints);

  // Load challenges on mount
  useEffect(() => {
    refreshChallenges();
  }, []);

  const refreshChallenges = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, you would fetch from an API here
      // For now, we just load from the store
      loadChallenges();
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load challenges';
      setError(errorMessage);
      console.error('Failed to refresh challenges:', err);
    } finally {
      setLoading(false);
    }
  }, [loadChallenges]);

  const completeChallenge = useCallback(async (challengeId: string) => {
    try {
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) {
        throw new Error('Challenge not found');
      }

      // Mark as complete in both stores
      markChallengeComplete(challengeId);
      userCompleteChallenge(challengeId);
      
      // Award points
      addPoints(challenge.points);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete challenge';
      setError(errorMessage);
      console.error('Failed to complete challenge:', err);
      throw err;
    }
  }, [challenges, markChallengeComplete, userCompleteChallenge, addPoints]);

  return {
    challenges,
    completedChallenges,
    loading,
    error,
    refreshChallenges,
    completeChallenge,
  };
};
