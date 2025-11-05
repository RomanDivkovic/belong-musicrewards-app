// Glass design system components - Belong's signature UI
import React from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { THEME } from "../../constants/theme";

// Glass Card Component
interface GlassCardProps {
  children: React.ReactNode;
  blurIntensity?: number;
  borderRadius?: number;
  style?: ViewStyle;
  gradientColors?: readonly string[];
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  blurIntensity = THEME.glass.blurIntensity,
  borderRadius = THEME.borderRadius.md,
  gradientColors = THEME.glass.gradientColors.card,
  style,
}) => {
  return (
    <View
      style={StyleSheet.flatten([{ borderRadius, overflow: "hidden" }, style])}
    >
      <BlurView
        intensity={blurIntensity}
        style={StyleSheet.absoluteFillObject}
        tint="dark"
      />

      <LinearGradient
        colors={gradientColors as [string, string]}
        style={StyleSheet.absoluteFillObject}
      />

      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          borderRadius,
          borderWidth: 1,
          borderColor: THEME.colors.border,
        }}
      />

      <View style={styles.contentContainer}>{children}</View>
    </View>
  );
};

// Glass Button Component
interface GlassButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: "primary" | "secondary";
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  variant = "primary",
}) => {
  const gradientColors =
    variant === "primary"
      ? THEME.glass.gradientColors.primary
      : THEME.glass.gradientColors.secondary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        style,
        pressed && styles.buttonPressed,
      ]}
      testID="glass-button"
    >
      <GlassCard
        gradientColors={gradientColors}
        style={styles.buttonCard}
      >
        {loading ? (
          <View style={styles.buttonContent}>
            <ActivityIndicator color={THEME.colors.text.primary} size="small" />
          </View>
        ) : (
          <View style={styles.buttonContent}>
            <Text style={[styles.buttonText, textStyle]}>{title}</Text>
          </View>
        )}
      </GlassCard>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: THEME.spacing.md,
  },
  button: {
    height: 48,
    overflow: "hidden",
    borderRadius: THEME.borderRadius.md,
  },
  buttonCard: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: THEME.spacing.md,
  },
  buttonPressed: {
    opacity: 0.6,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: THEME.colors.text.primary,
    fontSize: THEME.fonts.sizes.md,
    fontWeight: "600",
  },
});
