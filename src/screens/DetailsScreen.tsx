import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import {
  getAnimeById,
  getAnimeCharacters,
  getAnimeRecommendations,
  getAnimeStaff,
} from '../services/jikan';
import type {
  Anime,
  AnimeCharacter,
  AnimeRecommendation,
  AnimeStaff,
  AnimeStream,
  NamedEntity,
} from '../types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  addRating,
  getRating,
  addComment,
  getCommentsForAnime,
  toggleLike,
  isLiked,
} from '../storage/watchlist';
import CustomButton from '../components/CustomButton';
import StarRating from '../components/StarRating';
import { LinearGradient } from 'expo-linear-gradient';
import PosterCard from '../components/PosterCard';
import theme from '../theme';
import { ActivityIndicator, Text, IconButton, TextInput, Portal, Dialog } from 'react-native-paper';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

type RecommendationCard = {
  anime: Anime;
  votes: number;
};

type GeneralTabProps = {
  anime: Anime;
  loading?: boolean;
  recommendations: RecommendationCard[];
  onSelectAnime: (anime: Anime) => void;
};

type CastTabProps = {
  characters: AnimeCharacter[];
  staff: AnimeStaff[];
  loading?: boolean;
};

export default function DetailsScreen({ route, navigation }: Props) {
  const { anime: initial } = route.params;

  const [anime, setAnime] = useState<Anime>(initial);
  const [loading, setLoading] = useState(false);
  const [castLoading, setCastLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [rating, setRating] = useState(0);
  const [characters, setCharacters] = useState<AnimeCharacter[]>([]);
  const [staff, setStaff] = useState<AnimeStaff[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationCard[]>([]);

  const [showStreaming, setShowStreaming] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setCastLoading(true);
        const [full, charactersRes, staffRes, recommendationsRes] = await Promise.all([
          getAnimeById(initial.mal_id),
          getAnimeCharacters(initial.mal_id).catch(() => ({ data: [] })),
          getAnimeStaff(initial.mal_id).catch(() => ({ data: [] })),
          getAnimeRecommendations(initial.mal_id).catch(() => ({ data: [] })),
        ]);

        if (cancelled) return;

        setAnime(full.data);
        setCharacters(charactersRes.data ?? []);
        setStaff(staffRes.data ?? []);

        const mappedRecommendations =
          (recommendationsRes.data ?? [])
            .filter((item: AnimeRecommendation) => Boolean(item?.entry?.mal_id))
            .map((item: AnimeRecommendation) => ({
              anime: {
                mal_id: item.entry.mal_id,
                title: item.entry.title,
                url: item.entry.url,
                images: item.entry.images,
              } as Anime,
              votes: item.votes,
            })) ?? [];

        setRecommendations(mappedRecommendations);
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setCastLoading(false);
        }
      }
    })();

    (async () => {
      try {
        const [isAnimeLiked, storedRating] = await Promise.all([
          isLiked(initial.mal_id),
          getRating(initial.mal_id),
        ]);
        if (cancelled) return;
        setLiked(isAnimeLiked);
        if (storedRating) {
          setRating(storedRating);
        }
      } catch (error) {
        console.error(error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initial.mal_id]);

  const handleRecommendationPress = useCallback(
    (selected: Anime) => {
      navigation.push('Details', { anime: selected });
    },
    [navigation],
  );

  async function onToggleLike() {
    await toggleLike(anime.mal_id);
    setLiked((prev) => !prev);
  }

  async function onRate(newRating: number) {
    setRating(newRating);
    await addRating(anime.mal_id, newRating);
  }

  const image =
    anime.images?.jpg?.large_image_url ||
    anime.images?.jpg?.image_url ||
    anime.images?.webp?.large_image_url ||
    anime.images?.webp?.image_url;

  const secondaryTitle = useMemo(() => {
    if (anime.title_english && anime.title_english !== anime.title) return anime.title_english;
    if (anime.title_japanese && anime.title_japanese !== anime.title) return anime.title_japanese;
    return null;
  }, [anime.title, anime.title_english, anime.title_japanese]);

  const stats = useMemo(() => {
    const items: StatBadgeProps[] = [];
    if (anime.score) {
      items.push({
        label: 'Punteggio',
        value: anime.score.toFixed(2),
        icon: 'star',
        helper: anime.scored_by ? `${formatNumber(anime.scored_by)} voti` : undefined,
      });
    }
    if (anime.rank) {
      items.push({
        label: 'Rank',
        value: `#${anime.rank}`,
        icon: 'trophy-variant',
      });
    }
    if (anime.popularity) {
      items.push({
        label: 'Popolarità',
        value: `#${anime.popularity}`,
        icon: 'fire',
      });
    }
    if (anime.members) {
      items.push({
        label: 'Membri',
        value: formatNumber(anime.members),
        icon: 'account-group',
      });
    }
    if (anime.favorites) {
      items.push({
        label: 'Preferiti',
        value: formatNumber(anime.favorites),
        icon: 'heart',
      });
    }
    return items;
  }, [anime.score, anime.scored_by, anime.rank, anime.popularity, anime.members, anime.favorites]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'right', 'left', 'bottom']}>
      <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={styles.heroContainer}>
          {image ? <Image source={{ uri: image }} style={styles.heroImage} /> : null}
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)'] as const} style={styles.heroGradient} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{anime.title}</Text>
            {secondaryTitle ? (
              <Text style={styles.heroSubtitle}>{secondaryTitle}</Text>
            ) : null}
            <View style={styles.heroChips}>
              {anime.type ? <Text style={styles.heroChip}>{anime.type}</Text> : null}
              {anime.status ? <Text style={styles.heroChip}>{anime.status}</Text> : null}
              {anime.episodes ? (
                <Text style={styles.heroChip}>{anime.episodes} episodi</Text>
              ) : null}
              {anime.duration ? <Text style={styles.heroChip}>{anime.duration}</Text> : null}
            </View>
          </View>
        </View>

        {stats.length ? (
          <View style={styles.statsRow}>
            {stats.map((item) => (
              <StatBadge key={item.label} {...item} />
            ))}
          </View>
        ) : null}

        <View style={styles.genreRow}>
          {renderTagList(anime.genres, 'Genere')}
          {renderTagList(anime.themes, 'Tema')}
          {renderTagList(anime.demographics, 'Demografia')}
        </View>

        <View style={styles.actionsRow}>
          <IconButton icon="bookmark-outline" size={24} onPress={() => {}} iconColor={theme.colors.text} />
          <IconButton
            icon={liked ? 'heart' : 'heart-outline'}
            iconColor={liked ? theme.colors.primary : theme.colors.text}
            size={24}
            onPress={onToggleLike}
          />
          <IconButton icon="eye-outline" size={24} onPress={() => {}} iconColor={theme.colors.text} />
          <IconButton icon="share-variant" size={24} onPress={() => {}} iconColor={theme.colors.text} />
        </View>

        <View style={styles.buttonRow}>
          <View style={styles.button}>
            <CustomButton mode="outlined" onPress={() => {}} textStyle={{}} style={{ borderColor: theme.colors.primary }}>
              Aggiungi alla lista
            </CustomButton>
          </View>
          <View style={styles.button}>
            <CustomButton mode="contained" onPress={() => setShowStreaming(true)}>
              Inizia la visione
            </CustomButton>
          </View>
        </View>

        <View style={styles.userRatingSection}>
          <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>
            La tua valutazione
          </Text>
          <StarRating rating={rating} onRate={onRate} size={28} color={theme.colors.warning} />
        </View>
        <GeneralSection
          anime={anime}
          loading={loading}
          recommendations={recommendations}
          onSelectAnime={handleRecommendationPress}
        />
        <CastSection characters={characters} staff={staff} loading={castLoading} />
        <CommentsSection anime={anime} />
        <ListsSection />
      </ScrollView>
      <Portal>
        <Dialog
          visible={showStreaming}
          onDismiss={() => setShowStreaming(false)}
          style={styles.streamingDialog}
        >
          <Dialog.Title>Dove guardarlo</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={{ paddingVertical: theme.spacing.sm }}>
              {anime.streaming?.length ? (
                anime.streaming.map((service) => (
                  <TouchableOpacity
                    key={`${service.name}-${service.url}`}
                    style={styles.streamingItem}
                    onPress={() => {
                      Linking.openURL(service.url).catch(() => {});
                      setShowStreaming(false);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="play-circle-outline"
                      size={22}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.streamingText}>{service.name}</Text>
                    <MaterialCommunityIcons
                      name="open-in-new"
                      size={18}
                      color={theme.colors.textSecondary}
                      style={{ marginLeft: 'auto' }}
                    />
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyText}>Nessun link di streaming disponibile.</Text>
              )}
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <CustomButton mode="outlined" onPress={() => setShowStreaming(false)}>
              Chiudi
            </CustomButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

function GeneralSection({ anime, loading, recommendations, onSelectAnime }: GeneralTabProps) {
  const infoItems = useMemo(
    () =>
      [
        { label: 'Formato', value: anime.type },
        { label: 'Stato', value: anime.status },
        { label: 'Origine', value: anime.source },
        { label: 'Durata', value: anime.duration },
        { label: 'Rating', value: anime.rating },
        { label: 'Premiered', value: formatSeason(anime.season, anime.year) },
        { label: 'In onda', value: anime.aired?.string },
        { label: 'Trasmissione', value: anime.broadcast?.string },
      ].filter((item) => Boolean(item.value)),
    [anime.type, anime.status, anime.source, anime.duration, anime.rating, anime.season, anime.year, anime.aired?.string, anime.broadcast?.string],
  );

  const altTitles = useMemo(() => {
    const titles: string[] = [];
    if (anime.title_english && anime.title_english !== anime.title) titles.push(anime.title_english);
    if (anime.title_japanese && anime.title_japanese !== anime.title) titles.push(anime.title_japanese);
    if (anime.title_synonyms?.length) titles.push(...anime.title_synonyms);
    return titles;
  }, [anime.title, anime.title_english, anime.title_japanese, anime.title_synonyms]);

  if (loading) {
    return (
      <View style={styles.tabContainer}>
        <ActivityIndicator style={{ marginVertical: theme.spacing.lg }} />
      </View>
    );
  }

  return (
    <View style={styles.tabContainer}>
      <SectionHeader title="Trama" />
      <Text style={styles.paragraph}>
        {anime.synopsis || 'Nessuna sinossi disponibile.'}
      </Text>

      {anime.background ? (
        <>
          <SectionHeader title="Background" />
          <Text style={styles.paragraph}>{anime.background}</Text>
        </>
      ) : null}

      {altTitles.length ? (
        <>
          <SectionHeader title="Altri titoli" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
            {altTitles.map((title) => (
              <Tag key={title}>{title}</Tag>
            ))}
          </View>
        </>
      ) : null}

      {infoItems.length ? (
        <>
          <SectionHeader title="Informazioni" />
          <View style={styles.infoGrid}>
            {infoItems.map((item) => (
              <View key={item.label} style={styles.infoItem}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}

      <ChipList title="Studios" items={anime.studios} />
      <ChipList title="Producers" items={anime.producers} />
      <ChipList title="Licenziatari" items={anime.licensors} />
      <ChipList title="Generi" items={anime.genres} />
      <ChipList title="Temi" items={anime.themes} />
      <ChipList title="Demografie" items={anime.demographics} />

      {anime.theme?.openings?.length ? (
        <>
          <SectionHeader title="Opening" />
          {anime.theme.openings.map((song, index) => (
            <Text key={`${song}-${index}`} style={styles.listItem}>
              • {song}
            </Text>
          ))}
        </>
      ) : null}

      {anime.theme?.endings?.length ? (
        <>
          <SectionHeader title="Ending" />
          {anime.theme.endings.map((song, index) => (
            <Text key={`${song}-${index}`} style={styles.listItem}>
              • {song}
            </Text>
          ))}
        </>
      ) : null}

      <LinkList title="Streaming" icon="play-circle-outline" items={anime.streaming} />
      <LinkList title="Link esterni" icon="open-in-new" items={anime.external} />

      {anime.relations?.length ? (
        <>
          <SectionHeader title="Relazioni" />
          <View style={{ gap: theme.spacing.sm }}>
            {anime.relations.map((relation) => (
              <View key={relation.relation} style={styles.relationCard}>
                <Text style={styles.relationTitle}>{relation.relation}</Text>
                {relation.entry.map((entry) => (
                  <TouchableOpacity
                    key={entry.mal_id}
                    style={styles.relationLink}
                    onPress={() => {
                      if (entry.url) {
                        Linking.openURL(entry.url).catch(() => {});
                      }
                    }}
                  >
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={18}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.relationText}>{entry.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </>
      ) : null}

      {recommendations.length ? (
        <>
          <SectionHeader title="Consigliati" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: theme.spacing.md }}>
            {recommendations.slice(0, 12).map((item) => (
              <View key={item.anime.mal_id} style={styles.recommendationCard}>
                <PosterCard item={item.anime} width={140} onPress={() => onSelectAnime(item.anime)} />
                <Text style={styles.recommendationVotes}>{formatNumber(item.votes)} voti</Text>
              </View>
            ))}
          </ScrollView>
        </>
      ) : null}
    </View>
  );
}

function CastSection({ characters, staff, loading }: CastTabProps) {
  if (loading) {
    return (
      <View style={styles.tabContainer}>
        <ActivityIndicator style={{ marginVertical: theme.spacing.lg }} />
      </View>
    );
  }

  const mainCharacters = characters.filter((item) => item.role === 'Main').slice(0, 8);
  const supportingCharacters = characters.filter((item) => item.role !== 'Main').slice(0, 8);
  const mainStaff = staff.slice(0, 8);

  return (
    <View style={styles.tabContainer}>
      <SectionHeader title="Personaggi principali" />
      {mainCharacters.length ? (
        <View style={{ gap: theme.spacing.md }}>
          {mainCharacters.map((character) => (
            <CharacterCard key={character.character.mal_id} item={character} />
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>Nessuna informazione disponibile.</Text>
      )}

      {supportingCharacters.length ? (
        <>
          <SectionHeader title="Personaggi secondari" />
          <View style={{ gap: theme.spacing.md }}>
            {supportingCharacters.map((character) => (
              <CharacterCard key={character.character.mal_id} item={character} />
            ))}
          </View>
        </>
      ) : null}

      {mainStaff.length ? (
        <>
          <SectionHeader title="Staff" />
          <View style={{ gap: theme.spacing.sm }}>
            {mainStaff.map((staffer) => (
              <View key={staffer.person.mal_id} style={styles.staffRow}>
                <MaterialCommunityIcons
                  name="account-tie"
                  size={18}
                  color={theme.colors.primary}
                  style={{ marginRight: theme.spacing.sm }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.staffName}>{staffer.person.name}</Text>
                  <Text style={styles.staffRoles}>{staffer.positions.join(', ')}</Text>
                </View>
              </View>
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
}

type TabProps = {
  anime: Anime;
};

function CommentsSection({ anime }: TabProps) {
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const storedComments = await getCommentsForAnime(anime.mal_id);
      setComments(storedComments);
    })();
  }, [anime.mal_id]);

  async function onAddComment() {
    const trimmed = newComment.trim();
    if (!trimmed) return;
    try {
      setSubmitting(true);
      await addComment(anime.mal_id, trimmed);
      setComments((prev) => [...prev, trimmed]);
      setNewComment('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.tabContainer}>
      {comments.length === 0 ? (
        <Text style={styles.emptyText}>Nessun commento ancora. Scrivi il primo!</Text>
      ) : (
        <View style={{ gap: theme.spacing.sm }}>
          {comments.map((comment, index) => (
            <View key={`${comment}-${index}`} style={styles.commentBubble}>
              <MaterialCommunityIcons
                name="comment-quote"
                size={18}
                color={theme.colors.primary}
                style={{ marginRight: theme.spacing.sm }}
              />
              <Text style={[theme.typography.body2, { color: theme.colors.text }]}>{comment}</Text>
            </View>
          ))}
        </View>
      )}

      <TextInput
        mode="outlined"
        placeholder="Aggiungi un commento…"
        value={newComment}
        onChangeText={setNewComment}
        multiline
        style={{ marginTop: theme.spacing.lg }}
        outlineColor={theme.colors.border}
        activeOutlineColor={theme.colors.primary}
        textColor={theme.colors.text}
      />
      <CustomButton
        mode="contained"
        onPress={onAddComment}
        style={[styles.commentButton, submitting && styles.commentButtonLoading]}
        disabled={!newComment.trim() || submitting}
      >
        {submitting ? 'Invio…' : 'Invia'}
      </CustomButton>
    </View>
  );
}

const ListsSection = () => (
  <View style={styles.tabContainer}>
    <Text style={styles.emptyText}>Le integrazioni con le liste arriveranno presto.</Text>
  </View>
);

type StatBadgeProps = {
  label: string;
  value: string;
  icon: string;
  helper?: string;
};

function StatBadge({ label, value, icon, helper }: StatBadgeProps) {
  return (
    <View style={styles.statBadge}>
      <MaterialCommunityIcons name={icon} size={18} color={theme.colors.primary} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {helper ? <Text style={styles.statHelper}>{helper}</Text> : null}
    </View>
  );
}

function CharacterCard({ item }: { item: AnimeCharacter }) {
  const image =
    item.character.images?.jpg?.image_url ||
    item.character.images?.webp?.image_url ||
    item.character.images?.jpg?.small_image_url;

  const voiceActor =
    item.voice_actors.find((actor) => actor.language === 'Japanese') ?? item.voice_actors[0];

  return (
    <View style={styles.characterCard}>
      {image ? (
        <Image source={{ uri: image }} style={styles.characterImage} />
      ) : (
        <View style={[styles.characterImage, styles.characterPlaceholder]}>
          <MaterialCommunityIcons name="account" size={24} color={theme.colors.muted} />
        </View>
      )}

      <View style={styles.characterInfo}>
        <Text style={styles.characterName}>{item.character.name}</Text>
        <Text style={styles.characterRole}>{item.role}</Text>
        {voiceActor ? (
          <View style={styles.voiceActorRow}>
            <MaterialCommunityIcons name="account-voice" size={16} color={theme.colors.primary} />
            <Text style={styles.voiceActorName}>{voiceActor.person.name}</Text>
            <Text style={styles.voiceActorLanguage}>{voiceActor.language}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <Text style={styles.sectionTitle}>
      {title}
    </Text>
  );
}

function ChipList({ title, items }: { title: string; items?: NamedEntity[] | null }) {
  if (!items?.length) return null;
  return (
    <View style={{ marginTop: theme.spacing.lg }}>
      <SectionHeader title={title} />
      <View style={styles.tagList}>
        {items.map((item) => (
          <Tag key={`${title}-${item.mal_id}-${item.name}`}>{item.name}</Tag>
        ))}
      </View>
    </View>
  );
}

function LinkList({ title, icon, items }: { title: string; icon: string; items?: AnimeStream[] | null }) {
  if (!items?.length) return null;
  return (
    <View style={{ marginTop: theme.spacing.lg }}>
      <SectionHeader title={title} />
      <View style={{ gap: theme.spacing.sm }}>
        {items.map((item) => (
          <TouchableOpacity
            key={`${title}-${item.name}-${item.url}`}
            style={styles.linkRow}
            onPress={() => {
              Linking.openURL(item.url).catch(() => {});
            }}
          >
            <MaterialCommunityIcons name={icon} size={18} color={theme.colors.primary} />
            <Text style={styles.linkText}>{item.name}</Text>
            <MaterialCommunityIcons
              name="open-in-new"
              size={18}
              color={theme.colors.muted}
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function renderTagList(items?: NamedEntity[] | null, label?: string) {
  if (!items?.length) return null;
  return (
    <View style={styles.heroTagGroup}>
      {label ? <Text style={styles.heroTagLabel}>{label}</Text> : null}
      <View style={styles.heroTagList}>
        {items.slice(0, 3).map((item) => (
          <Text key={item.mal_id} style={styles.heroGenre}>
            {item.name}
          </Text>
        ))}
      </View>
    </View>
  );
}

function formatNumber(value?: number | null) {
  if (value == null) return '—';
  return new Intl.NumberFormat('it-IT').format(value);
}

function formatSeason(season?: string | null, year?: number | null) {
  if (!season && !year) return null;
  const capitalized = season ? season.charAt(0).toUpperCase() + season.slice(1) : '';
  return [capitalized, year ?? ''].filter(Boolean).join(' ').trim();
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    height: 320,
    position: 'relative',
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
    top: 0,
  },
  heroContent: {
    position: 'absolute',
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    bottom: theme.spacing.lg,
  },
  heroTitle: {
    ...theme.typography.h1,
    color: theme.colors.white,
  } as const,
  heroSubtitle: {
    ...theme.typography.subtitle2,
    color: theme.colors.muted,
    marginTop: theme.spacing.xs,
  } as const,
  heroChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  heroChip: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.radii.pill,
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: theme.colors.white,
    ...theme.typography.caption,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  statBadge: {
    minWidth: 110,
    padding: theme.spacing.sm,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.elevation.level1,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statValue: {
    ...theme.typography.subtitle1,
    color: theme.colors.text,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  statHelper: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  genreRow: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  heroTagGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  heroTagLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
  },
  heroTagList: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  heroGenre: {
    ...theme.typography.body2,
    color: theme.colors.text,
    backgroundColor: theme.colors.elevation.level1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radii.pill,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    marginTop: theme.spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
  },
  userRatingSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  tabContainer: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.subtitle2,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  paragraph: {
    ...theme.typography.body1,
    color: theme.colors.text,
    lineHeight: 22,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  infoItem: {
    width: '48%',
    backgroundColor: theme.colors.elevation.level1,
    borderRadius: theme.radii.md,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  infoValue: {
    ...theme.typography.body2,
    color: theme.colors.text,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  tag: {
    backgroundColor: theme.colors.elevation.level1,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tagText: {
    ...theme.typography.body2,
    color: theme.colors.text,
  },
  listItem: {
    ...theme.typography.body2,
    color: theme.colors.text,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.elevation.level1,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  linkText: {
    ...theme.typography.body1,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  relationCard: {
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.elevation.level1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.xs,
  },
  relationTitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
  },
  relationLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  relationText: {
    ...theme.typography.body2,
    color: theme.colors.text,
  },
  recommendationCard: {
    width: 140,
    gap: theme.spacing.xs,
  },
  recommendationVotes: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  emptyText: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  commentBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.elevation.level1,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  commentButton: {
    alignSelf: 'flex-end',
    marginTop: theme.spacing.sm,
  },
  commentButtonLoading: {
    opacity: 0.7,
  },
  characterCard: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  characterImage: {
    width: 64,
    height: 96,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.elevation.level1,
  },
  characterPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterInfo: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  characterName: {
    ...theme.typography.subtitle2,
    color: theme.colors.text,
  },
  characterRole: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  voiceActorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  voiceActorName: {
    ...theme.typography.caption,
    color: theme.colors.text,
  },
  voiceActorLanguage: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  staffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.elevation.level1,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  staffName: {
    ...theme.typography.body2,
    color: theme.colors.text,
  },
  staffRoles: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  streamingDialog: {
    backgroundColor: theme.colors.elevation.level1,
  },
  streamingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.elevation.level0,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  streamingText: {
    ...theme.typography.body1,
    color: theme.colors.text,
  },
});
