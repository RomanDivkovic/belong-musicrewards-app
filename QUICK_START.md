# 🚀 Quick Start Guide - Fixa React Native Version Mismatch

## Problem
Du får felmeddelandet:
```
React Native version mismatch.
JavaScript version: 0.79.5
Native version: 0.81.4
```

## Lösning - Steg för Steg

### 1. Rensa alla caches
```bash
cd /Users/romandivkovic/Downloads/careers-main/react-native/test-app

# Rensa watchman
watchman watch-del-all

# Ta bort node_modules och lock file
rm -rf node_modules package-lock.json

# Ta bort iOS/Android build directories (om de finns)
rm -rf ios/build android/build

# Rensa Metro bundler cache
rm -rf $TMPDIR/metro-* $TMPDIR/haste-*
```

### 2. Installera dependencies
```bash
npm install
```

### 3. Starta Expo med reset cache
```bash
npx expo start -c
```

### 4. Välj iOS eller Android
När Expo DevTools öppnas:
- Tryck `i` för iOS simulator
- Tryck `a` för Android emulator
- ELLER scanna QR-koden med Expo Go appen

## Alternativ Metod: Prebuild och Kör Native

Om du vill bygga native koden direkt:

```bash
# För iOS
npx expo prebuild --clean
npx expo run:ios

# För Android  
npx expo prebuild --clean
npx expo run:android
```

## Troubleshooting

### Om du fortfarande får version mismatch:

1. **Stäng alla Metro bundler processer:**
```bash
pkill -f "node.*metro"
lsof -ti:8081 | xargs kill -9
```

2. **Rensa Expo cache:**
```bash
npx expo start -c --clear
```

3. **Om iOS build fail:**
```bash
cd ios
rm -rf Pods Podfile.lock
pod deintegrate
pod install
cd ..
```

4. **Om Android build fail:**
```bash
cd android
./gradlew clean
cd ..
```

### Starta helt från början:
```bash
# 1. Rensa allt
rm -rf node_modules package-lock.json ios android .expo

# 2. Installera
npm install

# 3. Starta med reset
npx expo start -c

# 4. Tryck 'i' för iOS eller 'a' för Android
```

## Rekommenderad Startmetod (Enklast)

**För Development och Testing:**
```bash
cd /Users/romandivkovic/Downloads/careers-main/react-native/test-app
npx expo start -c
```
Sedan tryck `i` för iOS eller `a` för Android.

Detta startar Metro bundler med ren cache och låter dig välja plattform.

## Varför händer detta?

Version mismatch uppstår när:
- Metro bundler cachar gammal JavaScript kod
- Native kod är byggd med en annan React Native version
- node_modules har konflikterade versioner

Lösningen är alltid att rensa alla caches och bygga om.

## Tips för Framtiden

**Alltid starta med ren cache första gången:**
```bash
npx expo start -c
```

**Om du ändrar dependencies:**
```bash
rm -rf node_modules package-lock.json
npm install
npx expo start -c
```

**Om du får konstiga fel:**
1. Stäng Metro bundler (Ctrl+C)
2. Kör `npx expo start -c`
3. Välj plattform igen

---

## Nuvarande Status

✅ Dependencies installerade
✅ Watchman cache rensad
✅ Redo att starta!

**Kör nu:**
```bash
npx expo start -c
```

Sedan tryck `i` för iOS! 🚀
