# MusicRewards Architecture Documentation

## Overview

MusicRewards is a React Native mobile app built using Expo that demonstrates modern mobile development patterns inspired by the Belong mobile app architecture. The app allows users to complete music listening challenges and earn points.

## Tech Stack

- **Framework:** React Native with Expo SDK 54
- **Navigation:** Expo Router (file-based routing)
- **State Management:** Zustand with AsyncStorage persistence
- **Audio Playback:** react-native-track-player v4.1.2
- **Styling:** StyleSheet with Glass/Blur effects (expo-blur)
- **UI Effects:** expo-linear-gradient for glass morphism
- **TypeScript:** Full type safety throughout

## Architecture Principles

### 1. **Separation of Concerns**

The app follows a clear separation between:
- **UI Components** (`src/components/`) - Pure presentational logic
- **Business Logic** (`src/hooks/`) - Orchestration and side effects
- **State Management** (`src/stores/`) - Global state and data persistence
- **Services** (`src/services/`) - External integrations (audio playback)

### 2. **State Management Pattern**

#### Zustand Stores

Two domain-focused stores manage application state:

**MusicStore** (`src/stores/musicStore.ts`)
- Manages music challenges, playback state, and progress tracking
- Persists only challenge data (not playback state)
- Uses selector pattern for performance optimization

**UserStore** (`src/stores/userStore.ts`)
- Manages user points and completed challenges
- Fully persisted to AsyncStorage
- Independent from playback state for clean separation

#### Why Zustand?

1. **Simplicity:** Minimal boilerplate compared to Redux
2. **Performance:** Built-in selector optimization
3. **TypeScript:** Excellent type inference
4. **Middleware:** Easy persistence with zustand/middleware
5. **Belonging Pattern:** Matches Belong's state management approach

### 3. **Custom Hooks Architecture**

Business logic is encapsulated in custom hooks that orchestrate store actions:

**useMusicPlayer** (`src/hooks/useMusicPlayer.ts`)
- Integrates react-native-track-player with Zustand stores
- Handles play, pause, seek, and progress tracking
- Updates both music and user stores during playback
- Automatically awards points when challenges are completed
- Error handling and loading states

**usePointsCounter** (`src/hooks/usePointsCounter.ts`)
- Calculates real-time points based on playback progress
- Uses TrackPlayer's useProgress hook for accurate timing
- Supports starting, stopping, and resetting counters
- Designed for potential animation integration

**useChallenges** (`src/hooks/useChallenges.ts`)
- Manages challenge loading and refreshing
- Handles challenge completion logic
- Coordinates between music and user stores
- Provides error handling and loading states

### 4. **Component Architecture**

#### Glass Design System

All UI components follow a glass morphism design pattern:

**GlassCard** (`src/components/ui/GlassCard.tsx`)
- Base component using BlurView and LinearGradient
- Configurable blur intensity and gradient colors
- Consistent border styling with theme integration
- Used throughout the app for visual consistency

**GlassButton** (`src/components/ui/GlassButton.tsx`)
- Interactive button with glass effect
- Primary and secondary variants
- Loading and disabled states
- TouchableOpacity for press feedback

**PointsCounter** (`src/components/ui/PointsCounter.tsx`)
- Animated points display
- Scale animation on value change
- Glass card wrapper for consistency

#### Domain Components

**ChallengeCard** (`src/components/challenge/ChallengeCard.tsx`)
- Displays individual challenge information
- Difficulty badge with dynamic coloring
- Progress indicator
- Play/pause state management
- Visual highlighting for current track

**ChallengeList** (`src/components/challenge/ChallengeList.tsx`)
- FlatList wrapper with optimized rendering
- Pull-to-refresh functionality
- Empty state handling
- Consistent spacing and styling

### 5. **Navigation Structure**

Expo Router provides file-based routing with a clear hierarchy:

```
app/
├── _layout.tsx                 # Root layout (Stack)
├── (tabs)/
│   ├── _layout.tsx            # Tab navigation
│   ├── index.tsx              # Home screen
│   └── profile.tsx            # Profile screen
└── (modals)/
    ├── _layout.tsx            # Modal presentation
    └── player.tsx             # Audio player modal
```

**Benefits:**
- Type-safe navigation with TypeScript
- Automatic deep linking support
- Clean separation of tab vs modal flows
- Easy to understand and maintain

### 6. **Audio Implementation**

#### TrackPlayer Integration

**Service Setup** (`src/services/audioService.ts`)
- Initializes TrackPlayer with proper capabilities
- Configures background playback behavior
- Handles common operations (play, pause, seek)
- Error handling and logging

**Playback Service** (`src/services/playbackService.ts`)
- Required for background audio
- Handles system media controls
- Responds to lock screen controls
- Event handling for playback state

#### Why react-native-track-player?

1. **Background Playback:** Unlike expo-av, supports true background audio
2. **System Integration:** Lock screen controls, notification center
3. **Performance:** Optimized for long-form audio playback
4. **Cross-platform:** Consistent behavior on iOS and Android
5. **Event System:** Rich event hooks for tracking playback state

### 7. **Type Safety**

All types are centralized in `src/types/index.ts`:

