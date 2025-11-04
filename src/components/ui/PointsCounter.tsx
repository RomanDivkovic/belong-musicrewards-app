// PointsCounter component - Animated points display
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { GlassCard } from './GlassCard';
import { THEME } from '../../constants/theme';

interface PointsCounterProps {
  points: number;
  label?: string;
  animated?: boolean;
  style?: any;
}

export const PointsCounter: React.FC<PointsCounterProps> = ({
  points,
  label = 'Points Earned',
  animated = true,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const previousPoints = useRef(points);

  // Animate when points change
  useEffect(() => {
    if (animated && points !== previousPoints.current && points > 0) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
    previousPoints.current = points;
  }, [points, animated, scaleAnim]);

  return (
    <GlassCard style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Text style={styles.points}>
          {points}
        </Text>
      </Animated.View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>🎵</Text>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: THEME.spacing.lg,
  },
  label: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.sm,
  },
  points: {
    fontSize: 48,
    fontWeight: 'bold',
    color: THEME.colors.accent,
  },
  badge: {
    marginTop: THEME.spacing.sm,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 24,
  },
});
