import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Button, Chip, Text, useTheme } from 'react-native-paper';
import { WatchEntry, WatchStatus, Anime } from '../types';
import { getWatchlist, removeFromWatchlist, updateProgress, updateStatus } from '../storage/watchlist';
import AnimeCard from '../components/AnimeCard';
import EpisodeStepper from '../components/EpisodeStepper';
import { useNavigation } from '@react-navigation/native';

const STATI: WatchStatus[] = ['Watching', 'Completed', 'On Hold', 'Dropped', 'Plan to Watch'];

export default function FavoritesScreen() {
  const theme = useTheme();
  const [list, setList] = useState<WatchEntry[]>([]);
  const [filter, setFilter] = useState<WatchStatus | 'All'>('All');
  const navigation = useNavigation<any>();

  async function load() {
    const l = await getWatchlist();
    setList(l);
  }

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      load();
    });
    load();
    return unsub;
  }, []);

  const filtered = filter === 'All' ? list : list.filter(e => e.status === filter);

  async function onRemove(id: number) {
    await removeFromWatchlist(id);
    await load();
  }

  async function onProgress(id: number, next: number) {
    await updateProgress(id, next);
    await load();
  }

  async function onStatus(id: number, s: WatchStatus) {
    await updateStatus(id, s);
    await load();
  }

  return (
    <View style={{ flex: 1, padding: 12, backgroundColor: theme.colors.background }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        <Chip selected={filter === 'All'} onPress={() => setFilter('All')}>All</Chip>
        {STATI.map(s => (
          <Chip key={s} selected={filter === s} onPress={() => setFilter(s)}>{s}</Chip>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingVertical: 6 }}
        renderItem={({ item }) => (
          <AnimeCard
            item={{
              mal_id: item.id,
              title: item.title,
              episodes: item.totalEpisodes ?? undefined,
              images: { jpg: { image_url: item.image } }
            } as Anime}
            onPress={() => navigation.navigate('Details', { anime: { mal_id: item.id, title: item.title } as any })}
            right={
              <View style={{ gap: 8 }}>
                <EpisodeStepper
                  value={item.progress}
                  max={item.totalEpisodes ?? null}
                  onChange={(v) => onProgress(item.id, v)}
                />
                <Row>
                  <Button compact mode="contained" onPress={() => onProgress(item.id, Math.max(0, item.progress - 1))}>-</Button>
                  <Button compact mode="contained" onPress={() => onProgress(item.id, item.totalEpisodes ? Math.min(item.totalEpisodes, item.progress + 1) : item.progress + 1)}>+</Button>
                  <Button compact mode="contained" onPress={() => onStatus(item.id, 'Completed')}>✓</Button>
                  <Button compact mode="contained" icon="delete" onPress={() => onRemove(item.id)}>Delete</Button>
                </Row>
                <Text variant="bodySmall">Stato: {item.status}</Text>
              </View>
            }
          />
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 24 }}>
            La tua watchlist è vuota.
          </Text>
        }
      />
    </View>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>{children}</View>;
}
