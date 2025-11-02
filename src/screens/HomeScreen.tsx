import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, FlatList, useWindowDimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Text } from 'react-native-paper';
import Swiper from 'react-native-deck-swiper';
import PosterCard from '../components/PosterCard';
import AnimeSwipeCard from '../components/AnimeSwipeCard';
import { useNavigation } from '@react-navigation/native';
import { Anime } from '../types';
import { getPopularAnime, getSeasonNow, getTopAnime } from '../services/jikan';
import theme from '../theme';
import AppBar from '../components/AppBar';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
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

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}
        edges={['left', 'right', 'bottom']}
      >
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={['left', 'right', 'bottom']}
    >
      <AppBar 
        title="Anime"
        rightIcon="magnify"
        onRightPress={() => navigation.navigate('Search')}
      />
      
      <ScrollView 
        contentContainerStyle={{ paddingBottom: theme.spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section with Popular Anime */}
        {popularAnimes.length > 0 && (
          <View style={{ height: screenHeight * 0.6, marginBottom: theme.spacing.xl }}>
            <LinearGradient
              colors={[theme.colors.background, 'transparent']}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 100,
                zIndex: 1,
              }}
            />
            <Section title="In Evidenza">
      <Swiper
        cards={popularAnimes}
                renderCard={(card) => React.createElement(AnimeSwipeCard, { card: card as Anime })}
                cardIndex={0}
                backgroundColor={theme.colors.background}
                stackSize={3}
                infinite
                containerStyle={{ flex: 1 }}
                animateOverlayLabelsOpacity
                animateCardOpacity
                overlayLabels={{
                  left: {
                    title: 'NOPE',
                    style: {
                      label: {
                        backgroundColor: theme.colors.error,
                        color: 'white',
                        fontSize: 24
                      },
                      wrapper: {
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-start',
                        marginTop: 30,
                        marginLeft: -30
                      }
                    }
                  },
                  right: {
                    title: 'LIKE',
                    style: {
                      label: {
                        backgroundColor: theme.colors.primary,
                        color: 'white',
                        fontSize: 24
                      },
                      wrapper: {
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        marginTop: 30,
                        marginLeft: 30
                      }
                    }
                  }
                }}
              />
            </Section>
          </View>
        )}

        {/* Seasonal Anime Section */}
        <Section title="Nuova Stagione">
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
            contentContainerStyle={{ 
              paddingHorizontal: 24,
              paddingBottom: 8 // Per l'ombra delle card
            }}
            ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
            snapToInterval={posterWidth + 16}
            decelerationRate="fast"
            snapToAlignment="start"
          />
        </Section>

        {/* Top Rated Section */}
        <Section title="I Più Votati">
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
            contentContainerStyle={{ 
              paddingHorizontal: 24,
              paddingBottom: 8 // Per l'ombra delle card
            }}
            ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
            snapToInterval={posterWidth + 16}
            decelerationRate="fast"
            snapToAlignment="start"
          />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ 
      marginBottom: theme.spacing.xxl,
    }}>
      <Text style={[
        theme.typography.h3,
        { 
          color: theme.colors.text,
          marginBottom: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
        }
      ]}>
        {title}
      </Text>
      {children}
    </View>
  );
}
