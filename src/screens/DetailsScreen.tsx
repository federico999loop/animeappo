import { useEffect, useState } from 'react';
import { Image, ScrollView, View, Animated, StyleSheet, Dimensions } from 'react-native';
import { useRef } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { getAnimeById } from '../services/jikan';
import { Anime } from '../types';
import {
  addRating,
  getRating,
  addComment,
  getCommentsForAnime,
  toggleLike,
  isLiked,
} from '../storage/watchlist';
import { ActivityIndicator, Button, Chip, Text, IconButton } from 'react-native-paper';
import StarRating from '../components/StarRating';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';

const lightTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#000000',
    muted: '#8E8E93',
  },
};

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

const GeneralTab = ({ anime, loading }) => (
  <View style={styles.tabContainer}>
    {loading ? (
      <ActivityIndicator style={{ marginVertical: 12 }} />
    ) : (
      <Text style={{ ...lightTheme.typography.body, color: lightTheme.colors.text, lineHeight: 22 }}>
        {anime.synopsis || 'Nessuna sinossi disponibile.'}
      </Text>
    )}
  </View>
);

const CastTab = () => (
  <View style={styles.tabContainer}>
    <Text style={{ color: lightTheme.colors.text }}>Cast information will be here.</Text>
  </View>
);

const CommentsTab = ({ anime }) => {
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    (async () => {
      const storedComments = await getCommentsForAnime(anime.mal_id);
      setComments(storedComments);
    })();
  }, [anime.mal_id]);

  async function onAddComment() {
    if (newComment.trim() === '') return;
    await addComment(anime.mal_id, newComment);
    setComments([...comments, newComment]);
    setNewComment('');
  }

  return (
    <View style={styles.tabContainer}>
      {comments.map((comment, index) => (
        <Text key={index} style={{ color: lightTheme.colors.text, marginBottom: 8 }}>- {comment}</Text>
      ))}
      {/* Comment input will be added here */}
    </View>
  );
};

const ListsTab = () => (
  <View style={styles.tabContainer}>
    <Text style={{ color: lightTheme.colors.text }}>Lists information will be here.</Text>
  </View>
);

export default function DetailsScreen({ route }: Props) {
  const { anime: initial } = route.params;
  const [anime, setAnime] = useState<Anime>(initial);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [rating, setRating] = useState(0);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'general', title: 'General' },
    { key: 'cast', title: 'Cast' },
    { key: 'comments', title: 'Comments' },
    { key: 'lists', title: 'Lists' },
  ]);

  const renderScene = SceneMap({
    general: () => <GeneralTab anime={anime} loading={loading} />,
    cast: CastTab,
    comments: () => <CommentsTab anime={anime} />,
    lists: ListsTab,
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const full = await getAnimeById(initial.mal_id);
        setAnime(full.data as Anime);
      } catch {
        // resta coi dati iniziali
      } finally {
        setLoading(false);
      }
    })();
    (async () => {
      const isAnimeLiked = await isLiked(initial.mal_id);
      setLiked(isAnimeLiked);
      const storedRating = await getRating(initial.mal_id);
      if (storedRating) {
        setRating(storedRating);
      }
    })();
  }, [initial.mal_id]);

  async function onToggleLike() {
    await toggleLike(anime.mal_id);
    setLiked(!liked);
  }

  async function onRate(newRating: number) {
    setRating(newRating);
    await addRating(anime.mal_id, newRating);
  }

  const image = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: lightTheme.colors.background }}>
      <View style={styles.heroContainer}>
        <Image source={{ uri: image }} style={styles.heroImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.heroGradient}
        />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>{anime.title}</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{anime.year}</Text>
          <Text style={styles.metaText}>{anime.episodes} episodes</Text>
          <View style={styles.ratingContainer}>
            <MaterialCommunityIcons name="star" color="#FFD700" size={16} />
            <Text style={styles.metaText}>{anime.score}</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <IconButton icon="bookmark-outline" size={24} onPress={() => {}} />
          <IconButton icon={liked ? 'heart' : 'heart-outline'} iconColor={liked ? theme.colors.primary : lightTheme.colors.text} size={24} onPress={onToggleLike} />
          <IconButton icon="eye-outline" size={24} onPress={() => {}} />
          <IconButton icon="comment-outline" size={24} onPress={() => {}} />
        </View>

        <View style={styles.buttonRow}>
          <Button mode="outlined" onPress={() => {}} style={styles.button} textColor={lightTheme.colors.primary}>Watching</Button>
          <Button mode="contained" onPress={() => {}} style={styles.button} buttonColor={lightTheme.colors.primary}>Review</Button>
        </View>

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get('window').width }}
          renderTabBar={props => 
            <TabBar 
              {...props} 
              style={{ backgroundColor: lightTheme.colors.background, shadowOpacity: 0, elevation: 0 }}
              indicatorStyle={{ backgroundColor: lightTheme.colors.primary }}
              labelStyle={{ color: lightTheme.colors.text, ...lightTheme.typography.body }}
            />
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    padding: theme.spacing.md,
  },
  heroContainer: {
    height: 300,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  heroContent: {
    position: 'absolute',
    left: theme.spacing.md,
    right: theme.spacing.md,
    bottom: theme.spacing.md,
  },
  heroTitle: {
    ...lightTheme.typography.largeTitle,
    color: lightTheme.colors.text,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  metaText: {
    ...lightTheme.typography.body,
    color: lightTheme.colors.muted,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.md,
  },
  button: {
    flex: 1,
    marginHorizontal: theme.spacing.sm,
  },
});
