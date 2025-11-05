// Root layout for Expo Router
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import TrackPlayer from "react-native-track-player";
import { setupTrackPlayer } from "../services/audioService";
import { THEME } from "../constants/theme";
import React from "react";

export default function RootLayout() {
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function initializePlayer() {
      try {
        // Register the playback service first
        TrackPlayer.registerPlaybackService(() =>
          require("../services/playbackService")
        );

        // Then initialize TrackPlayer
        await setupTrackPlayer();

        if (isMounted) {
          setIsPlayerReady(true);
        }
      } catch (error) {
        console.error("Failed to setup TrackPlayer:", error);
        // Still set ready to true to show the app
        if (isMounted) {
          setIsPlayerReady(true);
        }
      }
    }

    initializePlayer();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isPlayerReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
        <Text style={styles.loadingText}>Loading Music Player...</Text>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modals)"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: THEME.colors.background,
  },
  loadingText: {
    marginTop: THEME.spacing.md,
    color: THEME.colors.text.primary,
    fontSize: THEME.fonts.sizes.md,
  },
});