```typescript
MusicChallenge      // Challenge data structure
UseMusicPlayerReturn // Music player hook interface
UsePointsCounterReturn // Points counter hook interface
UseChallengesReturn  // Challenges hook interface
PointsCounterConfig  // Points counter configuration
```

**Benefits:**
- Single source of truth for data structures
- Easy refactoring with TypeScript compiler support
- IntelliSense support in IDEs
- Prevents runtime type errors

### 8. **Design Tokens**

Theme constants in `src/constants/theme.ts`:

```typescript
THEME = {
  colors: {...},      // Belong color palette
  fonts: {...},       // Typography scale
  spacing: {...},     // Spacing system
  borderRadius: {...},// Border radius scale
  glass: {...}        // Glass effect configuration
}
```

**Belong Brand Colors:**
- Purple (#7553DB): Primary brand color
- Green (#34CB76): Success/completion states
- Yellow (#FCBE25): Accent/points/progress

### 9. **Performance Considerations**

#### Zustand Selectors
```typescript
// ❌ Bad: Re-renders on any state change
const store = useMusicStore();

// ✅ Good: Only re-renders when specific value changes
const challenges = useMusicStore(state => state.challenges);
```

#### Component Optimization
- FlatList for efficient list rendering
- Memoization of expensive operations in hooks
- Proper cleanup in useEffect hooks
- Avoid anonymous functions in render

#### Memory Management
- TrackPlayer cleanup on unmount
- Interval cleanup in usePointsCounter
- Event listener cleanup in playback service

### 10. **Error Handling Strategy**

**Three-Layer Approach:**

1. **Service Level:** Catch and log errors in audio/API services
2. **Hook Level:** Transform errors into user-friendly messages
3. **Component Level:** Display errors to users with fallback UI

Example:
```typescript
try {
  await play(track);
} catch (err) {
  setError(err instanceof Error ? err.message : 'Playback failed');
  console.error('TrackPlayer error:', err);
}
```

### 11. **State Persistence**

**What Gets Persisted:**
- ✅ User total points
- ✅ Completed challenge IDs
- ✅ Challenge progress percentages
- ❌ Current playback position (intentional)
- ❌ Playing/paused state (intentional)

**Why This Approach:**
- Persistent data: User achievements and progress
- Ephemeral data: Current playback session
- Prevents resume issues when app restarts
- Clean slate on each launch

## Data Flow

### Starting a Challenge
1. User taps "Play Challenge" on ChallengeCard
2. HomeScreen calls `useMusicPlayer().play(challenge)`
3. Hook resets TrackPlayer and adds new track
4. TrackPlayer starts playback
5. Store updates `currentTrack` and `isPlaying`
6. Router navigates to player modal
7. Progress updates trigger store mutations
8. Points calculated based on progress
9. At 90% completion, challenge marked complete
10. Points awarded to user store
11. Both stores persist to AsyncStorage

### Navigation Flow
```
Home Screen (Challenges List)
    ↓ [Tap Play]
Player Modal (Full-screen player)
    ↓ [Back/Close]
Home Screen
    ↓ [Tap Profile Tab]
Profile Screen (User Stats)
```

## Testing Strategy

### Recommended Test Coverage

1. **Unit Tests:**
   - Custom hooks (useMusicPlayer, usePointsCounter, useChallenges)
   - Zustand store actions and selectors
   - Utility functions (time formatting, progress calculation)

2. **Integration Tests:**
   - TrackPlayer integration with stores
   - Navigation flows
   - Points calculation during playback

3. **E2E Tests:**
   - Complete challenge flow
   - State persistence across app restarts
   - Audio playback interruption handling

### Testing Tools
- **Jest:** Unit and integration tests
- **React Native Testing Library:** Component tests
- **Detox:** E2E testing on simulators/devices

## Scalability Considerations

### Adding Features

**Playlists:**
- New `PlaylistStore` with playlist management
- Queue system in TrackPlayer
- Playlist UI components

**User Accounts:**
- Authentication store
- API service layer for backend calls
- Sync logic for offline-first architecture

**Social Features:**
- Share store for social interactions
- Challenge leaderboards
- Friend system

### Performance at Scale

**1000+ Tracks:**
- Implement virtualized lists (already using FlatList)
- Lazy load challenge details
- Paginated API calls
- Search and filter optimizations

**Offline Support:**
- Download track files locally
- Queue sync when online
- Conflict resolution strategies

## Production Checklist

- [ ] Add Sentry/Crashlytics for error tracking
- [ ] Implement analytics (Amplitude, Mixpanel)
- [ ] Add proper error boundaries
- [ ] Optimize bundle size (Metro bundler optimization)
- [ ] Test on low-end devices
- [ ] Handle all audio interruptions (calls, alarms)
- [ ] Accessibility audit (VoiceOver, TalkBack)
- [ ] App Store screenshots and metadata
- [ ] Privacy policy and terms of service
- [ ] Beta testing with TestFlight/Play Store Beta

## Conclusion

This architecture demonstrates:
- ✅ Clean separation of concerns
- ✅ Scalable state management
- ✅ Professional audio implementation
- ✅ Modern React Native patterns
- ✅ Type-safe development
- ✅ Belong-inspired design system
- ✅ Production-ready code quality

The app is built to be maintainable, testable, and ready for future enhancements while following industry best practices and Belong's architectural patterns.
