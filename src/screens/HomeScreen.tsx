import { useEffect, useState } from 'react';
import { View, FlatList, useWindowDimensions, ScrollView, SafeAreaView } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import Swiper from 'react-native-deck-swiper';
import PosterCard from '../components/PosterCard';
import AnimeSwipeCard from '../components/AnimeSwipeCard';
import { useNavigation } from '@react-navigation/native';
import { Anime } from '../types';
import { getPopularAnime, getSeasonNow, getTopAnime } from '../services/jikan';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const posterWidth = Math.round(Math.min(300, Math.max(180, screenWidth / 2.5)));
  const [loading, setLoading] = useState(true);
  const [popularAnimes, setPopularAnimes] = useState<Anime[]>([]);
  const [seasonal, setSeasonal] = useState<Anime[]>([]);
  const [top, setTop] = useState<Anime[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const popular = await getPopularAnime(1);
        setPopularAnimes(popular.data ?? []);

        const now = await getSeasonNow();
        setSeasonal(now.data ?? []);

        const topResp = await getTopAnime(1);
        setTop(topResp.data ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ paddingVertical: 24 }}>
          {popularAnimes.length > 0 && (
            <View style={{ height: screenHeight * 0.5, marginBottom: 24 }}>
              <Section title="Popular">
                <Swiper
                  cards={popularAnimes}
                  renderCard={(card) => <AnimeSwipeCard card={card} />}
                  cardIndex={0}
                  backgroundColor={theme.colors.background}
                  stackSize={3}
                  infinite
                  containerStyle={{ flex: 1 }}
                />
              </Section>
            </View>
          )}

          <Section title="Watch Today">
            <FlatList
              data={seasonal}
              horizontal
              keyExtractor={(i) => String(i.mal_id)}
              renderItem={({ item }) => (
                <PosterCard
                  item={item}
                  width={posterWidth}
                  onPress={() => navigation.navigate('Details', { anime: item, animate: true })}
                />
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24 }}
            />
          </Section>

          <Section title="Top Rated">
            <FlatList
              data={top}
              horizontal
              keyExtractor={(i) => String(i.mal_id)}
              renderItem={({ item }) => (
                <PosterCard
                  item={item}
                  width={posterWidth}
                  onPress={() => navigation.navigate('Details', { anime: item, animate: true })}
                />
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24 }}
            />
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.text, marginBottom: 12, paddingHorizontal: 24 }}>{title}</Text>
      {children}
    </View>
  );
}
