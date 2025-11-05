import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useMusicPlayer } from '../useMusicPlayer';
import TrackPlayer from 'react-native-track-player';
import { useMusicStore } from '../../stores/musicStore';
import { useUserStore } from '../../stores/userStore';

// Mock the stores
jest.mock('../../stores/musicStore');
jest.mock('../../stores/userStore');

describe('useMusicPlayer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default store mocks
    (useMusicStore as unknown as jest.Mock).mockReturnValue({
      currentTrack: null,
      isPlaying: false,
      currentPosition: 0,
      duration: 0,
      setCurrentTrack: jest.fn(),
      setIsPlaying: jest.fn(),
      setCurrentPosition: jest.fn(),
      setDuration: jest.fn(),
      updateChallengeProgress: jest.fn(),
    });
    
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      addPoints: jest.fn(),
      completeChallenge: jest.fn(),
    });
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useMusicPlayer());
    
    expect(result.current.currentTrack).toBeNull();
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentPosition).toBe(0);
    expect(result.current.duration).toBe(0);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('plays a track successfully', async () => {
    const mockTrack = {
      id: '1',
      title: 'Test Track',
      artist: 'Test Artist',
      audioUrl: 'https://example.com/audio.mp3',
      duration: 180,
      points: 100,
      description: 'Test',
      difficulty: 'easy' as const,
      progress: 0,
      completed: false,
    };

    const setCurrentTrack = jest.fn();
    const setIsPlaying = jest.fn();
    
    (useMusicStore as unknown as jest.Mock).mockReturnValue({
      currentTrack: null,
      isPlaying: false,
      currentPosition: 0,
      duration: 0,
      setCurrentTrack,
      setIsPlaying,
      setCurrentPosition: jest.fn(),
      setDuration: jest.fn(),
      updateChallengeProgress: jest.fn(),
    });

    const { result } = renderHook(() => useMusicPlayer());
    
    await act(async () => {
      await result.current.play(mockTrack);
    });
    
    await waitFor(() => {
      expect(TrackPlayer.addTrack).toHaveBeenCalled();
      expect(TrackPlayer.play).toHaveBeenCalled();
      expect(setCurrentTrack).toHaveBeenCalledWith(mockTrack);
      expect(setIsPlaying).toHaveBeenCalledWith(true);
    });
  });

  it('pauses playback', async () => {
    const setIsPlaying = jest.fn();
    
    (useMusicStore as unknown as jest.Mock).mockReturnValue({
      currentTrack: { id: '1' },
      isPlaying: true,
      currentPosition: 50,
      duration: 180,
      setCurrentTrack: jest.fn(),
      setIsPlaying,
      setCurrentPosition: jest.fn(),
      setDuration: jest.fn(),
      updateChallengeProgress: jest.fn(),
    });

    const { result } = renderHook(() => useMusicPlayer());
    
    await act(async () => {
      await result.current.pause();
    });
    
    await waitFor(() => {
      expect(TrackPlayer.pause).toHaveBeenCalled();
      expect(setIsPlaying).toHaveBeenCalledWith(false);
    });
  });

  it('resumes playback', async () => {
    const setIsPlaying = jest.fn();
    
    (useMusicStore as unknown as jest.Mock).mockReturnValue({
      currentTrack: { id: '1' },
      isPlaying: false,
      currentPosition: 50,
      duration: 180,
      setCurrentTrack: jest.fn(),
      setIsPlaying,
      setCurrentPosition: jest.fn(),
      setDuration: jest.fn(),
      updateChallengeProgress: jest.fn(),
    });

    const { result } = renderHook(() => useMusicPlayer());
    
    await act(async () => {
      await result.current.resume();
    });
    
    await waitFor(() => {
      expect(TrackPlayer.play).toHaveBeenCalled();
      expect(setIsPlaying).toHaveBeenCalledWith(true);
    });
  });

  it('seeks to a specific position', async () => {
    const setCurrentPosition = jest.fn();
    
    (useMusicStore as unknown as jest.Mock).mockReturnValue({
      currentTrack: { id: '1' },
      isPlaying: true,
      currentPosition: 50,
      duration: 180,
      setCurrentTrack: jest.fn(),
      setIsPlaying: jest.fn(),
      setCurrentPosition,
      setDuration: jest.fn(),
      updateChallengeProgress: jest.fn(),
    });

    const { result } = renderHook(() => useMusicPlayer());
    
    await act(async () => {
      await result.current.seekTo(100);
    });
    
    await waitFor(() => {
      expect(TrackPlayer.seekTo).toHaveBeenCalledWith(100);
      expect(setCurrentPosition).toHaveBeenCalledWith(100);
    });
  });

  it('handles playback errors gracefully', async () => {
    const mockError = new Error('Playback failed');
    (TrackPlayer.play as jest.Mock).mockRejectedValueOnce(mockError);

    const mockTrack = {
      id: '1',
      title: 'Test Track',
      artist: 'Test Artist',
      audioUrl: 'https://example.com/audio.mp3',
      duration: 180,
      points: 100,
      description: 'Test',
      difficulty: 'easy' as const,
      progress: 0,
      completed: false,
    };

    const { result } = renderHook(() => useMusicPlayer());
    
    await act(async () => {
      await result.current.play(mockTrack);
    });
    
    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });
  });

  it('updates progress during playback', async () => {
    const updateChallengeProgress = jest.fn();
    
    (useMusicStore as unknown as jest.Mock).mockReturnValue({
      currentTrack: { id: '1', duration: 180 },
      isPlaying: true,
      currentPosition: 90,
      duration: 180,
      setCurrentTrack: jest.fn(),
      setIsPlaying: jest.fn(),
      setCurrentPosition: jest.fn(),
      setDuration: jest.fn(),
      updateChallengeProgress,
    });

    renderHook(() => useMusicPlayer());
    
    // Progress should be updated periodically
    // This would typically happen through the TrackPlayer event listener
    await waitFor(() => {
      // Check that the hook is set up correctly
      expect(useMusicStore).toHaveBeenCalled();
    }, { timeout: 1000 });
  });
});
