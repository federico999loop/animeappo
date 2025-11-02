import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getAnimeEpisodes } from '../services/jikan';
import { RootStackParamList } from '../navigation/RootNavigator';
import { Episode } from '../types';
import { ActivityIndicator, IconButton } from 'react-native-paper';
import theme from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EpisodeList'>;

export default function EpisodeListScreen({ route }: Props) {
  const { animeId } = route.params;
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await getAnimeEpisodes(animeId);
        setEpisodes(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [animeId]);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={episodes}
        keyExtractor={(item) => item.mal_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.episodeContainer}>
            <Text style={styles.episodeNumber}>{item.mal_id}</Text>
            <View style={styles.episodeDetails}>
              <Text style={styles.episodeTitle}>{item.title}</Text>
              <Text style={styles.episodeAired}>{item.aired}</Text>
            </View>
            <IconButton icon="play-circle-outline" size={24} onPress={() => {}} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  episodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface,
  },
  episodeNumber: {
    ...theme.typography.subtitle1,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.md,
  } as const,
  episodeDetails: {
    flex: 1,
  },
  episodeTitle: {
    ...theme.typography.body1,
    color: theme.colors.text,
  },
  episodeAired: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
});
