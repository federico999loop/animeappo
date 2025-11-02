import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { Anime } from '../types';
import theme from '../theme';
import { IconButton } from 'react-native-paper';

type Props = {
  card: Anime;
};

export default function AnimeSwipeCard({ card }: Props) {
  const imageUrl = card.images?.jpg?.large_image_url || card.images?.jpg?.image_url;

  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <BlurView style={styles.blurView} blurType="dark" blurAmount={10}>
        <View style={styles.overlayContainer}>
          <Text style={styles.title}>{card.title}</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.year}>{card.year}</Text>
            <View style={styles.ratingContainer}>
              <IconButton icon="star" size={16} iconColor="#FFD700" style={{ margin: 0 }} />
              <Text style={styles.rating}>{card.score}</Text>
            </View>
          </View>
          <View style={styles.actionsContainer}>
            <IconButton icon="close" size={24} iconColor="#FFFFFF" style={styles.actionButton} />
            <IconButton icon="heart" size={24} iconColor={theme.colors.primary} style={styles.actionButton} />
          </View>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 0.8,
    borderRadius: theme.radii.lg,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  blurView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  overlayContainer: {
    flex: 1,
    padding: theme.spacing.md,
    justifyContent: 'flex-end',
  },
  title: {
    ...theme.typography.mediumHeading,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  year: {
    ...theme.typography.body,
    color: theme.colors.muted,
    marginRight: theme.spacing.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});
