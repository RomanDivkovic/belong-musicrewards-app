# MusicRewards - Music Listening Rewards App

A React Native mobile app built with Expo that allows users to complete music listening challenges and earn points. Built following Belong's mobile app architecture patterns.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- iOS Simulator (Mac) or Android Emulator
- Xcode (for iOS) or Android Studio (for Android)

### Installation & Running

```bash
# 1. Navigate to the project directory
cd test-app

# 2. Install dependencies
npm install

# 3. Run on iOS
npx expo run:ios

# OR run on Android
npx expo run:android

# For development with hot reload
npx expo start
```

### First Time Setup

If you encounter any issues, try:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npx expo start -c
```

## 📱 Features

### Core Functionality
- ✅ Browse music challenges with points rewards
- ✅ Play audio tracks with full playback controls
- ✅ Real-time progress tracking
- ✅ Points earned based on listening progress
- ✅ User profile with total points and achievements
- ✅ State persistence across app restarts
- ✅ Glass morphism design system

### Technical Features
- ✅ Zustand state management with AsyncStorage persistence
- ✅ react-native-track-player for audio playback
- ✅ Expo Router for navigation
- ✅ TypeScript throughout
- ✅ Custom hooks for business logic
- ✅ Error handling and loading states
- ✅ Responsive design with Belong's color scheme

## 📁 Project Structure

```
src/
├── app/                    # Expo Router pages
│   ├── (tabs)/
│   │   ├── index.tsx       # Home: Challenge list
│   │   ├── profile.tsx     # Profile: User stats
│   │   └── _layout.tsx     # Tab navigation
│   ├── (modals)/
│   │   ├── player.tsx      # Audio player modal
│   │   └── _layout.tsx     # Modal navigation
│   └── _layout.tsx         # Root layout (TrackPlayer init)
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── GlassCard.tsx
│   │   ├── GlassButton.tsx (exported from GlassCard)
│   │   └── PointsCounter.tsx
│   └── challenge/
│       ├── ChallengeCard.tsx
│       └── ChallengeList.tsx
├── hooks/                  # Business logic
│   ├── useMusicPlayer.ts   # Audio playback integration
│   ├── usePointsCounter.ts # Points calculation
│   └── useChallenges.ts    # Challenge management
├── stores/                 # Zustand state
│   ├── musicStore.ts       # Challenges & playback
│   └── userStore.ts        # User points & progress
├── services/               # External integrations
│   ├── audioService.ts     # TrackPlayer setup
│   └── playbackService.ts  # Background playback
├── constants/
│   └── theme.ts            # Design tokens & sample data
└── types/
    └── index.ts            # TypeScript definitions
```

## 🎯 How It Works

### User Flow
1. **Home Screen:** Browse available music challenges
2. **Tap Play:** Start a challenge and open player modal
3. **Listen:** Track progress and earn points in real-time
4. **Complete:** Reach 90% to complete challenge and earn full points
5. **Profile:** View total points and achievements

### Technical Flow
1. User taps "Play Challenge"
2. `useMusicPlayer` hook initializes TrackPlayer
3. Audio streams from remote URL
4. Progress updates trigger store mutations
5. Points calculated based on listening progress
6. At 90% completion: challenge marked complete, points awarded
7. State persisted to AsyncStorage

## 🎨 Design System

### Glass Morphism UI
- **BlurView** for frosted glass effect
- **LinearGradient** for subtle color overlays
- **Border overlays** for depth
- **Belong colors:** Purple (#7553DB), Green (#34CB76), Yellow (#FCBE25)

### Components
- `GlassCard` - Base card with blur and gradient
- `GlassButton` - Interactive button with variants
- `PointsCounter` - Animated points display
- `ChallengeCard` - Challenge info with progress
- `ChallengeList` - Optimized FlatList wrapper

## 🎵 Audio Tracks

The app uses these pre-hosted tracks:

1. **Camo & Krooked - All Night**
   - Duration: 3:39 (219s)
   - Points: 150
   - Difficulty: Easy

2. **Roni Size - New Forms**
   - Duration: 7:44 (464s)
   - Points: 300
   - Difficulty: Medium

Tracks are streamed directly from AWS S3 - no downloads required.

## 🏗️ Architecture

### State Management
**Zustand** with two domain stores:
- `musicStore` - Challenges, playback state, progress
- `userStore` - Total points, completed challenges

**Persistence:** AsyncStorage via zustand/middleware

### Custom Hooks
- `useMusicPlayer` - Orchestrates TrackPlayer + stores
- `usePointsCounter` - Calculates points from progress
- `useChallenges` - Challenge CRUD operations

### Why This Stack?

**Zustand over Redux:**
- Less boilerplate
- Better TypeScript support
- Simpler selector pattern
- Easier persistence

**react-native-track-player over expo-av:**
- True background playback
- System media controls
- Lock screen integration
- Better performance

**Expo Router over React Navigation:**
- File-based routing
- Type-safe navigation
- Automatic deep linking
- Cleaner code organization

## 📊 State Persistence

**What's Persisted:**
- ✅ User total points
- ✅ Completed challenge IDs  
- ✅ Challenge progress (0-100%)

**What's NOT Persisted:**
- ❌ Current playback position
- ❌ Playing/paused state
- ❌ Current track selection

This provides clean app restarts while preserving user progress.

## 🧪 Testing Scenarios

### Manual Testing Checklist
- [ ] Install app on simulator/device
- [ ] Play a challenge - audio streams correctly
- [ ] Seek through track - progress updates
- [ ] Listen to 90%+ - challenge completes, points awarded
- [ ] Close and reopen app - points persist
- [ ] Profile shows correct stats
- [ ] Multiple challenges work independently
- [ ] Background playback (if implemented)

### Known Limitations
- Requires internet connection (streaming audio)
- Background playback limited by TrackPlayer configuration
- Progress resets if app is force-quit during playback

## 🚨 Troubleshooting

### iOS Build Fails
```bash
cd ios
pod deintegrate
pod install
cd ..
npx expo run:ios
```

### Android Build Fails
```bash
cd android
./gradlew clean
cd ..
npx expo run:android
```

### TrackPlayer Issues
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
# Clear Metro cache
npx expo start -c
```

### TypeScript Errors
- Ensure all dependencies installed: `npm install`
- Check Node version: `node --version` (should be 18+)
- Restart TypeScript server in your IDE

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed architecture decisions and patterns
- **[Parent README](../README.md)** - Full technical requirements
- **[EVALUATION.md](../EVALUATION.md)** - Assessment criteria

## 🎓 Learning Resources

- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [Zustand Guide](https://github.com/pmndrs/zustand)
- [react-native-track-player](https://react-native-track-player.js.org/)
- [Expo Blur](https://docs.expo.dev/versions/latest/sdk/blur-view/)

## 🤝 Credits

Built as part of the Belong React Native Technical Assessment.

**Audio Tracks:**
- "All Night" by Camo & Krooked
- "New Forms" by Roni Size

## 📄 License

This is a technical assessment project. See Belong's assessment guidelines for usage terms.

---

**Questions?** Email careers@getbelong.app

Good luck! 🚀🎵
# test-app
