// ChallengeList component - List of all challenges
import React from 'react';
import { FlatList, View, Text, StyleSheet, RefreshControl } from 'react-native';
import { ChallengeCard } from './ChallengeCard';
import { THEME } from '../../constants/theme';
import type { MusicChallenge } from '../../types';

interface ChallengeListProps {
  challenges: MusicChallenge[];
  onPlayChallenge: (challenge: MusicChallenge) => void;
  currentTrackId?: string | null;
  isPlaying?: boolean;
  loading?: boolean;
  onRefresh?: () => void;
}

export const ChallengeList: React.FC<ChallengeListProps> = ({
  challenges,
  onPlayChallenge,
  currentTrackId,
  isPlaying = false,
  loading = false,
  onRefresh,
}) => {
  const renderChallenge = ({ item }: { item: MusicChallenge }) => (
    <ChallengeCard
      challenge={item}
      onPlay={onPlayChallenge}
      isCurrentTrack={currentTrackId === item.id}
      isPlaying={isPlaying}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Challenges Available</Text>
      <Text style={styles.emptyText}>
        Check back later for new music challenges!
      </Text>
    </View>
  );

  return (
    <FlatList
      data={challenges}
      renderItem={renderChallenge}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderEmpty}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={THEME.colors.primary}
            colors={[THEME.colors.primary]}
          />
        ) : undefined
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: THEME.spacing.xl,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing.xxl,
  },
  emptyTitle: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm,
  },
  emptyText: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
  },
});
