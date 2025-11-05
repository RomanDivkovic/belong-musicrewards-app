# Testing Guide

This project uses Jest and React Testing Library for testing React Native components, hooks, and stores.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Structure

```
src/
├── components/
│   ├── challenge/
│   │   ├── ChallengeCard.tsx
│   │   └── __tests__/
│   │       └── ChallengeCard.test.tsx
│   └── ui/
│       ├── GlassCard.tsx
│       └── __tests__/
│           └── GlassCard.test.tsx
├── hooks/
│   ├── useMusicPlayer.ts
│   └── __tests__/
│       └── useMusicPlayer.test.ts
└── stores/
    ├── musicStore.ts
    └── __tests__/
        └── musicStore.test.ts
```

## Test Coverage

### Components

**GlassCard & GlassButton** (`src/components/ui/__tests__/GlassCard.test.tsx`)
- ✅ Renders children correctly
- ✅ Applies custom styles and props
- ✅ Button press interactions with Pressable
- ✅ Disabled state handling
- ✅ Loading state with ActivityIndicator
- ✅ Primary and secondary variants
- ✅ Press state changes (pressed/unpressed)

**ChallengeCard** (`src/components/challenge/__tests__/ChallengeCard.test.tsx`)
- ✅ Renders challenge information
- ✅ Formats duration correctly (MM:SS)
- ✅ Displays points and progress
- ✅ Shows/hides progress bar based on progress
- ✅ Difficulty badge colors (easy/medium/hard)
- ✅ Button states (Play/Playing/Resume/Completed)
- ✅ Disabled state for completed challenges
- ✅ onPlay callback with challenge data

### Hooks

**useMusicPlayer** (`src/hooks/__tests__/useMusicPlayer.test.ts`)
- ✅ Initializes with default values
- ✅ Plays track successfully
- ✅ Pauses playback
- ✅ Resumes playback
- ✅ Seeks to specific position
- ✅ Handles playback errors gracefully
- ✅ Updates progress during playback

### Stores

**musicStore** (`src/stores/__tests__/musicStore.test.ts`)
- ✅ Initializes with default values
- ✅ Sets current track
- ✅ Updates playing state
- ✅ Updates position and duration
- ✅ Updates challenge progress
- ✅ Marks challenge as completed at 100%
- ✅ Persists state to AsyncStorage
- ✅ Gets challenge by ID

## Mocked Dependencies

The following native modules are mocked in `jest.setup.js`:

- `@react-native-async-storage/async-storage`
- `expo-blur` (BlurView)
- `expo-linear-gradient` (LinearGradient)
- `expo-router`
- `react-native-track-player`
- `react-native-reanimated`

## Configuration Files

- **jest.config.js** - Jest configuration with expo preset
- **jest.setup.js** - Global test setup and mocks
- **babel.config.js** - Skips reanimated plugin in test environment

## Writing New Tests

### Component Test Example

\`\`\`typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(<MyComponent title="Test" />);
    expect(getByText('Test')).toBeTruthy();
  });

  it('handles press', () => {
    const onPressMock = jest.fn();
    const { getByTestID } = render(
      <MyComponent onPress={onPressMock} />
    );
    
    fireEvent.press(getByTestID('my-button'));
    expect(onPressMock).toHaveBeenCalled();
  });
});
\`\`\`

### Hook Test Example

\`\`\`typescript
import { renderHook, act } from '@testing-library/react-native';
import { useMyHook } from '../useMyHook';

describe('useMyHook', () => {
  it('updates state correctly', () => {
    const { result } = renderHook(() => useMyHook());
    
    act(() => {
      result.current.updateValue('new value');
    });
    
    expect(result.current.value).toBe('new value');
  });
});
\`\`\`

### Store Test Example

\`\`\`typescript
import { renderHook, act } from '@testing-library/react-native';
import { useMyStore } from '../myStore';

describe('myStore', () => {
  it('updates store state', () => {
    const { result } = renderHook(() => useMyStore());
    
    act(() => {
      result.current.setValue(42);
    });
    
    expect(result.current.value).toBe(42);
  });
});
\`\`\`

## Best Practices

1. **Test user interactions** - Focus on testing what users see and do
2. **Use testID for complex components** - Makes selecting elements easier
3. **Mock external dependencies** - Keep tests isolated and fast
4. **Test edge cases** - Empty states, errors, loading states
5. **Keep tests simple** - One assertion per test when possible
6. **Use descriptive test names** - Makes failures easier to debug

## Known Issues

- Reanimated plugin currently causes issues in test environment
  - **Solution**: Disabled in babel.config.js when NODE_ENV=test
- Some complex animations may not work in tests
  - **Solution**: Mock animated components or test static states

## CI/CD Integration

Add to your CI pipeline:

\`\`\`yaml
- name: Run Tests
  run: npm test -- --ci --coverage --maxWorkers=2
\`\`\`

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
