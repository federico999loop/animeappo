import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  useWindowDimensions,
  ScrollView,
  Text,
  StatusBar,
  Pressable,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PosterCard from '../components/PosterCard';
import { useNavigation } from '@react-navigation/native';
import { Anime } from '../types';
import { getPopularAnime, getSeasonNow, getTopAnime } from '../services/jikan';
import theme from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

const quickCategories = [
  { key: 'cyberpunk', label: 'Cyberpunk', icon: 'flash-outline' },
  { key: 'romance', label: 'Romance', icon: 'heart-outline' },
  { key: 'sports', label: 'Sports', icon: 'basketball' },
  { key: 'fantasy', label: 'Fantasy', icon: 'sword-cross' },
  { key: 'mystery', label: 'Mystery', icon: 'head-question-outline' },
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { width: screenWidth } = useWindowDimensions();
  const posterWidth = Math.round(Math.min(300, Math.max(180, screenWidth / 2.4)));
  const heroHeight = Math.round(Math.min(520, Math.max(360, screenWidth * 1.05)));
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

  const featuredAnime = useMemo(() => popularAnimes[0], [popularAnimes]);

  if (loading) {
    return (
      <LinearGradient colors={theme.colors.gradients.background} style={{ flex: 1 }}>
        <SafeAreaView
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          edges={['left', 'right', 'bottom']}
        >
          <StatusBar barStyle="light-content" />
          <ActivityIndicator />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={theme.colors.gradients.background} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
        <StatusBar barStyle="light-content" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: theme.spacing.xxl }}
        >
          <View style={{ paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.lg }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <Text
                  style={[
                    theme.typography.caption,
                    { color: theme.colors.muted, letterSpacing: 2, marginBottom: theme.spacing.xs },
                  ]}
                >
                  Watch today
                </Text>
                <Text
                  style={[
                    theme.typography.h1,
                    { color: theme.colors.text, fontSize: 36, lineHeight: 42 },
                  ]}
                >
                  WakuWaku
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: theme.radii.lg,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}
              >
                <MaterialCommunityIcons name="bell-outline" color={theme.colors.text} size={22} />
              </TouchableOpacity>
            </View>
          </View>

          {featuredAnime && (
            <View style={{ paddingHorizontal: theme.spacing.lg, marginTop: theme.spacing.xl }}>
              <FeaturedCard
                anime={featuredAnime}
                height={heroHeight}
                onPress={() => navigation.navigate('Details', { anime: featuredAnime, animate: true })}
              />
            </View>
          )}

          <View style={{ marginTop: theme.spacing.xl }}>
            <Section title="Esplora generi" description="Scegli cosa guardare stasera">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: theme.spacing.lg }}
              >
                {quickCategories.map((category, index) => (
                  <CategoryPill
                    key={category.key}
                    label={category.label}
                    icon={category.icon}
                    isFirst={index === 0}
                    isLast={index === quickCategories.length - 1}
                  />
                ))}
              </ScrollView>
            </Section>
          </View>

          <Section
            title="Nuova Stagione"
            description="Gli anime in simulcast da non perdere"
            actionLabel="Vedi tutto"
            onActionPress={() =>
              navigation.navigate('SectionList', { title: 'Nuova Stagione', data: seasonal })
            }
          >
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
                paddingLeft: theme.spacing.lg,
                paddingRight: theme.spacing.lg,
              }}
              ItemSeparatorComponent={() => <View style={{ width: theme.spacing.sm }} />}
              snapToInterval={posterWidth + theme.spacing.sm}
              decelerationRate="fast"
              snapToAlignment="start"
            />
          </Section>

          <Section
            title="I Più Votati"
            description="Le serie preferite dalla community"
            actionLabel="Classifica"
            onActionPress={() =>
              navigation.navigate('SectionList', { title: 'I Più Votati', data: top })
            }
          >
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
                paddingLeft: theme.spacing.lg,
                paddingRight: theme.spacing.lg,
              }}
              ItemSeparatorComponent={() => <View style={{ width: theme.spacing.sm }} />}
              snapToInterval={posterWidth + theme.spacing.sm}
              decelerationRate="fast"
              snapToAlignment="start"
            />
          </Section>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function Section({
  title,
  description,
  actionLabel,
  onActionPress,
  children,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: theme.spacing.xxl }}>
      <View
        style={{
          paddingHorizontal: theme.spacing.lg,
          marginBottom: theme.spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flex: 1, paddingRight: theme.spacing.md }}>
          <Text
            style={[
              theme.typography.h3,
              { color: theme.colors.text, marginBottom: description ? theme.spacing.xs : 0 },
            ]}
          >
            {title}
          </Text>
          {description && (
            <Text style={[theme.typography.body2, { color: theme.colors.muted }]}>{description}</Text>
          )}
        </View>
        {onActionPress && actionLabel && (
          <TouchableOpacity
            onPress={onActionPress}
            activeOpacity={0.8}
            style={{
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.xs,
              borderRadius: theme.radii.pill,
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
          >
            <Text style={[theme.typography.caption, { color: theme.colors.text }]}>{actionLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
}

function CategoryPill({
  label,
  icon,
  isFirst,
  isLast,
}: {
  label: string;
  icon: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <View
      style={{
        marginLeft: isFirst ? 0 : theme.spacing.sm,
        marginRight: isLast ? 0 : theme.spacing.sm,
      }}
    >
      <TouchableOpacity activeOpacity={0.85}>
        <LinearGradient
          colors={theme.colors.gradients.accent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: theme.radii.pill,
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.sm,
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.sm,
          }}
        >
          <MaterialCommunityIcons name={icon} size={18} color={theme.colors.white} />
          <Text style={[theme.typography.subtitle2, { color: theme.colors.white }]}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

function FeaturedCard({ anime, height, onPress }: { anime: Anime; height: number; onPress: () => void }) {
  const image =
    anime.images?.jpg?.large_image_url ||
    anime.images?.jpg?.image_url ||
    anime.images?.webp?.large_image_url ||
    anime.images?.webp?.image_url;

  const genres = anime.genres?.map((genre) => genre.name) ?? [];
  const subtitle = genres.slice(0, 3).join(' • ');
  const rating = anime.score ? anime.score.toFixed(1) : '—';

  return (
    <Pressable onPress={onPress} style={{ borderRadius: theme.radii.xl, overflow: 'hidden' }}>
      <View
        style={{
          borderRadius: theme.radii.xl,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.elevation.level2,
        }}
      >
        {image ? (
          <ImageBackground
            source={{ uri: image }}
            style={{ height, justifyContent: 'flex-end' }}
            imageStyle={{ borderRadius: theme.radii.xl }}
          >
            <LinearGradient
              colors={['rgba(20,18,23,0.1)', 'rgba(20,18,23,0.65)', 'rgba(20,18,23,0.95)']}
              style={{ padding: theme.spacing.xl, gap: theme.spacing.md }}
            >
              <View>
                <Text style={[theme.typography.caption, { color: theme.colors.muted }]}>In Evidenza</Text>
                <Text
                  style={[
                    theme.typography.h1,
                    {
                      color: theme.colors.white,
                      fontSize: 34,
                      lineHeight: 40,
                      marginTop: theme.spacing.xs,
                    },
                  ]}
                >
                  {anime.title}
                </Text>
                {subtitle.length > 0 && (
                  <Text style={[theme.typography.body1, { color: theme.colors.muted, marginTop: theme.spacing.xs }]}>
                    {subtitle}
                  </Text>
                )}
              </View>

              <View style={{ flexDirection: 'row', gap: theme.spacing.sm, flexWrap: 'wrap' }}>
                <InfoBadge icon="calendar-blank" label={anime.year ? String(anime.year) : 'Sconosciuto'} />
                <InfoBadge icon="star" label={`${rating} rating`} />
                <InfoBadge
                  icon="television-play"
                  label={anime.episodes ? `${anime.episodes} episodi` : 'In corso'}
                />
              </View>

              <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
                <GradientButton label="Watching" icon="play" />
                <GhostButton label="Review" icon="pencil-outline" />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing.sm }}>
                <View style={{ flexDirection: 'row', marginRight: theme.spacing.sm }}>
                  {[0, 1, 2].map((index) => (
                    <LinearGradient
                      key={index}
                      colors={theme.colors.gradients.accent}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: index === 0 ? 0 : -12,
                        borderWidth: 2,
                        borderColor: 'rgba(20,18,23,0.6)',
                      }}
                    >
                      <MaterialCommunityIcons name="account" size={18} color={theme.colors.white} />
                    </LinearGradient>
                  ))}
                </View>
                <Text style={[theme.typography.body2, { color: theme.colors.muted }]}>12k stanno guardando ora</Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        ) : (
          <View style={{ height, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl }}>
            <Text style={[theme.typography.body1, { color: theme.colors.muted }]}>Nessuna immagine disponibile</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

function InfoBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.radii.pill,
        backgroundColor: 'rgba(255,255,255,0.08)',
        gap: theme.spacing.xs,
      }}
    >
      <MaterialCommunityIcons name={icon} size={16} color={theme.colors.white} />
      <Text style={[theme.typography.caption, { color: theme.colors.white }]}>{label}</Text>
    </View>
  );
}

function GradientButton({ label, icon }: { label: string; icon: string }) {
  return (
    <TouchableOpacity activeOpacity={0.85}>
      <LinearGradient
        colors={theme.colors.gradients.accent}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.sm,
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.sm,
          borderRadius: theme.radii.pill,
        }}
      >
        <MaterialCommunityIcons name={icon} size={18} color={theme.colors.white} />
        <Text style={[theme.typography.subtitle2, { color: theme.colors.white }]}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

function GhostButton({ label, icon }: { label: string; icon: string }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.radii.pill,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
      }}
    >
      <MaterialCommunityIcons name={icon} size={18} color={theme.colors.white} />
      <Text style={[theme.typography.subtitle2, { color: theme.colors.white }]}>{label}</Text>
    </TouchableOpacity>
  );
}
